# 应用图标 · 日记与微小变化

制作方式：内置 image_gen，未使用外部CLI；未使用个人面部照片。主体为暖白日记本、松绿观察圆环、浅陶色圆点和金色微光。

- `assets/icon-foreground.png`：透明PNG，用于Android自适应图标前景。
- `assets/icon.png`：不透明深绿底PNG，用于普通启动图标和iOS图标。
- Android自适应背景：`#244D43`，由系统根据桌面样式裁切形状。
- 版本：1.0.1 / Android versionCode 2；包名保持不变，沿用测试构建签名。

检查：两张图片均为1254×1254；普通图为RGB，前景为RGBA，存在真实透明通道。主体居中留出遮罩安全边距。最终设备显示及覆盖更新保留数据仍需真机验收。

## 生成提示词

Use case: logo-brand. Asset type: production Android adaptive launcher foreground PNG for Acne Diary, a private skin journal. Create ONE beautifully polished, minimal app mark, no presentation board, no lettering. Center a softly rounded closed ivory journal, front view with a very slight dimensional edge, one elegant dark sage-green circular observation ring on its cover containing a single small warm terracotta dot, and one tiny restrained golden glint beside the ring: an abstract symbol of observing small skin changes with care. A short green bookmark peeks from the bottom. Distinctive calm editorial health-journal aesthetic, flat clean graphic with subtle tactile depth, high legibility at 48 pixels, substantial rounded forms, no fine details. Palette: ivory #F6F5EF, dark pine #244D43, sage #AFC4AB, tiny terracotta accent #C77763. Transparent canvas with real alpha, no background tile, no cast shadow outside the object, no text, no medical cross, no Android robot, no photoreal face. Square 1024x1024 composition. IMPORTANT adaptive icon safe area: entire journal, bookmark and glint fit within the central 62 percent of the canvas, centered with wide transparent margins. The journal itself should be about 48 percent of canvas width and 58 percent height. It will be placed on a solid pine green launcher background.

## 深绿底版本编辑提示词

Edit the just-generated Acne Diary icon into its full opaque launcher icon version. Preserve the identical ivory journal, sage ring, terracotta dot, golden glint, bookmark, exact shape, placement and scale. The ONLY change is to composite this same mark over a uniform full-bleed solid deep pine green background #244D43. Keep the square image canvas entirely filled with that green to all four edges, no outer rounded tile, no border, no text, no added elements. Premium calm skin-journal app icon. Do not redesign or enlarge the mark.
