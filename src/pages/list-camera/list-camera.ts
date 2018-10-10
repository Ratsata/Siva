import { Component } from '@angular/core';
import { NavController,
        NavParams,
        ModalController,
        AlertController } from 'ionic-angular';
import { NewCameraPage } from '../../pages/new-camera/new-camera';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { TranslateService } from '@ngx-translate/core';

import { FCM } from '@ionic-native/fcm';
import { HTTP } from '@ionic-native/http';
import { LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-list-camera',
  templateUrl: 'list-camera.html',
})


export class ListCameraPage {
  private camara : any;

  /* Translate */
  textLoading: string;
  textDeleteCamera: string;
  textRemoveCamera: string;
  textCancel: string;
  textDelete: string;
  textRemoveCameraText: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, private fcm: FCM, private httpadvance: HTTP, public loadingCtrl: LoadingController, private DataService: DataServiceProvider, private translateService: TranslateService) {
    this.initTranslate();
    this.camara = [];
  }

  ionViewDidLoad() {
    this.getData();
  }

  ionViewWillEnter() {
    this.getData();
  }

  initTranslate(){
    this.translateService.get('LABEL_LOADING').subscribe(value => {
      this.textLoading = value;
    });
    this.translateService.get('LABEL_REMOVE_CAMERA_2').subscribe(value => {
      this.textRemoveCamera = value;
    });
    this.translateService.get('LABEL_REMOVE_CAMERA_TEXT').subscribe(value => {
      this.textRemoveCameraText = value;
    });
    this.translateService.get('CANCEL_BUTTON_TEXT').subscribe(value => {
      this.textCancel = value;
    });
    this.translateService.get('DELETE_BUTTON_TEXT').subscribe(value => {
      this.textDelete = value;
    });
  }
  
  getData() {
    this.DataService.selectCamaras().then((data) => this.camara = data);
  }

  cameraModal(id="new") {
    const loader = this.loadingCtrl.create({
      content: this.textLoading,
      duration: 500
    });
    loader.present();
    let addModal = this.modalCtrl.create(NewCameraPage, { id: id });
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
      title: this.textRemoveCamera,
      message: this.textRemoveCameraText+nombre+'?',
      buttons: [{
        text: this.textCancel,
        handler: () => {
          return;
        }
      },{
        text: this.textDelete,
        handler: () => {
          this.DataService.deleteCamara(id).then(res => {
            this.fcm.unsubscribeFromTopic(id);
            this.httpadvance.post('http://'+ip+'/SivaAPI/upload.php?action=remove&id='+id, {}, {}).then(data => {
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
