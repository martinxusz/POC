#!/bin/bash
export DEST="./.exvim.prj"
export TOOLS="/home/martin/exvim//vimfiles/tools/"
export TMP="${DEST}/_symbols"
export TARGET="${DEST}/symbols"
sh ${TOOLS}/shell/bash/update-symbols.sh
