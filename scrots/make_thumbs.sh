#!/bin/sh
find full/* -type f -exec convert {} -resize 300 {}_thumb.png \;
mv full/*thumb.png thumb
