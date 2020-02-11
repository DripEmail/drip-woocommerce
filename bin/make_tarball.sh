#!/usr/bin/env bash

set -e

cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

if [[ ! -z "$(git status --porcelain)" ]]; then
  >&2 echo "WARNING: your working copy is dirty"
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" ]]; then
  >&2 echo "WARNING: you are not on the master branch"
fi

NAME="drip-woocommerce-${BRANCH}"
tarball="/tmp/${NAME}.tbz"
tar cjf $tarball -C ../ \
  drip-woocommerce/license.txt \
  drip-woocommerce/readme.txt \
  drip-woocommerce/src

echo $tarball
