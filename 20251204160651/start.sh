#!/bin/bash

echo "========================================"
echo "iLuck智能年会互动系统启动脚本"
echo "========================================"
echo

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "[信息] Node.js版本检查通过"
echo "Node.js版本: $(node --version)"
echo

# 检查Python是否安装（用于大屏幕服务）
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "[警告] 未检测到Python，大屏幕服务可能无法启动"
    echo "请安装Python 3.x"
fi

# 创建必要的目录
mkdir -p data uploads
echo "[信息] 目录创建完成"
echo

# 安装依赖
echo "[步骤1] 安装后端依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "[错误] 后端依赖安装失败"
    exit 1
fi

echo "[步骤2] 安装管理后台依赖..."
cd admin
npm install
if [ $? -ne 0 ]; then
    echo "[错误] 管理后台依赖安装失败"
    exit 1
fi
cd ..

echo
echo "========================================"
echo "依赖安装完成！"
echo "========================================"
echo

# 启动服务
echo "[信息] 正在启动服务..."
echo

# 启动后端服务
echo "[服务1] 启动后端服务 (端口: 3000)"
npm run dev &
BACKEND_PID=$!

# 等待后端服务启动
sleep 3

# 启动管理后台
echo "[服务2] 启动管理后台 (端口: 3001)"
cd admin
npm start &
ADMIN_PID=$!
cd ..

# 等待管理后台启动
sleep 3

# 启动大屏幕服务
echo "[服务3] 启动大屏幕服务 (端口: 8080)"
cd screen
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080 &
elif command -v python &> /dev/null; then
    python -m http.server 8080 &
else
    echo "[警告] Python未安装，跳过大屏幕服务启动"
fi
SCREEN_PID=$!
cd ..

echo
echo "========================================"
echo "所有服务启动完成！"
echo "========================================"
echo
echo "访问地址:"
echo "管理后台: http://localhost:3001"
echo "大屏幕:   http://localhost:8080"
echo "API文档:   http://localhost:3000"
echo
echo "默认登录账号:"
echo "用户名: admin"
echo "密码:   iluck2024"
echo
echo "进程ID:"
echo "后端服务: $BACKEND_PID"
echo "管理后台: $ADMIN_PID"
echo "大屏幕:   $SCREEN_PID"
echo
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap 'echo; echo "正在停止服务..."; kill $BACKEND_PID $ADMIN_PID $SCREEN_PID 2>/dev/null; echo "服务已停止"; exit 0' INT

# 保持脚本运行
wait