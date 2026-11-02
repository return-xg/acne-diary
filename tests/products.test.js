import {test} from 'node:test';
import assert from 'node:assert/strict';
import {productCatalog} from '../src/products.js';
import {toMarkdown} from '../src/markdown.js';
test('已删除产品与旧版本丢失产品档案仍可关联历史，重复使用不重复建档',()=>{
 const products=[{id:'archived',name:'测试产品',deletedAt:'2026-11-02'}];
 const records=[{usage:[{productId:'archived'},{productId:'lost'},{productId:'lost'}]}];
 const catalog=productCatalog(products,records);
 assert.equal(catalog.length,2);assert.equal(catalog[0].name,'测试产品');assert.equal(catalog[1].id,'lost');assert.ok(catalog[1].deletedAt);assert.equal(products.length,1);
});
test('导出仍保留已删除产品名称与删除状态',()=>{
 const md=toMarkdown({profile:'',records:[],photos:[],products:[{id:'x',name:'测试保湿乳',deletedAt:'2026-11-02'}]});
 assert.match(md,/测试保湿乳 \| 已删除（保留历史）/);
});
