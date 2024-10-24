FROM wordpress:6.6.2-php8.3-apache

RUN curl https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp && chmod +x /usr/local/bin/wp
RUN apt-get update && apt-get install -y less unzip vim wget vim-tiny net-tools

RUN curl https://downloads.wordpress.org/plugin/woocommerce.9.3.3.zip -o /usr/src/woocommerce.zip && cd /usr/src/wordpress/wp-content/plugins && unzip /usr/src/woocommerce.zip
