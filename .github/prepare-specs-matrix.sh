#!/usr/bin/env bash

find ./ -name "*.spec.js" |
  sed 's/\.\///' | 
  #based on https://stackoverflow.com/a/10234625/4747028:
  awk ' BEGIN { ORS = ""; print "["; } { print "\/\@"$0"\/\@"; } END { print "]"; }' | 
  sed "s^\"^\\\\\"^g;s^\/\@\/\@^\", \"^g;s^\/\@^\"^g"
