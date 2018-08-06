import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';

@Injectable()
export class DataServiceProvider {

  constructor(public http: HttpClient,private sqlite: SQLite) {
    // this.getData();
  }

  select(){
    return new Promise((resolve, reject) => {
      this.open().then((teste) => {
        teste.executeSql("SELECT * FROM SV_CAMARA", {})
        .then((data) => {
          let retorno = [];
          for(var i =0; i< data.rows.length;i++){
            retorno.push({id_camara:data.rows.item(i).id_camara,
              ds_nombre:data.rows.item(i).ds_nombre,
              ds_ip:data.rows.item(i).ds_ip,
              ds_port:data.rows.item(i).ds_port,
              ds_usuario:data.rows.item(i).ds_usuario,
              ds_hash:data.rows.item(i).ds_hash,
              ds_imagen:data.rows.item(i).ds_imagen,
              st_estado:data.rows.item(i).st_estado
            })
          }
          resolve(retorno);
        })
      });
    });
  }

  saveState(id_cuadro, id_camara){
    return new Promise((resolve, reject) => {
      this.open().then((teste) => {
        teste.executeSql('UPDATE SV_DASHBOARD SET id_cuadro = ?,id_camara = ?',
        [id_cuadro,id_camara])
        .then((data) => {
          let retorno = [];
          for(var i =0; i< data.rows.length;i++){
            retorno.push({id_camara:data.rows.item(i).id_camara,
              ds_nombre:data.rows.item(i).ds_nombre,
              ds_ip:data.rows.item(i).ds_ip,
              ds_port:data.rows.item(i).ds_port,
              ds_usuario:data.rows.item(i).ds_usuario,
              ds_hash:data.rows.item(i).ds_hash,
              ds_imagen:data.rows.item(i).ds_imagen,
              st_estado:data.rows.item(i).st_estado
            })
          }
          resolve(retorno);
        })
      });
    });
  }

  open(){
    return this.sqlite.create({name: 'ionicdb.db', location: 'default'});
    /* return this.sqlite.create({name: 'ionicdb.db', location: 'default'}).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_USUARIO(id_usuario INTEGER PRIMARY KEY, ds_nombre TEXT, ds_correo TEXT, ds_fono TEXT, ds_user, ds_hash, st_estado INT)', {});
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_CAMARA(id_camara INTEGER PRIMARY KEY, ds_nombre TEXT, ds_ip TEXT, ds_port TEXT, ds_usuario, ds_hash, ds_imagen TEXT, st_estado INT)', {});
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_USUARIO_CAMARA(id_usuario_camara INTEGER PRIMARY KEY, id_usuario INTEGER, id_camara INTEGER)', {});
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_CONFIG(id_config INTEGER PRIMARY KEY, ds_idioma TEXT, ds_tema TEXT, ds_cuadros INTEGER)', {});
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_DASHBOARD(id_cuadro INTEGER PRIMARY KEY, id_camara INTEGER PRIMARY KEY)', {});
    }); */
  }
}
