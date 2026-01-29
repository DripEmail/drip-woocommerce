# Instructions for developing locally

## Setting up your environment

A few things need to be setup on your system prior to launching Docker and teh test suite:
 - make sure you have `npm` installed. Currently `npm` 6.11.3 is adequate
```bash
$ npm --version
6.11.3
```
 - in the `devtools_wp` directory, install the cypress test framework:
```bash
$ npm install
```
 - Spin up Docker and WooCommerce, run setup.sh in the devtools_wp directory
 ```aidl
./setup.sh
```

You can access the test site at http://localhost:3007/

## Multiple Stores Setup

Follow [this](https://woocommerce.com/posts/woocommerce-multiple-stores/) guide once the container is up and running.

## Running the tests

To start the cypress test runner ...

```bash
cd devtools_wp/
./node_modules/.bin/cypress open
```

...which will open a small window that allows test execution.

## Full reset

```bash
cd devtools_wp/
docker-compose.sh down
rm -rf db_data/
```

Then run `setup.sh` to bring a clean instance back up.

## Releasing a new plugin version

Update the version in `drip.php` and `readme.txt`. Fill in the changelog.

Run `bin/release.sh` to create and release new tag on github

Ensure you have a local copy of `https://plugins.svn.wordpress.org/drip/`. `svn co https://plugins.svn.wordpress.org/drip/` will fetch it.

Run `bin/publish.sh -v VERSION -r PATH/TO/SVN`, e.g. `bin/publish.sh -v 1.1.1 -r /Users/iannance/code/svn/drip`
