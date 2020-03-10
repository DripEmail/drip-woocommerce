#!/usr/bin/env bash

set -euo pipefail

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$dir"

NAME=$(basename "$0")

function usage() {
  local ret=${1:-0}
  >&2 cat <<-EOF
USAGE $ ./${NAME} -r|--repository PATH/TO/SVN/REPO -v|--version VERSION [-n|--dry-run] [-h|--help]

WHERE
  repository  Path to local working copy of
              https://plugins.svn.wordpress.org/drip/

  version     Already released git tag of version to publish.
              Use bin/release.sh to create and release new tag on github
              prior to running this script.

  dry-run     Do not commit tag to svn repo, just show status.

  help        Print this message
EOF
  exit "$ret"
}

while (( "$#" )); do
  case "$1" in
    -r|--repository)
      REPOSITORY=$2
      shift 2
      ;;
    -v|--version)
      VERSION=$2
      shift 2
      ;;
    -n|--dry-run)
      DRY_RUN="true"
      shift 1
      ;;
    -h|--help)
      usage
      ;;
    --) # end argument parsing
      shift
      break
      ;;
    -*) # unsupported flags
      >&2 echo "ERROR: Unsupported flag $1"
      usage 1
      ;;
    *) # preserve positional arguments
      PARAMS="$PARAMS $1"
      shift
      ;;
  esac
done

# ensure working copy is clean

if [[ ! -z "$(git status --porcelain)" ]]; then
  >&2 echo "ERROR: your git working copy has local changes"
  exit 1
fi

# validate repository

if [[ -z "$REPOSITORY" ]]; then
  >&2 echo "ERROR: repository is required"
  usage 1
elif [[ ! -d "$REPOSITORY" ]]; then
  >&2 echo "ERROR: repository dir $REPOSITORY does not exist"
  usage 1
fi

# validate version

if [[ -z "$VERSION" ]]; then
  >&2 echo "ERROR: version is required"
  usage 1
fi

# check that tag for version already exists

git fetch origin --tags >/dev/null 2>&1
if ! git rev-parse "$VERSION^{tag}" >/dev/null 2>&1; then
  >&2 echo "ERROR: tag for version in git repository does not exist: $VERSION"
  exit 1
fi

# update repository

cd "$REPOSITORY"

if ! svn status -q; then
  >&2 echo "ERROR: your svn working copy has local changes"
  usage 1
fi

svn update >/dev/null 2>&1

# Check that tag does not already exist in svn repository
dst="$REPOSITORY/tags/$VERSION"
if [[ -d "$dst" ]]; then
  >&2 echo "ERROR: tag for version in svn repository already exists: $dst"
  exit 1
fi

mkdir -p "$dst"

cd "$dir"

git archive --format=tar "$VERSION" \
  license.txt \
  readme.txt \
  drip.php \
  src \
  | tar x -C "$dst"

cd "$REPOSITORY"
cp "tags/$VERSION/readme.txt" trunk/readme.txt

if [[ "$DRY_RUN" = "true" ]]; then
  svn status
else
  svn add trunk/readme.txt "tags/$VERSION"
  svn commit -m "Publish version $VERSION"
fi
