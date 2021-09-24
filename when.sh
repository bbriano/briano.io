#!/bin/sh
git log $1 | awk '
/^Date/ {
	created = sprintf("%s %s %s", $4, $3, $6)
}
END {
	print created
}
'
