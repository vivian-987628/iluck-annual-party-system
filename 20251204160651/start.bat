@echo off
echo ========================================
echo iLuck智能年会互动系统启动脚本
echo ========================================
echo.

:: 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [信息] Node.js版本检查通过
echo.

:: 创建必要的目录
if not exist "data" mkdir data
if not exist "uploads" mkdir uploads
echo [信息] 目录创建完成
echo.

:: 安装依赖
echo [步骤1] 安装后端依赖...
call npm install
if %errorlevel% neq 0 (
    echo [错误] 后端依赖安装失败
    pause
    exit /b 1
)

echo [步骤2] 安装管理后台依赖...
cd admin
call npm install
if %errorlevel% neq 0 (
    echo [错误] 管理后台依赖安装失败
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo 依赖安装完成！
echo ========================================
echo.

:: 启动服务
echo [信息] 正在启动服务...
echo.

:: 启动后端服务
echo [服务1] 启动后端服务 (端口: 3000)
start "iLuck后端服务" cmd /k "npm run dev"

:: 等待后端服务启动
timeout /t 3 /nobreak >nul

:: 启动管理后台
echo [服务2] 启动管理后台 (端口: 3001)
start "iLuck管理后台" cmd /k "cd admin && npm start"

:: 等待管理后台启动
timeout /t 3 /nobreak >nul

:: 启动大屏幕服务
echo [服务3] 启动大屏幕服务 (端口: 8080)
start "iLuck大屏幕" cmd /k "cd screen && python -m http.server 8080"

echo.
echo ========================================
echo 所有服务启动完成！
echo ========================================
echo.
echo 访问地址:
echo 管理后台: http://localhost:3001
echo 大屏幕:   http://localhost:8080
echo API文档:   http://localhost:3000
echo.
echo 默认登录账号:
echo 用户名: admin
echo 密码:   iluck2024
echo.
echo 按任意键退出...
pause >nul