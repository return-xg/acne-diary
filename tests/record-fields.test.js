import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assessedTypes,clearCountType,visibleCountTypes} from '../src/record-fields.js';
test('历史类型按实际填写显示，明确零也必须展示',()=>{assert.deepEqual(assessedTypes([{current:null,fresh:null},{current:0,fresh:null},{current:null,fresh:0},{current:2,fresh:1}]),[1,2,3])});
test('移除类型返回未知，其他类型和原始记录保持不变',()=>{const original=[{current:3,fresh:1},{current:0,fresh:0}];const result=clearCountType(original,0);assert.deepEqual(result,[{current:null,fresh:null},{current:0,fresh:0}]);assert.equal(original[0].current,3)});
test('保留选择但未计数的类型，同时兼容无选择字段的旧记录',()=>{const counts=[{current:0,fresh:null},{current:null,fresh:null}];assert.deepEqual(visibleCountTypes(counts,[1,1,99]),[1,0]);assert.deepEqual(visibleCountTypes(counts),[0])});
