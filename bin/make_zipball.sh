#!/usr/bin/env bash

set -e

cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
dir=${PWD##*/}

if [[ ! -z "$(git status --porcelain)" ]]; then
  >&2 echo "WARNING: your working copy is dirty"
fi

branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "master" ]]; then
  >&2 echo "WARNING: you are not on the master branch"
fi

version=$(cat drip-woocommerce.php | grep -e '^Version: ' | awk '{print $2}')
if [[ -z "$version" ]]; then
  >&2 echo "ERROR: unable to parse version from drip-woocommerce.php"
  exit 1
fi

outdir="${1:-/tmp}"
if [[ -z "$outdir" ]] || [[ ! -d "$outdir" ]]; then
  >&2 echo "ERROR: invalid outdir: '$outdir'"
  exit 1
fi

echo $(git rev-parse HEAD) > REVISION
trap "rm -f $dir/REVISION" EXIT

cd ..
name="drip-woocommerce-${branch}-${version}"
zipball="${outdir}/${name}.zip"
zip -r $zipball \
  $dir/REVISION \
  $dir/license.txt \
  $dir/readme.txt \
  $dir/drip-woocommerce.php \
  $dir/src

echo $zipball
