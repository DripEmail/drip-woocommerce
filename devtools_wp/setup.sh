#!/bin/bash
set -e

# Spin up a new instance of WooCommerce
# Add --build when you need to rebuild the Dockerfile.
docker-compose up -d

port=$(docker-compose port web 80 | cut -d':' -f2)

# Wait for the DB to be up.
docker-compose exec -T db /bin/bash -c 'while ! mysql --protocol TCP -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "show databases;" > /dev/null 2>&1; do sleep 1; done'

woocommerce_setup_script=$(cat <<SCRIPT
cd /var/www/html/ && \
wp core install --url="http://localhost:$port" --title="drip_woocommerce_test" --admin_user="drip" --admin_email="drip@example.com" --admin_password="abc1234567890" --skip-email && \
wp plugin activate woocommerce && \
wp plugin activate drip-woocommerce && \
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
SCRIPT
)

docker-compose exec -T -u www-data web /bin/bash -c "$woocommerce_setup_script"

# echo "Backing up database for later reset"
mkdir -p db_data
docker-compose exec -e MYSQL_PWD=woocommerce db mysqldump -u woocommerce woocommerce > db_data/dump.sql
