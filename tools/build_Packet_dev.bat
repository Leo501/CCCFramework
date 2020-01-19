@echo off

::Creator 安装目录
SET CREATOR_EXE=E:\CocosCreator1_9_1\CocosCreator.exe

::工程目录
SET PROJECT_DIR=E:\CreatorProject\CCCFramework

::热更新路径
SET HOTUPDATE_DIR=http://192.168.11.82/hotUpdate/

:menu
echo 欢迎使用打包脚本
echo 请选择项目: 
echo.&echo 【1】生成正式热更新包

set /p user_input=请输入数字后按Enter:
if %user_input% equ 1 goto build

echo 输入错误, 请重新输入数字.
pause
goto menu

:build
::更新正式版信息
::echo "--------start buildGameConfig"
::node BuildBeforeSetting.js
::开始第一次构建 
echo "--------start build"
%CREATOR_EXE% --path %PROJECT_DIR% --build "platform=android;debug=false"
:: 复制
echo "--------copy file"
node CopyHotFiles.js
::修改文件时间
echo "--------modify file"
python ModifyFileTime.py
:: 压缩
echo "--------zip file"
python ZipFile.py
::生成热更新文件 生成热更包
echo "--------build menifest"
node VersionGenerator.js
::取得热更新包
echo "--------export Hotupdate"
node ExportHotupdateDir.js

pause
goto menu


@pause on
