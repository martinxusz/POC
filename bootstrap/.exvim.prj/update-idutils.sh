#!/bin/bash
export DEST="./.exvim.prj"
export TOOLS="/home/martin/exvim//vimfiles/tools/"
export TMP="${DEST}/_ID"
export TARGET="${DEST}/ID"
sh ${TOOLS}/shell/bash/update-idutils.sh
