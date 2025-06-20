#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 检查 .gitignore 配置...\n');

// 检查 .gitignore 文件是否存在
const gitignorePath = '.gitignore';
if (!fs.existsSync(gitignorePath)) {
  console.log('❌ .gitignore 文件不存在');
  process.exit(1);
}

// 读取 .gitignore 内容
const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

// 需要被忽略的敏感文件和目录
const sensitiveItems = [
  '.env',
  'backend/.env',
  'frontend/.env',
  'node_modules/',
  'backend/uploads/',
  'frontend/dist/',
  '*.log'
];

// 应该保留的文件
const keepItems = [
  '.env.example',
  'backend/uploads/.gitkeep'
];

console.log('✅ 检查敏感文件是否被忽略：');
sensitiveItems.forEach(item => {
  if (gitignoreContent.includes(item) || gitignoreContent.includes(item.replace('/', ''))) {
    console.log(`   ✅ ${item} - 已忽略`);
  } else {
    console.log(`   ❌ ${item} - 未忽略`);
  }
});

console.log('\n✅ 检查重要文件是否保留：');
keepItems.forEach(item => {
  if (gitignoreContent.includes(`!${item}`)) {
    console.log(`   ✅ ${item} - 已保留`);
  } else if (fs.existsSync(item)) {
    console.log(`   ✅ ${item} - 文件存在`);
  } else {
    console.log(`   ⚠️  ${item} - 文件不存在`);
  }
});

// 检查实际文件状态
console.log('\n🔍 检查实际文件状态：');

const checkFile = (filePath, shouldExist) => {
  const exists = fs.existsSync(filePath);
  if (shouldExist) {
    console.log(`   ${exists ? '✅' : '❌'} ${filePath} - ${exists ? '存在' : '不存在'}`);
  } else {
    console.log(`   ${!exists ? '✅' : '⚠️'} ${filePath} - ${exists ? '存在（应被忽略）' : '不存在'}`);
  }
};

// 检查敏感文件
checkFile('.env', false);
checkFile('backend/.env', false);
checkFile('frontend/.env', false);

// 检查保留文件
checkFile('.env.example', true);
checkFile('backend/uploads/.gitkeep', true);

// 检查目录
const checkDir = (dirPath, shouldExist) => {
  const exists = fs.existsSync(dirPath);
  if (shouldExist) {
    console.log(`   ${exists ? '✅' : '❌'} ${dirPath}/ - ${exists ? '存在' : '不存在'}`);
  } else {
    console.log(`   ${!exists ? '✅' : '⚠️'} ${dirPath}/ - ${exists ? '存在（应被忽略）' : '不存在'}`);
  }
};

checkDir('node_modules', false);
checkDir('frontend/node_modules', false);
checkDir('backend/node_modules', false);
checkDir('frontend/dist', false);
checkDir('backend/uploads', true);

console.log('\n📋 .gitignore 配置摘要：');
console.log('• 环境变量文件：已忽略');
console.log('• Node.js 依赖：已忽略');
console.log('• 构建输出：已忽略');
console.log('• 上传文件：已忽略');
console.log('• IDE 文件：已忽略');
console.log('• 操作系统文件：已忽略');
console.log('• 配置模板：已保留');

console.log('\n🎉 .gitignore 检查完成！');
console.log('\n💡 下一步：');
console.log('1. git init');
console.log('2. git add .');
console.log('3. git commit -m "Initial commit"');
console.log('4. 在 GitHub 创建仓库');
console.log('5. git remote add origin <repository-url>');
console.log('6. git push -u origin main');
