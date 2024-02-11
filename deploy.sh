#!/bin/bash
set -e

git checkout --quiet main

set +e
something_changed=$(git diff-index --exit-code --ignore-submodules HEAD)
set -e

if [ -n "$something_changed" ]
then
    echo >&2 "main has some changes, I cannot deploy."
    exit 1
fi

commit_id=$(git show-ref --head | head -c6)

set +e
gh_pages_exist=$(git show-ref --verify --quiet refs/heads/gh-pages)
set -e

if $gh_pages_exist; then
    git checkout gh-pages
else
    git checkout -b gh-pages
fi

git checkout main -- src

version_name=${commit_id}
if [ $# -eq 1 ]
then
    version_name=$1
fi

mkdir -p hist/${version_name}
cp -r src/* hist/${version_name}
rm -rf css js index.html
mv src/* .
rm -rf src

touch .nojekyll
date > version.txt

git add -A .
git commit -m "deploy $version_name ($commit_id)"
git push -f origin gh-pages

git checkout main
git clean -df