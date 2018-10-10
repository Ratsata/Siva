import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Toast } from '@ionic-native/toast';
import { ToastController } from 'ionic-angular';

import { DataServiceProvider } from '../../providers/data-service/data-service';
import { TranslateService } from '@ngx-translate/core';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { FCM } from '@ionic-native/fcm';
import { HTTP } from '@ionic-native/http';


@Component({
  selector: 'page-new-camera',
  templateUrl: 'new-camera.html',
})
export class NewCameraPage {

  isReadyToSave: boolean;
  form: FormGroup;
  MODAL_TITLE : string = 'CAMERA_ADD_TITLE';
  camara : any = [];
  id: string;

  /* Translate */
  textIpFail: string;
  textInsertSuccess: string;
  textUpdateSuccess: string;
  textQrPermission: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder,
    private toast: Toast, private qrScanner: QRScanner, private toastCtrl: ToastController, private fcm: FCM,
    private httpadvance: HTTP, private DataService: DataServiceProvider, private translateService: TranslateService) {
    this.initTranslate();
    this.form = formBuilder.group({
      ds_nombre: ['', Validators.required],
      ds_id: ['', Validators.required],
      ds_ip: ['', Validators.compose([
        Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/),
        Validators.required
      ])],
      ds_port: ['554', Validators.required],
      ds_usuario: ['admin', Validators.required],
      ds_hash: ['cleanvoltage2018', Validators.required]
    });
    this.id = navParams.get('id');
    if (this.id == 'new'){
      this.MODAL_TITLE = "CAMERA_ADD_TITLE";
    }else{
      this.MODAL_TITLE = "CAMERA_UPDATE_TITLE";
      this.getData(this.id);
    }

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  initTranslate(){
    this.translateService.get('LABEL_IP_FAIL').subscribe(value => {
      this.textIpFail = value;
    });
    this.translateService.get('LABEL_INSERT_SUCCESS').subscribe(value => {
      this.textInsertSuccess = value;
    });
    this.translateService.get('LABEL_UPDATE_SUCCESS').subscribe(value => {
      this.textUpdateSuccess = value;
    });
    this.translateService.get('LABEL_QR_PERMISSION').subscribe(value => {
      this.textQrPermission = value;
    });
  }

  validateIP(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }
    return (false)  
  }

  getData(id) {
    this.DataService.selectCamara(id).then(res => {
      this.form.get('ds_nombre').setValue(res[0].ds_nombre);
      this.form.get('ds_id').setValue(res[0].ds_id);
      this.form.get('ds_ip').setValue(res[0].ds_ip);
      this.form.get('ds_port').setValue(res[0].ds_port);
      this.form.get('ds_usuario').setValue(res[0].ds_usuario);
      this.form.get('ds_hash').setValue(res[0].ds_hash);
    }).catch(e => console.log(JSON.stringify(e)));
  }

  saveData() {
    if (!this.form.valid) { return; }
    if (!this.validateIP(this.form.value.ds_ip)){
      this.toast.show(this.textIpFail, '5000', 'center').subscribe(toast => { 
        console.log("ERROR IP"); 
      });
      return;
    }
    this.DataService.insertCamara(this.form.value.ds_nombre,this.form.value.ds_id,this.form.value.ds_ip,this.form.value.ds_port,this.form.value.ds_usuario,this.form.value.ds_hash).
    then(res => {
      console.log(JSON.stringify(res));
      this.fcm.subscribeToTopic(this.form.value.ds_id);
      this.httpadvance.post('http://'+this.form.value.ds_ip+'/SivaAPI/upload.php?action=add&id='+this.form.value.ds_id, {}, {}).then(data => {
        console.log("POST");
      }).catch(error => {
        console.log("ERROR POST");
      });
      this.toast.show(this.textInsertSuccess, '5000', 'center').subscribe(toast => {
        this.viewCtrl.dismiss(this.form.value);
      });
    }).catch(e => {
      e = JSON.stringify(e);
      this.toast.show(e, '5000', 'center').subscribe(toast => {
        console.log(toast);
      });
    });
  }

  updateData(id){
    if (!this.form.valid) { return; }
    if (!this.validateIP(this.form.value.ds_ip)){
      this.toast.show(this.textIpFail, '5000', 'center').subscribe(
        toast => { console.log("ERROR IP"); }
      );
      return;
    }
    this.DataService.updateCamara(id,this.form.value.ds_nombre,this.form.value.ds_id,this.form.value.ds_ip,this.form.value.ds_port,this.form.value.ds_usuario,this.form.value.ds_hash,)
    .then(res => {
      this.toast.show(this.textUpdateSuccess, '5000', 'center').subscribe(toast => {
        this.viewCtrl.dismiss(this.form.value);
      });
    }).catch(e => {
      e = JSON.stringify(e);
      this.toast.show(e, '5000', 'center').subscribe(toast => {
        console.log(toast);
      });
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
  
  ionViewWillLeave(){
    this.hideCamera(); 
  }

  showQr() {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        this.qrScanner.show();
        this.showCamera();
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          this.refill(text);
          this.qrScanner.hide();
          this.hideCamera();
          scanSub.unsubscribe();
        });
      } else if (status.denied) {
        let toast = this.toastCtrl.create({
          message: this.textQrPermission,
          duration: 5000,
          position: 'bottom'
        });
        toast.onDidDismiss(() => {
          this.qrScanner.openSettings();
        });
        toast.present();
      }
    })
    .catch((e: any) => console.log('Error is', JSON.stringify(e)));
  }
  
  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    (window.document.querySelector('#formCamera') as HTMLElement).classList.add('invisib');
  }
  
  hideCamera() {
    (window.document.querySelector('#formCamera') as HTMLElement).classList.remove('invisib');
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

  refill(data){
    let obj = JSON.parse(data);
    this.form.get('ds_id').setValue(obj.id);
    this.form.get('ds_ip').setValue(obj.ip);
    this.form.get('ds_port').setValue(obj.port);
    this.form.get('ds_usuario').setValue(obj.user);
    this.form.get('ds_hash').setValue(obj.pass);
  }
}
