import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

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

    /* Translate */
  textEncendido: string = "Encendido";
  textApagado: string = "Apagado";
  alarm_on: string;
  alarm_off: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HTTP, private translateService: TranslateService) {
    this.initTranslate();
    this.http.post("http://192.168.0.192/upload/upload.php?action=get", {}, {}).then(data => {
      this.alarmStatus = data["data"] ? true : false;
      this.changeStatus(this.alarmStatus);
    }).catch(error => {
      this.alarmStatus = false;
      this.changeStatus(false);
    });
    console.log("Data: Final");
  }

  initTranslate(){
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.get('LABEL_STATUS_ON').subscribe(value => {
        this.textEncendido = value;
        console.log("Value: "+this.textEncendido);
      });
      this.translateService.get('LABEL_STATUS_OFF').subscribe(value => {
        this.textApagado = value;
      });
    });
  }

  alarmButton(){
    if(!this.alarmStatus){
      this.labelStatus = this.textEncendido;
      this.startAlarm();
    }else{
      this.labelStatus = this.textApagado;
      this.stopAlarm();
    }
    this.alarmStatus = !this.alarmStatus;
  }

  changeStatus(value){
    if(value){
      this.labelStatus = this.textEncendido;
    }else{
      this.labelStatus = this.textApagado;
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
