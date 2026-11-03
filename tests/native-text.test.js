import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {parse}=require('@babel/parser');
const {react}=require('@babel/types');
function rawNativeText(source){
 const ast=parse(source,{sourceType:'module',plugins:['typescript','jsx']});
 const errors=[];
 function walk(node,inText=false){
  if(!node||typeof node!=='object')return;
  if(node.type==='JSXElement'||node.type==='JSXFragment'){
   const name=node.type==='JSXFragment'?'Fragment':node.openingElement.name.name;
   const nested=name==='Fragment'?inText:['Text','SvgText'].includes(name);
   if(!nested)for(const child of react.buildChildren(node))if(child.type==='StringLiteral')errors.push({line:child.loc?.start.line,value:child.value});
   for(const child of node.children)walk(child,nested);
   return;
  }
  for(const value of Object.values(node)){
   if(Array.isArray(value))value.forEach(child=>walk(child,inText));
   else if(value&&typeof value==='object'&&value.type)walk(value,inText);
  }
 }
 walk(ast);return errors;
}
test('原生文字检查包含Fragment间的单行空格，并允许Text中的文字',()=>{
 assert.equal(rawNativeText('const x=<View><><View/> <View/></></View>').length,1);
 assert.deepEqual(rawNativeText('const x=<View>\n<View/><Text><>正常文字 </></Text>\n</View>'),[]);
});
test('App界面没有落在Text外的直接文字或空格',()=>{
 for(const file of ['../App.tsx','../src/DateFilter.tsx','../src/PhotoComparison.tsx'])assert.deepEqual(rawNativeText(readFileSync(new URL(file,import.meta.url),'utf8')),[],file);
});
