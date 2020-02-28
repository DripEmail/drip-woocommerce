#!/usr/bin/env bash

set -euo pipefail

cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

if [[ ! -z "$(git status --porcelain)" ]]; then
  >&2 echo "ERROR: working copy dirty"
  exit 1
fi

branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "master" ]]; then
  >&2 echo "ERROR: you are not on the master branch"
  exit 1
fi

if ! command -v ghr >/dev/null 2>&1; then
  >&2 echo "ERROR: ghr not found in PATH, please install: https://github.com/tcnksm/ghr"
  exit 1
fi

if [[ -z "$GITHUB_TOKEN" ]]; then
  >&2 echo "ERROR: GITHUB_TOKEN env var not set, this is required to upload release to github"
  exit 1
fi

plugin_version=$(grep -e '^Version: ' drip.php | awk '{print $2}')
if [[ -z "$plugin_version" ]]; then
  >&2 echo "ERROR: unable to parse plugin version from drip.php"
  exit 1
fi

echo "Using version from plugin metadata: $plugin_version"

git fetch origin

if git tag | grep -q "$plugin_version"; then
  >&2 echo "ERROR: tag $plugin_version already exists!"
  exit 1
fi

comment="Creating tag and github release '$plugin_version'. Is this correct?"
while true; do
  read -rp "$comment [yes/no] ? " yn
  case $yn in
    [Yy]* ) break;;
    [Nn]* ) echo "Goodbye!"; exit;;
    * ) echo "Please answer yes or no.";;
  esac
done

# create and push tag

if [[ -z "$(git config user.signingkey)" ]]; then
  >&2 echo "WARNING: creating unsigned tag"
  tag_arg="-a"
else
  tag_arg="-s"
fi

git tag "$tag_arg" "$plugin_version" -m "Release $plugin_version"
git push origin "$plugin_version"

# generate release zip and upload to github

[[ -d dist ]] && rm -rf dist # ensure old dist is not uploaded
mkdir -p dist
trap "rm -rf dist" EXIT
zipball=$(bin/make_zipball.sh | tail -1)
mv "$zipball" "dist/drip-woocommerce-${plugin_version}.zip"
ghr "$plugin_version" dist
