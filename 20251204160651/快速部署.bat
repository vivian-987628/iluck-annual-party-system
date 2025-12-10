@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🚀 iLuck年会系统 - 快速部署工具
echo ========================================
echo.

echo 🔍 第1步：检查项目文件...
cd /d "%~dp0"
if not exist "package.json" (
    echo ❌ 错误：未找到package.json文件
    pause
    exit /b 1
)
if not exist "railway.json" (
    echo ❌ 错误：未找到railway.json文件
    pause
    exit /b 1
)
echo ✅ 项目文件检查完成

echo.
echo 📋 第2步：显示部署信息...
echo.
echo 🌐 项目地址：
echo    GitHub: 请在浏览器中打开你的GitHub项目页面
echo    Vercel: https://vercel.com/dashboard
echo    Railway: https://railway.app/
echo.
echo 🔑 默认登录信息：
echo    用户名: admin
echo    密码: iluck2024
echo.

echo 📝 第3步：接下来需要你手动完成...
echo.
echo 📱 步骤1：上传代码到GitHub
echo    1. 打开浏览器，访问你的GitHub项目
echo    2. 点击 "Add file" → "Upload files"
echo    3. 将本文件夹内的所有文件拖拽上传
echo    4. 点击 "Commit changes"
echo.
echo 🚀 步骤2：部署后端API到Railway
echo    1. 访问：https://railway.app/
echo    2. GitHub登录
echo    3. New Project → Deploy from GitHub
echo    4. 选择你的项目
echo    5. 等待部署完成，复制生成的URL
echo.
echo ⚙️  步骤3：更新小程序配置
echo    1. 打开文件：miniprogram\app.js
echo    2. 找到：serverUrl: 'http://localhost:3000'
echo    3. 替换为：serverUrl: 'https://你的Railway地址'
echo.
echo 🌐 步骤4：配置Vercel（如需要）
echo    1. 访问：https://vercel.com/dashboard
echo    2. 检查项目是否正确关联
echo.

echo 💾 第4步：备份重要配置文件...
echo.

REM 创建配置备份
copy "miniprogram\app.js" "miniprogram\app.js.backup" >nul 2>&1
copy "package.json" "package.json.backup" >nul 2>&1
copy "railway.json" "railway.json.backup" >nul 2>&1

echo ✅ 配置文件已备份
echo.

echo 📖 第5步：打开详细部署指南...
echo.
start "" "立即部署指南.md"

echo.
echo ========================================
echo    🎉 准备完成！现在开始部署吧！
echo ========================================
echo.
echo 📞 需要帮助？
echo    📧 邮箱: support@iluck.com
echo    🌐 文档: 立即部署指南.md
echo.
pause