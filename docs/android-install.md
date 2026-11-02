# Android 独立测试版安装与迁移

当前构建为 ARM64 独立测试 APK，适用于小米17 Pro等ARM64安卓手机。使用 Expo 生成工程的开发签名，仅用于此次安装验收；正式发布前应配置专用发布签名并安全备份，升级时必须使用一致签名。它包含本地JS代码，不依赖电脑Metro服务器，不需要Expo Go。

## 构建

GitHub Actions → 构建 Android 测试安装包 → Run workflow。工作流执行类型检查、单测、Expo prebuild及Gradle assembleRelease，产物acne-diary-android-preview含APK与SHA256校验值，保留30天。不会读取设备数据。

## 安装与迁移

1. 在原Expo Go中导出最新完整JSON备份并另存。
2. 将APK传到手机，打开安装，按系统提示允许当前文件来源安装。
3. 启动独立“痘痘日记”，初次空记录是正常的：它与Expo Go的数据目录独立。
4. 我的 → 从备份恢复，选择步骤1的JSON文件。
5. 核对日期、数量、产品、照片、产品删除历史及名称。
6. 打开飞行模式，关闭电脑开发服务，退出重开独立App，新增/编辑测试记录、查看原图及趋势，确认可用。
7. 重启手机再核对数据，并重新导出一份备份。不要在确认前卸载Expo Go，也不要卸载独立App后期待数据自动保留。

以后升级安装应直接覆盖安装，使用同一包名与签名；不要先卸载。正式签名与测试签名不同时Android无法原位覆盖，应先备份，再迁移。

测试通过前不将APK标记为正式发布版；iOS不在本次安装验收范围内。

## 首次构建结果（2026-11-02）

源码提交：e17244d3883a55ff3f17c67136a67ad1bc04cea4。
构建记录：https://github.com/return-xg/acne-diary/actions/runs/41420996373 。云端12项测试及Gradle assembleRelease通过。

产物：`dist/apk/acne-diary-1.0.0-arm64-preview.apk`，25.63 MiB。
SHA256：`0f7f517bec89d6339b35202e6ac1f440a33d843ec94b8bb9454c91bafffe2fb6`。
本地检查：校验值一致、ZIP各条目CRC正常、包含AndroidManifest.xml、classes.dex、1,299,168字节内置运行代码、16个ARM64原生库。检查不代替手机安装与离线运行验收。

另提供`dist/acne-diary-1.0.0-android-preview.zip`用于文件传输，解压后安装APK。二进制未提交Git，GitHub Actions产物保留30天，请另行保留下载文件。

待用户确认：独立安装成功、JSON迁移、离线新建编辑/原图/趋势、手机重启保留数据。

## 图标更新版1.0.1（2026-11-02）

构建源码b596a42；构建记录：https://github.com/return-xg/acne-diary/actions/runs/41424241056 。12项测试及原生编译通过。

APK：`dist/apk/acne-diary-1.0.1-arm64-preview.apk`（25.75 MiB）；文件SHA256：`7fe19a5b6fab16b8f8d3909be8497c25afcbca284cfa29af7133430e34b9ca32`。
ZIP：`dist/acne-diary-1.0.1-android-preview.zip`。

检查APK实际清单：包名com.personal.acnediary，versionName=1.0.1，versionCode=2；新旧APK签名证书SHA256均为`fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`。包内已包含新图标的多密度资源，并抽取192px启动图标目视检查；ZIP CRC及文件校验通过，离线代码及ARM64库存在。

可在1.0.0上覆盖安装，无需先卸载。安装前仍建议备份。桌面图标显示、覆盖后数据保留待用户真机确认；勿将构建检查等同于完成设备验收。
