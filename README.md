# 痘痘日记 · Acne Diary

React Native 原生跨平台本地 MVP 源码。不是网页套壳。当前尚未完成真实手机验收，不能视为需求中全部功能交付。

开源仓库：[return-xg/acne-diary](https://github.com/return-xg/acne-diary)，采用 [MIT 许可证](LICENSE)。公开源码使用空白个人档案模板；手机里已经保存的档案不会受影响。不要向仓库提交个人照片、记录备份或凭据。

## Git 管理

默认分支为 `main`。每次修改后执行类型检查和测试，再提交；GitHub Actions也会自动运行这两项检查。

```powershell
git status
npm run typecheck
npm test
git add App.tsx src docs
git commit -m "Describe the change"
git push
```

`git add`按实际修改的文件调整。多人协作或较大改动建议新建分支后提交 Pull Request。仓库凭据由 Git Credential Manager 管理，不要将令牌或密码写入远程URL。

## 运行

需要 Node 20.19+（当前使用24），在本目录执行：

```powershell
npm ci
npm run typecheck
npm test
npm start
```

使用与 Expo SDK 54 匹配的 Expo Go 扫码；如最新 Expo Go 不支持54，请使用开发构建。真机与电脑需网络互通。数据不依赖开发服务器保存。

Android 本地安装：安装 Android Studio、Android SDK、JDK17，配置 ANDROID_HOME 和 adb 后执行 `npm run android`。Release APK 可在生成的 android 目录用 Gradle assembleRelease 构建，发布前需配置自己的签名。

云构建：`npx eas-cli build --platform android --profile preview`，需用户自己的 Expo 登录与构建额度，会把源码发往 EAS，不会上传手机中的记录。项目已提供 APK profile；未替用户创建账号或提交云构建。

iOS：需要 macOS、Xcode，执行 `npm ci`、`npm run ios`。真机签名或 TestFlight 需 Apple Developer 账号；也可使用 EAS 的 iOS 构建。Windows 不能运行 Xcode。

## 目录

```
App.tsx                 五入口、原生表单、照片与对比、产品、导出
src/db.ts               SQLite迁移、事务、私有文件关联
src/stats.js            日期与统计纯函数
tests/stats.test.js     缺失值、跨日、统计口径测试
docs/design.md          页面原型及任务规划
docs/database.md        模型、数据口径和隐私说明
docs/acceptance.md      验收状态与待办
app.json / eas.json     原生应用配置与构建配置
```

## 使用

首次启动确认个人档案。首页开始记录，记录页可补录日期、分别填写存量与新增。未填写是未知，输入0才是零。历史日期按钮打开原记录后修改。部位记录为独立观察，不自动累加到全脸计数，以免重复统计。

选好照片分类后使用相册或相机，照片先复制到私有目录。照片页按分类选择两张照片，支持并排和拖动分界线；点击照片进入原图、备注与导出。相同部位也可能因光线角度不同而不可直接比较。

我的页面管理产品、查看产品历史、导出计数CSV、完整JSON备份（包含原图）与恢复。备份包含敏感数据，无额外加密。大体积照片Base64备份会占用内存，建议定期分批导出原图；未来应改用流式ZIP备份。不要卸载后才备份，卸载会清除应用私有数据。

### 导出 Markdown 给 AI 分析

进入「我的 → 数据属于你 → 导出记录文本（Markdown / AI分析）」。系统分享生成 UTF-8 `.md` 文件，可保存到文件或发送给支持附件的 AI；也可用文本编辑器打开后复制内容。导出读取数据库中已保存的数据，编辑中的内容请先保存。

包含个人档案、产品资料、按日期正序的每日计数、部位、症状、痘印痘坑、问卷、实际用量、备注及照片文字索引；不包含原图或照片路径。空值明确标为未评估，0单独保留，附带统计口径与AI分析说明。此功能仅生成文件，不自动发送给任何AI服务。

## 技术依据

SQLite、图片选择与文件接口参照 Expo 官方文档，并固定 SDK54 与 lockfile，避免依赖漂移：
[SQLite](https://docs.expo.dev/versions/v54.0.0/sdk/sqlite/)、[ImagePicker](https://docs.expo.dev/versions/v54.0.0/sdk/imagepicker/)、[FileSystem](https://docs.expo.dev/versions/v54.0.0/sdk/filesystem/)。
