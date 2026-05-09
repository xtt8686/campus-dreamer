#!/bin/bash

# 校园梦想家 - 上传到GitHub脚本

echo "📦 校园梦想家 - GitHub上传工具"
echo "================================"
echo ""

# 检查git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ Git未安装，请先安装Git"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装，请先安装Node.js"
    exit 1
fi

echo "✅ Git和npm已就绪"
echo ""

# 获取用户输入
read -p "请输入您的GitHub用户名: " GITHUB_USERNAME
read -p "请输入仓库名称 (默认: campus-dreamer): " REPO_NAME
REPO_NAME=${REPO_NAME:-campus-dreamer}

echo ""
echo "📝 准备创建仓库..."
echo "   用户名: $GITHUB_USERNAME"
echo "   仓库名: $REPO_NAME"
echo ""

# 创建README
if [ ! -f "README.md" ]; then
    cat > README.md << 'EOF'
# 校园梦想家

一款以学校为背景的模拟经营游戏

## 功能
- 三大角色系统
- 多种题型考试系统
- 实时时间系统
- 社交互动系统
EOF
fi

# 初始化git
git init
git add .
git commit -m "Initial commit: 校园梦想家游戏"

# 创建GitHub仓库并推送
echo ""
echo "🔗 请在浏览器中创建GitHub仓库:"
echo "   https://github.com/new"
echo ""
echo "   仓库名称: $REPO_NAME"
echo "   不要勾选任何选项，直接创建"
echo ""
read -p "创建完成后，按回车继续..."

# 添加远程仓库并推送
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git branch -M main
git push -u origin main

echo ""
echo "================================"
echo "✅ 上传完成!"
echo ""
echo "📱 APK将自动构建，构建完成后访问:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME/releases"
echo ""
echo "💡 构建可能需要5-10分钟，请耐心等待"
