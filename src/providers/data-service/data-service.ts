import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@Injectable()
export class DataServiceProvider {
  camara: any;
  public data: string;
  constructor(public http: HttpClient,private sqlite: SQLite, private toast: Toast) {
    this.camara = [];
  }

  getData(id=1) {
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
          })
        }
      })
      .catch(e => console.log("1x"));
    }).catch(e => console.log("2x"));
  }

}
