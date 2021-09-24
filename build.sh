#!/bin/sh
set -e

rm -rf dist
cp -R posts dist
cp styles.css dist/styles.css

for post in posts/*; do p=$(echo $post |sed 's/^[^\/]*\///')
	/bin/echo -n building $p'... '

	pandoc posts/$p/index.md -o dist/$p/body.html
	date=$(when.sh posts/$p/index.md)
	title=$(head -1 posts/$p/index.md)
	body=$(cat dist/$p/body.html)

	index=$index'<h3><a href="'$p'">'$title'</a></h3><p>'$date'</p>'
	template.sh "$date" "$body" >dist/$p/index.html

	echo Ok
done

template.sh '' "$index" >dist/index.html
