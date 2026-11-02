import {types, symptoms} from './stats.js';

// Escape user text so Markdown table cells cannot become extra rows or columns.
const cell = value => value === null || value === undefined || value === ''
  ? '未评估 / 未填写'
  : String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\\/g, '&#92;').replace(/([`*_\[\]#])/g, '\\$1').replace(/\|/g, '&#124;').replace(/\r?\n/g, '<br>');
const table = (headers, rows) => [headers, headers.map(()=>'---'), ...rows]
  .map(row => '| ' + row.map(cell).join(' | ') + ' |').join('\n');

/**
 * @param {{profile:string,records:import('./db').RecordData[],products:import('./db').Product[],photos:import('./db').Photo[]}} data
 */
export function toMarkdown({profile, records, products, photos}) {
  const ordered = [...records].sort((a,b)=>a.date.localeCompare(b.date));
  const productName = id => products.find(p=>p.id===id)?.name ?? `已删除产品（ID：${id}）`;
  const out = ['# 痘痘日记 · 个人皮肤记录',
    '> 分析说明：以下为用户自述和观察记录，不是医学诊断。请依据实际数据分析趋势，指出数据缺口，区分时间关联与因果，不要据此自动开药或提高用药频率。',
    '## 数据口径',
    '- 当前存量与当日新增分别填写，不能用存量差值推算新增。\n- “未评估 / 未填写”不是0；0表示明确记录为零。\n- 症状评分：1无、2轻微、3轻度、4中度、5明显；整体皮肤状态为独立主观评价。\n- 部位观察不自动累加为全脸计数。标记未记录的日期不参与趋势统计。\n- 未列出的日期表示没有主记录，不代表没有痘痘。\n- 本文本不包含照片文件、Base64或私有文件路径；如需分析照片请自行选择分享。',
    `记录范围：${ordered.length ? ordered[0].date+' 至 '+ordered.at(-1).date : '暂无记录'}；主记录 ${ordered.length} 条；标记未记录 ${ordered.filter(r=>r.skipped).length} 天。`,
    '## 个人皮肤档案', cell(profile), '## 产品档案'];
  out.push(products.length ? table(['产品','分类','浓度','开始日期','停止日期','计划频率（备注）','部位','说明'], products.map(p=>[p.name,p.category,p.concentration,p.start,p.stop,p.frequency,p.region,p.note])) : '暂无产品档案。');
  out.push('## 每日记录（日期正序）');
  if (!ordered.length) out.push('暂无每日记录。');
  for (const r of ordered) {
    out.push(`### ${r.date}`, `观察时间：${cell(r.time)}；状态：${r.skipped?'标记为未记录（以下保留内容不参与趋势统计）':'已记录'}；最后修改：${cell(r.updatedAt)}`,
      '#### 痘痘数量', table(['类型','当前存量（颗）','当日新增（颗）'],types.map((t,i)=>[t,r.counts[i]?.current,r.counts[i]?.fresh])),
      '#### 部位观察', r.locations.length ? table(['部位','类型','数量（颗）','备注'],r.locations.map(l=>[l.region,types[l.type]??'其他',l.count,l.note])) : '暂无部位观察。',
      '#### 皮肤症状', table(['症状','程度（1～5）'],symptoms.map((t,i)=>[t,r.skin[i]])),
      '#### 痘印与痘坑', table(['项目','记录'],[['红色痘印数量',r.marks[0]],['黑色痘印数量',r.marks[1]],['红色痘印严重程度（1无～5明显）',r.marks[2]],['黑色痘印严重程度（1无～5明显）',r.marks[3]],['痘坑自评类型',r.scar]]),
      '#### 问卷（用户主观回答）', Object.keys(r.answers).length ? table(['问题','回答'],Object.entries(r.answers)) : '暂无问卷回答。',
      '#### 实际产品使用', r.usage.length ? table(['产品','时段','剂量 / 方式 / 过夜','部位','反应'],r.usage.map(u=>[productName(u.productId),u.period,u.dose,u.region,u.reaction])) : '暂无使用记录（不等于明确未使用）。',
      '#### 备注', cell(r.note), '#### 照片索引');
    const dayPhotos = photos.filter(p=>p.date===r.date);
    out.push(dayPhotos.length ? table(['类型','添加时间','备注'],dayPhotos.map(p=>[p.category,p.createdAt,p.note])) : '暂无关联照片。');
  }
  return out.join('\n\n')+'\n';
}
