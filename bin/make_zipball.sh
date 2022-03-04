#!/usr/bin/env bash

set -e

cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
dir=${PWD##*/}

if [[ ! -z "$(git status --porcelain)" ]]; then
  >&2 echo "WARNING: your working copy is dirty"
fi

branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "main" ]]; then
  >&2 echo "WARNING: you are not on the main branch"
fi

version=$(cat drip.php | grep -e '^Version: ' | awk '{print $2}')
if [[ -z "$version" ]]; then
  >&2 echo "ERROR: unable to parse version from drip.php"
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
name="drip-${branch}-${version}"
zipball="${outdir}/${name}.zip"
zip -r $zipball \
  $dir/REVISION \
  $dir/license.txt \
  $dir/readme.txt \
  $dir/drip.php \
  $dir/src \
  $dir/assets

echo $zipball
