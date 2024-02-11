#!/bin/bash

git checkout --quiet main
something_changed=$(git diff-index --exit-code --ignore-submodules HEAD)
if [ -n "$something_changed" ]
then
    echo >&2 "main has some changes, I cannot deploy."
    exit 1
fi

commit_id=$(git show-ref --head | head -c6)
git switch -c gh-pages
git checkout main -- src

version_name=${commit_id}
if [ $# -eq 1 ]
then
    version_name=$1
fi

mkdir -p hist/${version_name}
cp -r src/* hist/${version_name}
mv src/css css
mv src/js js
mv src/index.html index.html
rm -rf src

touch .nojekyll
date > version.txt

git add -A .
git commit -m "deploy $version_name ($commit_id)"
git push -f origin gh-pages

git checkout main
git clean -df