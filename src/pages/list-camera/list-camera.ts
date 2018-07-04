import { Component } from '@angular/core';
import { IonicPage,
        NavController,
        NavParams,
        ModalController,
        AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-list-camera',
  templateUrl: 'list-camera.html',
})


export class ListCameraPage {
  private camara : any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private sqlite: SQLite,public alertCtrl: AlertController) {
    this.camara = [];
  }

  ionViewDidLoad() {
    this.getData();
  }
  
  ionViewWillEnter() {
    this.getData();
  }
  
  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_CAMARA(id_camara INTEGER PRIMARY KEY, ds_nombre TEXT, ds_ip TEXT, ds_port TEXT, ds_usuario, ds_hash, ds_imagen TEXT, st_estado INT)', {})
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('SELECT * FROM SV_CAMARA  ORDER BY id_camara ASC', {})
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
      .catch(e => console.log(JSON.stringify(e)));
    }).catch(e => console.log(JSON.stringify(e)));
  }

  deleteConfirm(id,nombre) {
    const confirm = this.alertCtrl.create({
      title: 'Eliminar camara',
      message: 'Esta seguro que quiere eliminar la camara: '+nombre+'?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            return;
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteData(id);
          }
        }
      ]
    });
    confirm.present();
  }
  
  deleteData(id) {
    console.log("1");
    console.log(id);
    console.log("2");
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      //db.executeSql('UPDATE SV_CAMARA SET st_estado = 0 WHERE id_camara = ?',[id])
      db.executeSql('DELETE FROM SV_CAMARA WHERE id_camara = ?',[id])
      .then(res => {
        console.log(JSON.stringify(res));
        this.getData();
      })
      .catch(e => console.log(JSON.stringify(e)));
    }).catch(e => console.log(JSON.stringify(e)));
  }

  cameraModal(id="new") {
    let addModal = this.modalCtrl.create('NewCameraPage', { id: id });
    addModal.present();
    addModal.onDidDismiss(item => {
      /* if (item) {
        this.camara.push(item);
      } */
      this.getData();
    })
	}

}
