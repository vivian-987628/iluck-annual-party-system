@echo off
echo ========================================
echo Node.js 自动安装脚本 - Windows版
echo ========================================
echo.

:: 检查是否已安装Node.js
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [信息] Node.js已安装
    node --version
    npm --version
    echo.
    echo [信息] 开始启动iLuck年会系统...
    call start.bat
    goto :end
)

echo [信息] 未检测到Node.js，开始安装...
echo.

:: 检查是否有Chocolatey
choco --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [信息] 使用Chocolatey安装Node.js...
    choco install nodejs -y
    if %errorlevel% equ 0 (
        echo [信息] Node.js安装成功
        goto :verify
    ) else (
        echo [错误] Chocolatey安装失败，尝试其他方式
    )
)

:: 检查是否有winget（Windows 10/11）
winget --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [信息] 使用winget安装Node.js...
    winget install OpenJS.NodeJS --silent
    if %errorlevel% equ 0 (
        echo [信息] Node.js安装成功
        goto :verify
    ) else (
        echo [错误] winget安装失败
    )
)

:: 如果都没有，手动下载安装
echo [信息] 开始下载Node.js...
echo [提示] 如果下载失败，请手动访问 https://nodejs.org/ 下载LTS版本

:: 创建临时目录
if not exist "temp" mkdir temp

:: 下载Node.js（使用curl，Windows 10+）
curl --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [信息] 正在下载Node.js LTS版本...
    curl -L -o temp/nodejs.msi "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
    if %errorlevel% equ 0 (
        echo [信息] 开始安装Node.js...
        msiexec /i temp/nodejs.msi /quiet /norestart
        timeout /t 30 /nobreak >nul
        del temp/nodejs.msi
        goto :verify
    )
)

echo.
echo ========================================
echo ❌ 自动安装失败
echo ========================================
echo.
echo 请手动安装Node.js:
echo 1. 访问 https://nodejs.org/
echo 2. 下载LTS版本（推荐20.x）
echo 3. 运行安装程序
echo 4. 安装完成后重新运行此脚本
echo.
echo 或者选择云端部署方案:
echo 查看 QUICK_INTERNET_DEPLOY.md 文件
echo.
pause
exit /b 1

:verify
echo [信息] 验证Node.js安装...
timeout /t 10 /nobreak >nul

:: 重新加载环境变量
call refreshenv >nul 2>&1

:: 验证安装
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo [成功] Node.js安装完成！
    node --version
    npm --version
    echo.
    echo [信息] 正在启动iLuck年会系统...
    call start.bat
) else (
    echo.
    echo [错误] Node.js安装验证失败
    echo [建议] 重启计算机后重新运行此脚本
    pause
)

:end
if exist "temp" rmdir /s /q temp 2>nul
echo.
echo 安装脚本执行完成
pause