# 校园梦想家 - Campus Dreamer

🎮 一款以学校为背景的模拟经营游戏

## 📱 构建状态

[![Build APK](https://github.com/YOUR_USERNAME/campus-dreamer/actions/workflows/android-build.yml/badge.svg)](https://github.com/YOUR_USERNAME/campus-dreamer/actions/workflows/android-build.yml)

## 🚀 如何使用

### 方式1: 从GitHub下载APK
1. 进入项目的 [Releases](https://github.com/YOUR_USERNAME/campus-dreamer/releases) 页面
2. 下载最新的 `campus-dreamer-apk` 文件
3. 安装到安卓手机

### 方式2: 自行构建
```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/campus-dreamer.git
cd campus-dreamer

# 安装依赖
npm install

# 同步到Android
npx cap sync android

# 用Android Studio打开并构建
```

### 方式3: GitHub Actions自动构建
1. Fork这个项目到您的GitHub
2. 项目会自动构建APK
3. 在 Actions 页面查看构建进度
4. 在 Releases 页面下载APK

## 🎮 游戏功能

- 🏫 三大角色系统：学生、教师、校长
- 📝 多种题型考试系统
- ⏱️ 实时时间系统（1x-16x倍速）
- 👥 社交互动系统
- 🏃 体育课详细操作
- 👨‍👩‍👧 家长会系统
- 📚 教师备课系统（PPT/PDF上传）

## 📦 项目结构

```
mobile-app/
├── android/          # Android原生项目
├── www/             # 网页应用
├── package.json     # NPM配置
└── .github/         # GitHub配置
    └── workflows/   # 自动构建脚本
```

## 🔧 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **移动端**: Capacitor
- **构建**: Gradle + Android SDK

## 📄 许可证

MIT License
