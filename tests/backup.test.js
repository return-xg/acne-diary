import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {PHOTO_RESTORE_SQL} from '../src/backup.js';
test('重复恢复相同照片ID不增加照片数量，更新元数据与文件关联',()=>{
 const db=new DatabaseSync(':memory:');
 try{db.exec('CREATE TABLE photos(id TEXT PRIMARY KEY,date TEXT NOT NULL,file TEXT NOT NULL,data TEXT NOT NULL)');const statement=db.prepare(PHOTO_RESTORE_SQL);statement.run('p1','2026-11-01','old.jpg','old');statement.run('p1','2026-11-01','new.jpg','restored');assert.equal(db.prepare('SELECT count(*) AS n FROM photos').get().n,1);assert.equal(db.prepare('SELECT file FROM photos WHERE id=?').get('p1').file,'new.jpg');}finally{db.close()}
});
test('照片恢复事务失败回滚，保留旧文件引用',()=>{
 const db=new DatabaseSync(':memory:');
 try{db.exec('CREATE TABLE photos(id TEXT PRIMARY KEY,date TEXT NOT NULL,file TEXT NOT NULL,data TEXT NOT NULL)');const statement=db.prepare(PHOTO_RESTORE_SQL);statement.run('p1','2026-11-01','old.jpg','old');db.exec('BEGIN');assert.throws(()=>{statement.run('p1','2026-11-01','new.jpg','new');statement.run('p2',null,'bad.jpg','bad')});db.exec('ROLLBACK');assert.equal(db.prepare('SELECT file FROM photos WHERE id=?').get('p1').file,'old.jpg');}finally{db.close()}
});
