#!/bin/sh
# template.sh DATE BODY

echo '<!doctype html>
<html lang="en">
<link rel="stylesheet" href="/styles.css">
<title>briano.io</title>
<nav>
<section>
<a href="/">briano.io</a>
<span>'"$1"'</span>
</section>
</nav>
<main>
<section>
'"$2"'
</section>
</main>'
