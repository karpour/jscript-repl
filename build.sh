#!/bin/bash

# Assemble html file

./interpolate ./src/repl.html > ./dist/repl.html

npx html-minifier-next -i ./dist/repl.html -c minify.json -o ./dist/repl_minified.html