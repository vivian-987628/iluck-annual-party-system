# Cloud Studio一键部署方案

## 🌟 最简单的部署方案 - 无需本地环境

使用腾讯云Cloud Studio，您可以直接在浏览器中完成开发和部署，无需安装任何软件！

### 🚀 快速开始

#### 第1步：注册Cloud Studio
1. 访问：https://cloud.tencent.com/product/cloud-studio
2. 点击"立即使用"
3. 使用腾讯云账号登录（可免费注册）
4. 选择"免费体验版"

#### 第2步：创建工作空间
1. 点击"新建工作空间"
2. 选择模板：**Node.js**
3. 工作空间名称：`iluck-annual-party-system`
4. 点击"创建"

#### 第3步：上传项目文件
1. 在左侧文件管理器中，右键点击空白处
2. 选择"上传文件"
3. 将整个项目文件夹上传
4. 或者直接复制粘贴代码文件

#### 第4步：一键部署脚本
在Cloud Studio终端中运行：

```bash
# 1. 安装依赖
npm install

# 2. 启动后端服务
npm run dev &

# 3. 启动管理后台
cd admin
npm install
npm start &

# 4. 启动大屏幕服务
cd ../screen
python3 -m http.server 8080 &
```

#### 第5步：获取公网访问地址
1. 在Cloud Studio中，点击右侧"端口"标签
2. 添加端口映射：
   - 端口3000 → 后端API
   - 端口3001 → 管理后台  
   - 端口8080 → 大屏幕
3. 获得公网访问地址，格式如：
   - `https://xxx-3000.cloudstudio.net`
   - `https://xxx-3001.cloudstudio.net`
   - `https://xxx-8080.cloudstudio.net`

### 🎯 部署完成！

您将获得3个互联网访问地址：
- **管理后台**: https://xxx-3001.cloudstudio.net
- **大屏幕**: https://xxx-8080.cloudstudio.net
- **API接口**: https://xxx-3000.cloudstudio.net

### 📱 配置微信小程序

1. 修改 `miniprogram/app.js`：
```javascript
const BASE_URL = 'https://xxx-3000.cloudstudio.net';
```

2. 在微信开发者工具中重新上传小程序

### ✨ Cloud Studio优势

- **🌐 全球访问** - 自动生成公网地址
- **💻 零安装** - 浏览器即可开发
- **🚀 一键部署** - 自动端口映射
- **🔧 环境完整** - 预装Node.js等环境
- **💾 自动保存** - 代码云端存储
- **👥 协作开发** - 支持多人协作

### 📋 详细操作步骤

#### 步骤1：创建Cloud Studio账号
```text
1. 打开 https://cloud.tencent.com/product/cloud-studio
2. 点击"立即使用"
3. 选择"免费注册"
4. 填写手机号和验证码
5. 设置密码完成注册
```

#### 步骤2：创建Node.js工作空间
```text
1. 登录后点击"新建工作空间"
2. 选择"Node.js"模板
3. 工作空间名称：iluck-annual-party-system
4. 规格：免费版（2核4G）
5. 点击"创建并启动"
```

#### 步骤3：上传项目代码
```text
方法A：拖拽上传
1. 在左侧文件管理器中找到工作空间目录
2. 直接将项目文件夹拖拽到浏览器中
3. 等待上传完成

方法B：复制粘贴
1. 在Cloud Studio中新建文件
2. 复制本地代码内容
3. 粘贴到在线编辑器中
4. 保存文件
```

#### 步骤4：配置和启动
```bash
# 在Cloud Studio终端中依次执行以下命令：

# 进入项目目录
cd /workspace

# 安装后端依赖
npm install

# 安装前端依赖
cd admin
npm install
cd ..

# 启动后端服务（后台运行）
npm run dev &

# 启动管理后台（后台运行）
cd admin
npm start &

# 启动大屏幕服务（后台运行）
cd ../screen
python3 -m http.server 8080 &

# 查看服务状态
ps aux | grep node
```

#### 步骤5：配置端口访问
```text
1. 在Cloud Studio右侧找到"端口"标签
2. 点击"添加端口"
3. 分别添加：
   - 端口：3000，协议：HTTP，描述：后端API
   - 端口：3001，协议：HTTP，描述：管理后台
   - 端口：8080，协议：HTTP，描述：大屏幕
4. 点击"应用"
5. 复制生成的公网地址
```

### 🔧 常见问题解决

#### 问题1：端口无法访问
```bash
# 检查服务是否启动
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001
netstat -tlnp | grep :8080

# 重启服务
pkill node
npm run dev &
```

#### 问题2：依赖安装失败
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules
npm install
```

#### 问题3：Python服务启动失败
```bash
# 检查Python版本
python3 --version

# 如果没有Python3，使用Python2
python -m SimpleHTTPServer 8080
```

### 📊 性能说明

Cloud Studio免费版限制：
- **CPU**: 2核
- **内存**: 4GB
- **存储**: 10GB
- **带宽**: 1Mbps
- **在线时长**: 每月1000小时

对于年会活动（200人并发），建议：
- 活动期间升级到付费版
- 或使用云服务器部署

### 🎉 最终效果

使用Cloud Studio，您将：
1. **5分钟内完成部署** - 无需复杂配置
2. **获得公网访问地址** - 全球可访问
3. **支持所有功能** - 签到、抽奖、游戏全功能
4. **零成本启动** - 免费版即可测试

### 📞 技术支持

Cloud Studio官方支持：
- 📞 客服热线：95716
- 💬 在线客服：官网右下角
- 📧 邮箱：cloudstudio@tencent.com

iLuck系统技术支持：
- 📧 support@iluck.com
- 💬 QQ群：123456789

---

**🎊 推荐使用Cloud Studio方案，5分钟就能让您的年会系统上线！**