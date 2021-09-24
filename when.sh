#!/bin/sh
git log $1 | grep '^Date' | awk '
NR == 1 {
	changed = sprintf("%s %s %s", $4, $3, $6)
}
{
	created = sprintf("%s %s %s", $4, $3, $6)
}
END {
	printf("Posted on: %s", created)
	if (created != changed) {
		printf(", Updated: %s", changed)
	}
	print
}
'
