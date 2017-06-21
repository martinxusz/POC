#!/bin/bash
export DEST="./.exvim.prj"
export TOOLS="/home/martin/exvim//vimfiles/tools/"
export TMP="${DEST}/_inherits"
export TARGET="${DEST}/inherits"
sh ${TOOLS}/shell/bash/update-inherits.sh
