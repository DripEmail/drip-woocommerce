FROM wordpress:5.3.1-php7.2-apache

RUN curl https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp && chmod +x /usr/local/bin/wp
RUN apt-get update && apt-get install -y less unzip

RUN curl https://downloads.wordpress.org/plugin/woocommerce.3.8.1.zip -o /usr/src/woocommerce.zip && cd /usr/src/wordpress/wp-content/plugins && unzip /usr/src/woocommerce.zip
