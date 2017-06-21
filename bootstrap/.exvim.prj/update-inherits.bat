@echo off
set DEST=.\.exvim.prj
set TOOLS=d:\work\Vim\vim80\..\..\exvim\\vimfiles\tools\
set TMP=%DEST%\_inherits
set TARGET=%DEST%\inherits
call %TOOLS%\shell\batch\update-inherits.bat
