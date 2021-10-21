#!/bin/bash
cd dist
sed -i'.bak' -e 's/\/src/src/g' index.html
sed -i'.bak' -e 's/="\//="..\/..\//g' src/testbed/index.html
sed -i'.bak' -e 's/\/sv-assets\/index.html/..\/..\/sv-assets\/index.html/g' *.js
rm *.bak
rm src/testbed/index.html.bak
