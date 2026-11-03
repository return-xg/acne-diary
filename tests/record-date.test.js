import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {saveEditedRecordInTransaction} from '../src/record-date.js';

function setup(){
 const db=new DatabaseSync(':memory:');
 db.exec('CREATE TABLE daily(id TEXT UNIQUE NOT NULL,date TEXT PRIMARY KEY NOT NULL,data TEXT NOT NULL); CREATE TABLE photos(id TEXT PRIMARY KEY,date TEXT NOT NULL,file TEXT NOT NULL,data TEXT NOT NULL)');
 const record={id:'r1',date:'2026-11-01',note:'原记录',counts:[{current:5,fresh:2}],usage:[{productId:'p1'}]};
 db.prepare('INSERT INTO daily VALUES (?,?,?)').run(record.id,record.date,JSON.stringify(record));
 const photo={id:'photo1',date:record.date,file:'original.jpg',createdAt:'2026-11-01T10:00:00Z'};
 db.prepare('INSERT INTO photos VALUES (?,?,?,?)').run(photo.id,photo.date,photo.file,JSON.stringify(photo));
 const tx={getFirstAsync:async(sql,...args)=>db.prepare(sql).get(...args),getAllAsync:async(sql,...args)=>db.prepare(sql).all(...args),runAsync:async(sql,...args)=>db.prepare(sql).run(...args)};
 const save=async(r,old)=>{db.exec('BEGIN');try{await saveEditedRecordInTransaction(tx,r,old);db.exec('COMMIT')}catch(error){db.exec('ROLLBACK');throw error}};
 return {db,record,save};
}
test('修改日期移动原记录及照片关联，保留ID、原图与产品数据，可重复保存',async()=>{
 const {db,record,save}=setup();try{
  const moved={...record,date:'2026-10-31'};
  await save(moved,record.date);await save(moved,moved.date);
  assert.equal(db.prepare('SELECT count(*) AS n FROM daily').get().n,1);
  assert.equal(db.prepare('SELECT id FROM daily WHERE date=?').get(record.date),undefined);
  assert.deepEqual(JSON.parse(db.prepare('SELECT data FROM daily').get().data),moved);
  const photo=db.prepare('SELECT * FROM photos').get();assert.equal(photo.date,moved.date);assert.equal(photo.file,'original.jpg');assert.equal(JSON.parse(photo.data).date,moved.date);
 }finally{db.close()}
});
test('目标日期已有记录时拒绝覆盖，迁移中途失败完整回滚',async()=>{
 const {db,record,save}=setup();try{
  db.prepare('INSERT INTO daily VALUES (?,?,?)').run('r2','2026-10-30','{"id":"r2"}');
  await assert.rejects(save({...record,date:'2026-10-30'},record.date),/已有记录/);
  db.exec("CREATE TRIGGER fail_photo BEFORE UPDATE ON photos BEGIN SELECT RAISE(ABORT,'test failure'); END");
  await assert.rejects(save({...record,date:'2026-10-31'},record.date),/test failure/);
  assert.equal(db.prepare('SELECT date FROM daily WHERE id=?').get(record.id).date,record.date);
  assert.equal(db.prepare('SELECT date FROM photos').get().date,record.date);
  assert.equal(db.prepare('SELECT data FROM daily WHERE id=?').get('r2').data,'{"id":"r2"}');
 }finally{db.close()}
});
