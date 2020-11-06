#!/usr/bin/env bash

# checkout
git clone git@github.com:handsontable/spreadsheet-viewer-dev.wiki.git wiki.dev

# publish wiki
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
DIR_DEV="$DIR/wiki.dev"
DIR_PUB="$DIR/wiki"

while read fileName; do
  echo "COPIED: $DIR_DEV/$fileName"
  cp $DIR_DEV/$fileName $DIR_PUB/$fileName
done < .wiki-public # LAST LINE SHOULD BE EMPTY!

# clean up
rm -rf $DIR/wiki.dev/
