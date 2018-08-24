import { Component } from '@angular/core';
import { IonicPage,
        NavController,
        NavParams,
        ModalController,
        AlertController } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';

import { FCM } from '@ionic-native/fcm';
import { HTTP } from '@ionic-native/http';
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-list-camera',
  templateUrl: 'list-camera.html',
})


export class ListCameraPage {
  private camara : any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, private fcm: FCM, private httpadvance: HTTP, public loadingCtrl: LoadingController, private DataService: DataServiceProvider) {
    this.camara = [];
  }

  ionViewDidLoad() {
    this.getData();
  }
  
  ionViewWillEnter() {
    this.getData();
  }
  
  getData() {
    this.DataService.selectCamaras().then((data) => this.camara = data);
  }

  cameraModal(id="new") {
    const loader = this.loadingCtrl.create({
      content: "Cargando...",
      duration: 500
    });
    loader.present();
    let addModal = this.modalCtrl.create('NewCameraPage', { id: id });
    loader.onWillDismiss(item => {
      addModal.present();
      (window.document.querySelector('.inviseable') as HTMLElement).classList.add('invisib');
    });
    addModal.onDidDismiss(item => {
      (window.document.querySelector('.inviseable') as HTMLElement).classList.remove('invisib');
      this.getData();
    });
	}

  deleteConfirm(id,nombre,ip) {
    const confirm = this.alertCtrl.create({
      title: 'Eliminar camara',
      message: 'Esta seguro que desea eliminar la camara: '+nombre+'?',
      buttons: [{
        text: 'Cancelar',
        handler: () => {
          return;
        }
      },{
        text: 'Eliminar',
        handler: () => {
          this.DataService.deleteCamara(id).then(res => {
            this.fcm.unsubscribeFromTopic(id);
            this.httpadvance.post('http://'+ip+'/upload/upload.php?action=remove&id='+id, {}, {}).then(data => {
              console.log("POST");
            }).catch(error => {
              console.log("ERROR POST");
            });
            this.getData();
          }).catch(e => console.log(JSON.stringify(e)));
        }
      }]
    });
    confirm.present();
  }

}
