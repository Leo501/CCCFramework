@echo off

::Creator ��װĿ¼
SET CREATOR_EXE=E:\CocosCreator1_9_1\CocosCreator.exe

::����Ŀ¼
SET PROJECT_DIR=E:\CreatorProject\CCCFramework

::�ȸ���·��
SET HOTUPDATE_DIR=http://192.168.11.82/hotUpdate/

:menu
echo ��ӭʹ�ô���ű�
echo ��ѡ����Ŀ: 
echo.&echo ��1��������ʽ�ȸ��°�

set /p user_input=���������ֺ�Enter:
if %user_input% equ 1 goto build

echo �������, ��������������.
pause
goto menu

:build
::������ʽ����Ϣ
::echo "--------start buildGameConfig"
::node BuildBeforeSetting.js
::��ʼ��һ�ι��� 
echo "--------start build"
%CREATOR_EXE% --path %PROJECT_DIR% --build "platform=android;debug=false"
:: ����
echo "--------copy file"
node CopyHotFiles.js
::�޸��ļ�ʱ��
echo "--------modify file"
python ModifyFileTime.py
:: ѹ��
echo "--------zip file"
python ZipFile.py
::�����ȸ����ļ� �����ȸ���
echo "--------build menifest"
node VersionGenerator.js
::ȡ���ȸ��°�
echo "--------export Hotupdate"
node ExportHotupdateDir.js

pause
goto menu


@pause on
