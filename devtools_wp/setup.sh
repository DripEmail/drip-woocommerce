#!/bin/bash
set -e

# Spin up a new instance of WooCommerce
# Add --build when you need to rebuild the Dockerfile.
docker-compose up -d --build

port=$(docker-compose port web 80 | cut -d':' -f2)

# Wait for the DB to be up.
docker-compose exec -T db /bin/bash -c 'while ! mysql --protocol TCP -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "show databases;" > /dev/null 2>&1; do sleep 1; done'

woocommerce_setup_script=$(cat <<SCRIPT
cd /var/www/html/ && \
/usr/local/bin/wp core install --url="http://localhost:$port" --title="drip_woocommerce_test" --admin_user="drip" --admin_email="drip@example.com" --admin_password="abc1234567890" --skip-email && \
/usr/local/bin/wp plugin activate woocommerce && \
/usr/local/bin/wp plugin activate drip; \
/usr/local/bin/wp media import https://cdn3.iconfinder.com/data/icons/nature-emoji/50/Forest-512.png
CART_PAGE_ID=\$(/usr/local/bin/wp post create --post_type=page --post_author="drip" --post_title="My Fair Cart" --post_name="My Fair Cart" --post_content="[woocommerce_cart]" --post_status="publish" --porcelain) && \
/usr/local/bin/wp option set woocommerce_cart_page_id \$CART_PAGE_ID --autoload='yes'; \
CHKOUT_PAGE_ID=\$(/usr/local/bin/wp post create --post_type=page --post_author="drip" --post_title="My Fair Checkout" --post_name="My Fair Checkout" --post_content="[woocommerce_checkout]" --post_status="publish" --porcelain) && \
/usr/local/bin/wp option set woocommerce_checkout_page_id \$CHKOUT_PAGE_ID --autoload='yes'; \
/usr/local/bin/wp option set woocommerce_cod_settings '{"enabled":"yes","title":"Cash on delivery","description":"Pay with cash upon delivery.","instructions":"Pay with cash upon delivery.","enable_for_methods":"","enable_for_virtual":"yes"}' --autoload='yes' --format='json'; \
if ! grep -q drip_woo_test_force_mocks wp-includes/functions.php; then
cat << "EOF" >> wp-includes/functions.php
function drip_woo_test_force_mocks(\$is_external, \$host) {
	return \$is_external || 'mock' === \$host;
}
add_filter( 'http_request_host_is_external', 'drip_woo_test_force_mocks', 10, 2 );
function drip_woo_test_deliver_async() {
  return false;
}
add_filter( 'woocommerce_webhook_deliver_async', 'drip_woo_test_deliver_async', 10, 0);
EOF
fi
SCRIPT
)

composer="php /var/www/html/composer.phar"
update_bashrc_script=$(cat <<SCRIPT
if ! grep -q 'composer.phar' /root/.bashrc; then
  echo 'alias composer="$composer"' >> /root/.bashrc
fi
if ! grep -q 'composer/vendor' /root/.bashrc; then
  echo 'PATH=/root/.composer/vendor/bin:\${PATH}' >> /root/.bashrc
fi
if ! grep -q PHP_MEMORY_LIMIT /root/.bashrc; then
  echo 'export PHP_MEMORY_LIMIT=1G' >> /root/.bashrc
fi
SCRIPT
)

docker-compose exec -T -u root web /bin/bash -c "chown www-data wp-content"
docker-compose exec -T -u www-data web /bin/bash -c "$woocommerce_setup_script"
docker-compose exec -T -u root web /bin/bash -c "$(cat install-composer.sh)"
docker-compose exec -T -u root web /bin/bash -c "$update_bashrc_script"
docker-compose exec -T -u root web /bin/bash -c "$
$composer config --no-plugins allow-plugins.dealerdirect/phpcodesniffer-composer-installer true
"
docker-compose exec -T -u root web /bin/bash -c "
  $composer global require 'squizlabs/php_codesniffer=*' && \
    $composer require --dev \
      'dealerdirect/phpcodesniffer-composer-installer:^0.7' \
      'phpcompatibility/phpcompatibility-wp:*' && \
    $composer install
"
# All that to use phpcbf to automatically fix violations!
# ie. root@867cf9a0815c:/var/www/html/wp-content/plugins/woocommerce# phpcbf --extensions=php ../drip
# I don't know why this needs to be run from the woocommerce plugin directory

# echo "Backing up database for later reset"
mkdir -p db_data
touch db_data/dump.sql
docker-compose exec -e MYSQL_PWD=woocommerce db mysqldump --no-tablespaces -u woocommerce woocommerce > db_data/dump.sql
