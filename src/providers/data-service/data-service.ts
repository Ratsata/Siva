import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';

@Injectable()
export class DataServiceProvider {
  intoConfigInsert: boolean = false;

  constructor(public http: HttpClient,private sqlite: SQLite) {
    this.open().then((db) => {
      //db.executeSql('DROP TABLE SV_CAMARA', {});
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_CONFIG(id_config INTEGER PRIMARY KEY, ds_idioma TEXT, ds_tema TEXT)', []);
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_CAMARA(id_camara INTEGER PRIMARY KEY, ds_nombre TEXT, ds_id TEXT, ds_ip TEXT, ds_port TEXT, ds_usuario, ds_hash, st_estado INT, ds_ipDynamic TEXT)', []);
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_DASHBOARD(id_dashboard INTEGER PRIMARY KEY, id_cuadro INTEGER, id_camara INTEGER)', []);
    });
  }

  open(){
    return this.sqlite.create({name: 'ionicdb.db', location: 'default'});
  }

  /* CAMARAS */
  selectCamara(id, estado=1){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql("SELECT * FROM SV_CAMARA WHERE id_camara = ? AND st_estado = ?", [id, estado])
          .then((data) => {
            let retorno = [];
            for(var i =0; i< data.rows.length;i++){
              retorno.push({id_camara:data.rows.item(i).id_camara,
                ds_id:data.rows.item(i).ds_id,
                ds_nombre:data.rows.item(i).ds_nombre,
                ds_ip:data.rows.item(i).ds_ip,
                ds_port:data.rows.item(i).ds_port,
                ds_usuario:data.rows.item(i).ds_usuario,
                ds_hash:data.rows.item(i).ds_hash,
                st_estado:data.rows.item(i).st_estado,
                ds_ipDynamic:data.rows.item(i).ds_ipDynamic
              });
            }
            resolve(retorno);
          });
      });
    });
  }
  
  selectCamaras(){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql("SELECT * FROM SV_CAMARA ORDER BY id_camara ASC", [])
          .then((data) => {
            let retorno = [];
            for(var i =0; i< data.rows.length;i++){
              retorno.push({id_camara:data.rows.item(i).id_camara,
                ds_id:data.rows.item(i).ds_id,
                ds_nombre:data.rows.item(i).ds_nombre,
                ds_ip:data.rows.item(i).ds_ip,
                ds_port:data.rows.item(i).ds_port,
                ds_usuario:data.rows.item(i).ds_usuario,
                ds_hash:data.rows.item(i).ds_hash,
                st_estado:data.rows.item(i).st_estado,
                ds_ipDynamic:data.rows.item(i).ds_ipDynamic
              });
            }
            resolve(retorno);
          });
      });
    });
  }

  insertCamara(ds_nombre,ds_id,ds_ip,ds_port,ds_usuario,ds_hash,st_estado = 1){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql('INSERT INTO SV_CAMARA VALUES(NULL,?,?,?,?,?,?,?,NULL)',[ds_nombre,
          ds_id,
          ds_ip,
          ds_port,
          ds_usuario,
          ds_hash,
          st_estado])
        .then((data) => {
          resolve(data);
        });
      });
    });
  }

  updateCamara(id,ds_nombre,ds_id,ds_ip,ds_port,ds_usuario,ds_hash){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql('UPDATE SV_CAMARA SET ds_nombre = ?,ds_id = ?,ds_ip = ?,ds_port = ?,ds_usuario = ?,ds_hash = ? WHERE id_camara = ?',
            [ds_nombre,
            ds_id,
            ds_ip,
            ds_port,
            ds_usuario,
            ds_hash,
            id])
        .then((data) => {
          resolve(data);
        });
      });
    });
  }

  deleteCamara(id){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql('DELETE FROM SV_CAMARA WHERE ds_id = ?',[id])
        .then((data) => {
          resolve(data);
        });
      });
    });
  }

  updateIp(id, ipDynamic){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql('UPDATE SV_CAMARA SET ds_ipDynamic = ? WHERE ds_id = ?',[ipDynamic, id])
        .then((data) => {
          resolve(data);
        });
      });
    });
  }

  /* DASHBOARD */
  selectDashboard(){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql('SELECT SD.id_dashboard, SD.id_cuadro, SD.id_camara, SC.ds_ip, SC.ds_ipDynamic FROM SV_DASHBOARD SD LEFT JOIN SV_CAMARA SC ON (SD.id_camara = SC.id_camara)', [])
          .then((data) => {
            let retorno = [];
            for(var i =0; i< data.rows.length;i++){
              retorno.push({id_dashboard:data.rows.item(i).id_dashboard,
                id_cuadro:data.rows.item(i).id_cuadro,
                id_camara:data.rows.item(i).id_camara,
                ds_ip:data.rows.item(i).ds_ip,
                ds_ipDynamic:data.rows.item(i).ds_ipDynamic
              });
            }
            resolve(retorno);
          }).catch((e) => console.log(JSON.stringify(e)));
      });
    });
  }

  insertDashboard(id_cuadro, id_camara){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql('INSERT INTO SV_DASHBOARD(id_cuadro, id_camara) VALUES(?, ?)', [id_cuadro, id_camara])
        .then((data) => {
          resolve(data);
        });
      });
    });
  }

  deleteDashboard(id_cuadro){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql('DELETE FROM SV_DASHBOARD WHERE id_cuadro = ?', [id_cuadro])
        .then((data) => {
          resolve(data);
        });
      });
    });
  }

  /* CONFIG */
  selectConfig(){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql("SELECT * FROM SV_CONFIG", [])
          .then((data) => {
            let retorno = [];
            if(data.rows.length == 0 && !this.intoConfigInsert){
              this.intoConfigInsert = true;
              db.executeSql("INSERT INTO SV_CONFIG(ds_idioma,ds_tema) VALUES ('es','dark-theme')", [])
              .then((data) => {
                retorno.push({id_config:"1",
                  ds_idioma:"esp",
                  ds_tema:"dark_theme"
                });
                resolve(retorno);
              }).catch(e => console.log(JSON.stringify(e)));
            }else{
              for(var i =0; i< data.rows.length;i++){
                retorno.push({id_config:data.rows.item(i).id_config,
                  ds_idioma:data.rows.item(i).ds_idioma,
                  ds_tema:data.rows.item(i).ds_tema
                });
              }
              resolve(retorno);
            }
          });
      });
    });
  }

  updateConfig(ds_idioma,ds_tema,id=1){
    return new Promise((resolve, reject) => {
      this.open().then((db) => {
        db.executeSql('UPDATE SV_CONFIG SET ds_idioma = ?,ds_tema = ? WHERE id_config = ?',
            [ds_idioma,
            ds_tema,
            id])
        .then((data) => {
          resolve(data);
        });
      });
    });
  }
}
