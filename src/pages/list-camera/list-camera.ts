import { Component } from '@angular/core';
import { IonicPage,
        NavController,
        NavParams,
        ModalController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
/* import { AddDataPage } from '../add-data/add-data';
import { EditDataPage } from '../edit-data/edit-data'; */

@IonicPage()
@Component({
  selector: 'page-list-camera',
  templateUrl: 'list-camera.html',
})


export class ListCameraPage {
  private camara : any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private sqlite: SQLite) {
    this.camara = [];
    /* let totalIncome = 0;
    let totalExpense = 0;
    let balance = 0; */
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
      db.executeSql('CREATE TABLE IF NOT EXISTS SV_CAMARA(id_camara INTEGER PRIMARY KEY, ds_nombre TEXT, ds_ip TEXT, ds_imagen TEXT, st_estado INT)', {})
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('SELECT * FROM SV_CAMARA ORDER BY id_camara DESC', {})
      .then(res => {
        this.camara = [];
        for(var i=0; i<res.rows.length; i++) {
          this.camara.push({id_camara:res.rows.item(i).id_camara,ds_nombre:res.rows.item(i).ds_nombre,ds_ip:res.rows.item(i).ds_ip,ds_imagen:res.rows.item(i).ds_imagen,st_estado:res.rows.item(i).st_estado})
        }
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
  
  /* addData() {
    this.navCtrl.push(AddDataPage);
  }
  
  editData(rowid) {
    this.navCtrl.push(EditDataPage, {
      rowid:rowid
    });
  } */
  
  deleteData(rowid) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM expense WHERE rowid=?', [rowid])
      .then(res => {
        console.log(res);
        this.getData();
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  addCamera() {
		const modal = this.modalCtrl.create('NewCameraPage');
		modal.present();
	}

}
