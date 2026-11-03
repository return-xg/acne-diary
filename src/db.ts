import * as SQLite from 'expo-sqlite';
import * as FS from 'expo-file-system/legacy';
import {PHOTO_RESTORE_SQL} from './backup';
export type RecordData={id:string;date:string;time:string;counts:{current:number|null;fresh:number|null}[];countTypes?:number[];skin:(number|null)[];locations:{region:string;type:number;count:number;note:string}[];marks:(number|null)[];scar:string;answers:Record<string,string>;usage:{productId:string;period:string;dose:string;region:string;reaction:string}[];note:string;skipped?:boolean;updatedAt:string};
export type Photo={id:string;date:string;file:string;category:string;note:string;createdAt:string};
export type Product={id:string;name:string;category:string;concentration:string;note:string;start:string;stop:string;frequency:string;region:string;deletedAt?:string};
export const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2);
// Keep a single initialization promise across React Fast Refresh evaluations.
// A full JS-runtime reload gets a new connection instead of a cached native handle.
const connectionState = globalThis as typeof globalThis & {
  __acneDbV1?: { db?: SQLite.SQLiteDatabase; pending?: Promise<void> };
};
const state = connectionState.__acneDbV1 ??= {};
let db:SQLite.SQLiteDatabase;
export function init():Promise<void>{
  if(state.pending)return state.pending.then(()=>{db=state.db!;});
  if(state.db){db=state.db;return Promise.resolve();}
  state.pending=initialize().then(()=>{state.db=db;}).catch(async error=>{
    // Close only our independent handle; never delete or recreate the database file.
    try{if(db)await db.closeAsync();}catch{}
    state.db=undefined;
    throw error;
  }).finally(()=>{state.pending=undefined;});
  return state.pending;
}
export const photoDir=()=>FS.documentDirectory+'photos/';
async function initialize(){db=await SQLite.openDatabaseAsync('acne.db',{useNewConnection:true});await db.execAsync(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS daily(id TEXT UNIQUE NOT NULL,date TEXT PRIMARY KEY NOT NULL,data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS photos(id TEXT PRIMARY KEY,date TEXT NOT NULL,file TEXT NOT NULL,data TEXT NOT NULL); CREATE INDEX IF NOT EXISTS photos_date ON photos(date); CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY,data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,data TEXT NOT NULL); PRAGMA user_version=1;`);await FS.makeDirectoryAsync(photoDir(),{intermediates:true});if(!await setting('initialized')){const names=['芙丽芳丝洁面','适乐肤水杨酸洁面','珂润卸妆啫喱','适乐肤PM乳','贝德玛S乳','凡士林','班赛（浓度待确认）','15%壬二酸','0.05%维A酸','甲硝唑凝胶','红霉素软膏','积雪苷霜乳膏','喜辽妥0.3%','EGF凝胶'];await db.withTransactionAsync(async()=>{for(const name of names)await saveProduct({id:uid(),name,category:'个人已有',concentration:'',note:'',start:'',stop:'',frequency:'',region:''});await setSetting('initialized',true);});}}
export async function setting(key:string){const r=await db.getFirstAsync<{data:string}>('SELECT data FROM settings WHERE key=?',key);return r?JSON.parse(r.data):null;}
export async function setSetting(key:string,v:any){await db.runAsync('INSERT OR REPLACE INTO settings VALUES (?,?)',key,JSON.stringify(v));}
export async function all<T>(table:'daily'|'products'|'photos'):Promise<T[]>{return (await db.getAllAsync<{data:string}>(`SELECT data FROM ${table}`)).map(x=>JSON.parse(x.data));}
export async function saveRecord(r:RecordData){await db.runAsync('INSERT INTO daily VALUES (?,?,?) ON CONFLICT(date) DO UPDATE SET data=excluded.data',r.id,r.date,JSON.stringify(r));}
export async function saveProduct(p:Product){await db.runAsync('INSERT OR REPLACE INTO products VALUES (?,?)',p.id,JSON.stringify(p));}
export async function deleteProduct(id:string){const row=await db.getFirstAsync<{data:string}>('SELECT data FROM products WHERE id=?',id);if(row){const product:Product=JSON.parse(row.data);await saveProduct({...product,deletedAt:product.deletedAt??new Date().toISOString()});}}
export async function addPhoto(p:Photo){await db.runAsync('INSERT INTO photos VALUES (?,?,?,?)',p.id,p.date,p.file,JSON.stringify(p));}
export async function updatePhoto(p:Photo){await db.runAsync('UPDATE photos SET data=? WHERE id=?',JSON.stringify(p),p.id);}
export async function importData(b:{records:RecordData[];products:Product[];photos:Photo[];profile:string}){await db.withTransactionAsync(async()=>{for(const r of b.records)await saveRecord(r);for(const p of b.products)await saveProduct(p);for(const p of b.photos)await db.runAsync(PHOTO_RESTORE_SQL,p.id,p.date,p.file,JSON.stringify(p));await setSetting('profile',b.profile);});}
export async function deletePhoto(p:Photo){await db.runAsync('DELETE FROM photos WHERE id=?',p.id);await FS.deleteAsync(photoDir()+p.file,{idempotent:true});}
export async function deleteRecord(date:string){await db.withTransactionAsync(async()=>{await db.runAsync('DELETE FROM daily WHERE date=?',date);await db.runAsync('DELETE FROM photos WHERE date=?',date);});/* orphan files retained until wipe to keep deletion crash safe */}
export async function wipe(){await db.withTransactionAsync(async()=>{await db.execAsync('DELETE FROM daily;DELETE FROM photos;DELETE FROM products;DELETE FROM settings;');});await FS.deleteAsync(photoDir(),{idempotent:true});await FS.makeDirectoryAsync(photoDir(),{intermediates:true});}
