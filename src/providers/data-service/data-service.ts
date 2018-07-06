import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@Injectable()
export class DataServiceProvider {

  constructor(public http: HttpClient,private sqlite: SQLite, private toast: Toast) {
    // this.getData();
  }

  select(){
    return new Promise((resolve, reject) => {
      this.open().then((teste) => {
        teste.executeSql("SELECT * FROM SV_CAMARA", {})
        .then((data) => {
          let retorno = [];
          for(var i =0; i< data.rows.length;i++){
            //retorno += data.rows.item(i).ds_nombre;
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
  }

  /* getData(id=1) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM SV_CAMARA WHERE id_camara = ? ', [id])
      .then(res => {
        this.camara = [];
        for(var i=0; i<res.rows.length; i++) {
          this.camara.push({id_camara:res.rows.item(i).id_camara,
            ds_nombre:res.rows.item(i).ds_nombre,
            ds_ip:res.rows.item(i).ds_ip,
            ds_port:res.rows.item(i).ds_port,
            ds_usuario:res.rows.item(i).ds_usuario,
            ds_hash:res.rows.item(i).ds_hash,
            ds_imagen:res.rows.item(i).ds_imagen,
            st_estado:res.rows.item(i).st_estado
          });
          console.log(JSON.stringify(this.camara));
        }
      })
      .catch(e => console.log("1x: "+JSON.stringify(e)));
    }).catch(e => console.log("2x: "+JSON.stringify(e)));
  } */

}
