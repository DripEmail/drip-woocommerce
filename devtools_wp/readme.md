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
 - Spin up Docker and Magento, run setup.sh in the devtools_m1 directory
 ```aidl
./setup.sh
```

You can access the admin at http://localhost:3007/

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
