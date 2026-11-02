# 本地数据库 v1

SQLite acne.db，WAL、参数绑定；user_version=1。后续迁移必须依据user_version在事务内升级，不得删库重建。

| 表 | 主键/索引 | 内容 |
|---|---|---|
| daily | date主键，id唯一 | JSON聚合：DailyRecord、AcneCount、AcneLocation、SkinCondition、AcneMark、AcneScar、DailyQuestionnaire、ProductUsage |
| photos | id主键，date索引 | 相对文件名、分类、日期、创建时间、备注 |
| products | id主键 | 分类、浓度、日期、频率、部位、备注 |
| settings | key主键 | 初始化标记、UserProfile |

每天唯一主记录，由日期UPSERT防重复。id不随编辑变化。date为本地日历YYYY-MM-DD；time为观察时刻HH:mm；updatedAt和照片createdAt为UTC ISO。照片与业务数据分离，不存缓存URI，不存绝对沙箱目录。用户实际拍摄时间可能不同于记录日期，以用户选择的记录日期为业务日期。

数值为非负整数或null。null=未评估/不确定，0=明确没有；当前存量与新增独立。主记录JSON中保存症状1~5分。整体状态通过问卷文字保存，与症状分数区分。

区间新增只累计明确数值；全空返回null。均值排除null；记录覆盖率以非跳过主记录日期计算，不表示每个字段已填写。产品次数按早晚实际记录条数，不能推断剂量。未记录标记排除统计。没有自动因果分析。

删除日期时事务清除业务记录及照片索引；目前孤立照片文件延迟到全量清除时删除，避免崩溃中断造成悬空索引。这会占用额外磁盘。单张删除立即删除文件。完整备份只含有索引的照片。恢复先写入新文件名，再事务合并业务数据；失败清理新写入照片。相同日期覆盖，照片追加，重复恢复可能产生照片副本。

本机SQLite未启用SQLCipher。Android禁止系统备份；iOS设备备份由系统管理。无云端接口，无AI照片上传。导出JSON及原图是主动分享行为。

后续实体：WeeklyAssessment、TreatmentPlan、TreatmentSchedule、Reminder 将使用独立表；当前尚未创建和假造数据。

产品删除改为在Product JSON中设置deletedAt，保留同一ID及名称/属性；当前列表隐藏，归档入口可查历史。旧版本已物理删除的产品通过ProductUsage ID生成只读未知名称占位，未修改原记录。产品删除不改动daily数据。无需表结构迁移，已有JSON缺省deletedAt表示当前产品。
