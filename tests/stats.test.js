import {test} from 'node:test';
import assert from 'node:assert/strict';
import {total,dates,today,series,summary,streak} from '../src/stats.js';
test('缺失值不算0，明确0仍保留',()=>{assert.equal(total([null,undefined]),null);assert.equal(total([null,0]),0)});
test('存量减少不能推算新增',()=>{const r=[{date:today(),counts:[{current:4,fresh:null}]}];assert.equal(series(r,7,'fresh').at(-1).value,null);assert.equal(series(r,7,'current').at(-1).value,4)});
test('日期范围跨月及闰年',()=>{assert.deepEqual(dates(2,'2024-03-01'),['2024-02-29','2024-03-01'])});
test('不完整数据累计仅明确新增且统计覆盖率',()=>{const r=[{date:today(),counts:[{fresh:2},{fresh:null}],skin:[null,null,null,3]}];const s=summary(r,7);assert.equal(s.fresh,2);assert.equal(s.missing,6);assert.equal(s.irritation,3);assert.equal(s.assessed,1)});
test('未记录标记不参与趋势',()=>{const r=[{date:today(),skipped:true,counts:[{current:9,fresh:9}],skin:[]}];assert.equal(summary(r,7).fresh,null);assert.equal(series(r,7,'current').at(-1).value,null);assert.equal(streak(r),0)});
