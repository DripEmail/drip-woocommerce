#!/bin/bash
set -e

docker-compose exec -T -e MYSQL_PWD=woocommerce db mysql -u woocommerce woocommerce -e "DROP DATABASE woocommerce; CREATE DATABASE woocommerce"
docker-compose exec -T -e MYSQL_PWD=woocommerce db mysql -u woocommerce woocommerce < db_data/dump.sql
