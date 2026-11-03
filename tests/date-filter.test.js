import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterByDate,recentRange} from '../src/date-filter.js';
test('单日与区间筛选包含边界，倒序展示且不改变原记录',()=>{const rows=[{date:'2026-10-31'},{date:'2026-11-02'},{date:'2026-11-01'}];assert.deepEqual(filterByDate(rows,{start:'2026-11-01',end:'2026-11-01'}),[{date:'2026-11-01'}]);assert.deepEqual(filterByDate(rows,{start:'2026-11-01',end:'2026-11-02'}).map(r=>r.date),['2026-11-02','2026-11-01']);assert.equal(rows[0].date,'2026-10-31')});
test('快捷范围跨月及闰年，无结果与清除筛选',()=>{assert.deepEqual(recentRange(2,'2024-03-01'),{start:'2024-02-29',end:'2024-03-01'});assert.equal(filterByDate([{date:'2026-11-02'}],{start:'2026-10-01',end:'2026-10-02'}).length,0);assert.equal(filterByDate([{date:'2026-11-02'}],null).length,1)});
