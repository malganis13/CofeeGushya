#!/bin/bash
# Собирает один самодостаточный index.html из частей в src/
set -e
cd "$(dirname "$0")"
P=src
cat $P/head.html $P/core.js $P/fortune.js $P/grounds.js $P/plant.js $P/gacha.js $P/shop.js $P/ritual.js $P/share.js $P/main.js $P/tail.html > index.html
echo "index.html собран ($(wc -c < index.html) байт)"
