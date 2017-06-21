@echo off
set DEST=.\.exvim.prj
set TOOLS=d:\work\Vim\vim80\..\..\exvim\\vimfiles\tools\
set CTAGS_CMD=ctags
set OPTIONS=--fields=+iaS --extra=+q
set TMP=%DEST%\_tags
set TARGET=%DEST%\tags
call %TOOLS%\shell\batch\update-tags.bat
