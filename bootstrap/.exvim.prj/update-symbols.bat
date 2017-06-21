@echo off
set DEST=.\.exvim.prj
set TOOLS=d:\work\Vim\vim80\..\..\exvim\\vimfiles\tools\
set TMP=%DEST%\_symbols
set TARGET=%DEST%\symbols
call %TOOLS%\shell\batch\update-symbols.bat
