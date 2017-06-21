@echo off
set DEST=.\.exvim.prj
set TOOLS=d:\work\Vim\vim80\..\..\exvim\\vimfiles\tools\
set EXCLUDE_FOLDERS=
set TMP=%DEST%\_ID
set TARGET=%DEST%\ID
call %TOOLS%\shell\batch\update-idutils.bat
