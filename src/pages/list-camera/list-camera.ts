import { Component } from '@angular/core';
import { IonicPage,
        NavController,
        NavParams,
        ModalController,
        AlertController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { FCM } from '@ionic-native/fcm';
import { HTTP } from '@ionic-native/http';

@IonicPage()
@Component({
  selector: 'page-list-camera',
  templateUrl: 'list-camera.html',
})


export class ListCameraPage {
  private camara : any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private sqlite: SQLite,public alertCtrl: AlertController, private fcm: FCM, private httpadvance: HTTP) {
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
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_CAMARA(id_camara INTEGER PRIMARY KEY, ds_nombre TEXT, ds_id TEXT, ds_ip TEXT, ds_port TEXT, ds_usuario, ds_hash, st_estado INT)', {})
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('SELECT * FROM SV_CAMARA  ORDER BY id_camara ASC', {})
      .then(res => {
        this.camara = [];
        for(var i=0; i<res.rows.length; i++) {
          console.log(JSON.stringify(res.rows.item(i)));
          this.camara.push({id_camara:res.rows.item(i).id_camara,
                            ds_nombre:res.rows.item(i).ds_nombre,
                            ds_id:res.rows.item(i).ds_id,
                            ds_ip:res.rows.item(i).ds_ip,
                            ds_port:res.rows.item(i).ds_port,
                            ds_usuario:res.rows.item(i).ds_usuario,
                            ds_hash:res.rows.item(i).ds_hash,
                            st_estado:res.rows.item(i).st_estado
          })
        }
      })
      .catch(e => console.log(JSON.stringify(e)));
    }).catch(e => console.log(JSON.stringify(e)));
  }

  deleteConfirm(id,nombre,ip) {
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
            this.deleteData(id,ip);
          }
        }
      ]
    });
    confirm.present();
  }
  
  deleteData(id,ip) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM SV_CAMARA WHERE ds_id = ?',[id])
      .then(res => {
        this.fcm.unsubscribeFromTopic(id);
        this.httpadvance.post('http://'+ip+'/upload/upload.php?action=remove&id='+id, {}, {}).then(data => {
            console.log("POST");
          }).catch(error => {
            console.log("ERROR POST");
        });
        this.getData();
      }).catch(e => console.log(JSON.stringify(e)));
    }).catch(e => console.log(JSON.stringify(e)));
  }

  cameraModal(id="new") {
    let addModal = this.modalCtrl.create('NewCameraPage', { id: id });
    (window.document.querySelector('.inviseable') as HTMLElement).classList.add('invisib');
    addModal.present();
    addModal.onDidDismiss(item => {
      (window.document.querySelector('.inviseable') as HTMLElement).classList.remove('invisib');
      this.getData();
    })
	}

}
