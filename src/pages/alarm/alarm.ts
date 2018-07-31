import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

/**
 * Generated class for the AlarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html',
})
export class AlarmPage {
  labelStatus : string;
  alarmStatus : boolean;
  status : boolean = false;
  tipo : string = "robo";

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HTTP) {
    this.http.post("http://192.168.0.192/upload/upload.php?action=get", {}, {}).then(data => {
      this.alarmStatus = data["data"] ? true : false;
      this.changeStatus(this.alarmStatus);
    }).catch(error => {
      this.alarmStatus = false;
      this.changeStatus(false);
    });
  }

  alarmButton(){
    if(!this.alarmStatus){
      this.labelStatus = "Encendido";
      this.startAlarm();
    }else{
      this.labelStatus = "Apagado";
      this.stopAlarm();
    }
    this.alarmStatus = !this.alarmStatus;
  }

  changeStatus(value){
    if(value){
      this.labelStatus = "Encendido";
    }else{
      this.labelStatus = "Apagado";
    }
  }

  startAlarm(){
    this.callHTTP("http://192.168.0.192/upload/upload.php?action=alarm&tipo="+this.tipo);
  }

  stopAlarm(){
    this.callHTTP("http://192.168.0.192/upload/upload.php?action=stop");
    
  }

  callHTTP(url){
    this.http.post(url, {}, {}).then(data => {
      return data;
    }).catch(error => {
      return "NOK";
    });
  }

}
