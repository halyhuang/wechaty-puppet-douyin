# Wechaty Puppet Douyin 安装指南

## 环境要求
- Node.js 18.x
- Python 3.11
- Visual Studio 2022 (C++ 桌面开发环境)
- Windows 10/11

## 安装失败原因分析

### 1. 版本兼容性问题
- **问题描述**：Electron 版本与 Node.js 版本不兼容
- **具体表现**：
  - 找不到预编译二进制文件
  - node-gyp 编译失败
  - ABI 不兼容错误
- **原因**：
  - Electron 11.4.10 使用 Node.js 12.x
  - 当前环境使用 Node.js 18.x
  - grpc 模块与高版本 Node.js 不兼容

### 2. 编译工具链问题
- **问题描述**：原生模块编译失败
- **具体表现**：
  - node-gyp 配置错误
  - MSVC 编译器找不到
  - Python 路径配置错误
- **原因**：
  - Visual Studio 工具链配置不完整
  - 环境变量设置不正确

### 3. 依赖关系问题
- **问题描述**：包依赖版本冲突
- **具体表现**：
  - npm 安装失败
  - 版本不兼容警告
- **原因**：
  - wechaty 依赖特定版本的 grpc
  - 多个包之间的版本冲突

## 解决方案

### 1. 正确的版本组合
```json
{
  "dependencies": {
    "wechaty": "^0.45.2",
    "wechaty-puppet": "^0.29.2",
    "@grpc/grpc-js": "^1.9.13"
  },
  "devDependencies": {
    "electron": "^23.3.13"
  }
}
```

### 2. 安装步骤

1. **环境准备**
```powershell
# 清理环境
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
Remove-Item -Recurse -Force "$env:USERPROFILE\AppData\Local\node-gyp"
```

2. **安装全局工具**
```powershell
npm install -g node-gyp
```

3. **安装 Electron**
```powershell
npm install electron@23.3.13 --save-dev
```

4. **安装 grpc 相关**
```powershell
npm install @grpc/grpc-js
```

5. **安装其他依赖**
```powershell
npm install
```

### 3. 关键配置

1. **.npmrc 配置**
```ini
# Python 路径
python=C:\Python311\python.exe

# Visual Studio 版本
msvs_version=2022

# Electron 版本
electron_version=23.3.13

# node-gyp 配置
target=23.3.13
runtime=electron
disturl=https://npmmirror.com/mirrors/electron/
target_arch=x64
target_libc=unknown
runtime=electron
build_from_source=true
```

2. **环境变量设置**
```powershell
$env:GYP_MSVS_VERSION = "2022"
$env:npm_config_target = "23.3.13"
$env:npm_config_runtime = "electron"
$env:npm_config_disturl = "https://npmmirror.com/mirrors/electron/"
$env:npm_config_target_arch = "x64"
$env:npm_config_target_platform = "win32"
$env:npm_config_target_libc = "unknown"
```

## 注意事项

1. **版本选择**
   - 使用 Electron 23.3.13 而不是较低版本
   - 使用 @grpc/grpc-js 替代原生 grpc 模块
   - 确保所有依赖版本兼容 Node.js 18

2. **环境配置**
   - 确保 Visual Studio 2022 安装了 C++ 桌面开发环境
   - 确保 Python 3.11 正确安装并配置
   - 确保所有环境变量正确设置

3. **安装顺序**
   - 严格按照上述步骤顺序安装
   - 每一步都要确保成功完成
   - 如果某一步失败，需要先解决该步骤的问题

4. **常见问题处理**
   - 如果遇到权限问题，使用管理员权限运行命令
   - 如果遇到网络问题，确保镜像源配置正确
   - 如果遇到编译问题，检查 Visual Studio 工具链配置

## 验证安装

安装完成后，可以通过以下命令验证：

```powershell
# 检查 Electron 版本
npx electron --version

# 检查 Node.js 版本
node --version

# 检查 Python 版本
python --version

# 检查 node-gyp 版本
node-gyp --version
``` 