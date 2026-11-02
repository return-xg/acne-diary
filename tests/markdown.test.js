import {test} from 'node:test';
import assert from 'node:assert/strict';
import {toMarkdown} from '../src/markdown.js';
const record=(date)=>({id:date,date,time:'20:00',updatedAt:'2026-11-02T12:00:00Z',counts:[{current:5,fresh:null},{current:0,fresh:0}],skin:[null,1],locations:[],marks:[null,0,null,1],scar:'',answers:{},usage:[],note:''});
test('Markdown保留0与未知、存量新增且不改变原数组顺序',()=>{const records=[record('2026-11-02'),record('2026-11-01')];const md=toMarkdown({profile:'油性',records,products:[],photos:[]});assert.ok(md.indexOf('### 2026-11-01')<md.indexOf('### 2026-11-02'));assert.equal(records[0].date,'2026-11-02');assert.match(md,/红肿痘 \| 5 \| 未评估/);assert.match(md,/脓包痘 \| 0 \| 0/)});
test('用户文本转义、已删除产品回退且不泄露照片路径或内容',()=>{const r=record('2026-11-02');r.note='a|b\n#标题<script>';r.skipped=true;r.usage=[{productId:'removed',period:'晚上',dose:'',region:'',reaction:''}];const md=toMarkdown({profile:'',records:[r],products:[],photos:[{id:'photo',date:r.date,file:'secret.jpg',base64:'sensitive',category:'正面',note:'照片备注',createdAt:'2026-11-02'}]});assert.match(md,/a&#124;b<br>\\#标题&lt;script&gt;/);assert.match(md,/已删除产品/);assert.match(md,/标记为未记录/);assert.match(md,/照片备注/);assert.ok(!md.includes('secret.jpg'));assert.ok(!md.includes('sensitive'))});
test('空数据仍可生成明确的Markdown报告',()=>{assert.match(toMarkdown({profile:'',records:[],products:[],photos:[]}),/暂无每日记录/)});
