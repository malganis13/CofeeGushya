#!/bin/bash
# Собирает один самодостаточный index.html из частей в src/
set -e
cd "$(dirname "$0")"
P=src
cat $P/head.html $P/core.js $P/fortune.js $P/grounds.js $P/data2.js $P/plant.js $P/gacha.js $P/shop.js $P/ritual.js $P/share.js $P/guests.js $P/alchemy.js $P/talents.js $P/tarot.js $P/juice.js $P/main.js $P/audio.js $P/brew.js $P/guests2.js $P/tail.html > index.html
echo "index.html собран ($(wc -c < index.html) байт)"
