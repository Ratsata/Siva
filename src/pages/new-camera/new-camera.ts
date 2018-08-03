import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { ToastController } from 'ionic-angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@IonicPage()
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder,
    private sqlite: SQLite, private toast: Toast, private qrScanner: QRScanner, private toastCtrl: ToastController) {
    this.form = formBuilder.group({
      ds_nombre: ['', Validators.required],
      ds_ip: ['', Validators.compose([
        Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/),
        Validators.required
      ])],
      ds_port: ['554', Validators.required],
      ds_usuario: ['admin', Validators.required],
      ds_hash: ['cleanvoltage2018', Validators.required],
      ds_imagen: ['554', Validators.required]
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

  validateIP(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }
    return (false)  
  }

  getData(id) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM SV_CAMARA WHERE id_camara = ? AND st_estado = 1', [id])
      .then(res => {
        this.form.get('ds_nombre').setValue(res.rows.item(0).ds_nombre);
        this.form.get('ds_ip').setValue(res.rows.item(0).ds_ip);
        this.form.get('ds_port').setValue(res.rows.item(0).ds_port);
        this.form.get('ds_usuario').setValue(res.rows.item(0).ds_usuario);
        this.form.get('ds_hash').setValue(res.rows.item(0).ds_hash);
        this.form.get('ds_imagen').setValue(res.rows.item(0).ds_imagen);
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  saveData() {
    if (!this.form.valid) { return; }
    if (!this.validateIP(this.form.value.ds_ip)){
      this.toast.show('IP Incorrecta, ingrese una valida', '5000', 'center').subscribe(
        toast => { console.log("ERROR IP"); }
      );
      return;
    }
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO SV_CAMARA VALUES(NULL,?,?,?,?,?,?,?)',[this.form.value.ds_nombre,
                                                                        this.form.value.ds_ip,
                                                                        this.form.value.ds_port,
                                                                        this.form.value.ds_usuario,
                                                                        this.form.value.ds_hash,
                                                                        this.form.value.ds_imagen,
                                                                        1])
        .then(res => {
          console.log(res);
          this.toast.show('Creación Exitosa!', '5000', 'center').subscribe(
            toast => {
              //this.navCtrl.popToRoot();
              this.viewCtrl.dismiss(this.form.value);
            }
          );
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  updateData(id){
    if (!this.form.valid) { return; }
    if (!this.validateIP(this.form.value.ds_ip)){
      this.toast.show('IP Incorrecta, ingrese una valida', '5000', 'center').subscribe(
        toast => { console.log("ERROR IP"); }
      );
      return;
    }
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE SV_CAMARA SET ds_nombre = ?,ds_ip = ?,ds_port = ?,ds_usuario = ?,ds_hash = ?,ds_imagen = ? WHERE id_camara = ?',
                                        [this.form.value.ds_nombre,
                                          this.form.value.ds_ip,
                                          this.form.value.ds_port,
                                          this.form.value.ds_usuario,
                                          this.form.value.ds_hash,
                                          this.form.value.ds_imagen,
                                        id])
        .then(res => {
          console.log(res);
          this.toast.show('Guardado exitoso!', '5000', 'center').subscribe(
            toast => {
              //this.navCtrl.popToRoot();
              this.viewCtrl.dismiss(this.form.value);
            }
          );
        })
        .catch(e => {
          e = JSON.stringify(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
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
          message: 'Otorgue los permisos necesarios para escanear el código QR',
          duration: 5000,
          position: 'bottom'
        });
        toast.onDidDismiss(() => {
          this.qrScanner.openSettings();
        });
        toast.present();
      }
    })
    .catch((e: any) => console.log('Error is', e));
  }
  
  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    (window.document.querySelector('#dib') as HTMLElement).classList.add('invisib');
  }
  
  hideCamera() {
    (window.document.querySelector('#dib') as HTMLElement).classList.remove('invisib');
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

  refill(data){
    console.log(data);
    let obj = JSON.parse(data);
    this.form.get('ds_ip').setValue(obj.ip);
    this.form.get('ds_port').setValue(obj.port);
    this.form.get('ds_usuario').setValue(obj.user);
    this.form.get('ds_hash').setValue(obj.pass);
    this.form.get('ds_imagen').setValue(obj.port);
  }
}
