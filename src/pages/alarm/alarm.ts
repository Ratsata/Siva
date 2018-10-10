import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Toast } from '@ionic-native/toast';


@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html',
})
export class AlarmPage {
  labelStatus : string;
  alarmStatus : boolean;
  status : boolean = false;
  tipo : string = "robo";
  camara: any;

  /* Translate */
  textEncendido: string = "Encendido";
  textApagado: string = "Apagado";
  alarm_on: string;
  alarm_off: string;
  error_connection: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HTTP, private translateService: TranslateService, private DataService: DataServiceProvider, private toast: Toast) {
    this.initTranslate();
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.initTranslate();
    });

    this.camara = [];
  }

  ionViewDidEnter(){
    this.DataService.selectCamaras().then((data_camara) =>{
      this.camara = data_camara;
      if(this.camara.length > 0){
        for (let i = 0; i < this.camara.length; i++) {
          let url = "http://"+ this.camara[i].ds_ip +"/SivaAPI/upload.php?action=getpid";
          this.http.post(url, {}, {}).then(data => {
            this.alarmStatus = data["data"] ? true : false;
            this.changeStatus(this.alarmStatus);
          }).catch(e=>{
            let url = "http://"+ this.camara[i].ds_ipDynamic +"/SivaAPI/upload.php?action=getpid";
            this.http.post(url, {}, {}).then(data => {
              this.alarmStatus = data["data"] ? true : false;
              this.changeStatus(this.alarmStatus);
            }).catch(e=> console.log(JSON.stringify(e)));
          });
        }
      }else{
        this.alarmStatus = false;
        this.changeStatus(false);
      }
    });
  }

  ionViewDidLoad(){
    document.getElementById('alarmSwitch').dataset.tgon = this.alarm_on;
    document.getElementById('alarmSwitch').dataset.tgoff = this.alarm_off;
  }

  initTranslate(){
    this.translateService.get('LABEL_STATUS_ON').subscribe(value => {
      this.textEncendido = value;
    });
    this.translateService.get('LABEL_STATUS_OFF').subscribe(value => {
      this.textApagado = value;
    });
    this.translateService.get('LABEL_ACTIVATED').subscribe(value => {
      this.alarm_on = value;
    });
    this.translateService.get('LABEL_DESACTIVATED').subscribe(value => {
      this.alarm_off = value;
    });
    this.translateService.get('LABEL_ERROR_CONNECTION').subscribe(value => {
      this.error_connection = value;
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
    this.callHTTP("alarm");
  }

  stopAlarm(){
    this.callHTTP("stop");
  }

  callHTTP(action="alarm"){
    let swChange = false;
    if(this.camara.length > 0){
      for (let i = 0; i < this.camara.length; i++) {
        let url = "http://"+ this.camara[i].ds_ip +"/SivaAPI/upload.php?action="+action+"&tipo="+this.tipo;
        this.http.post(url, {}, {}).then(data => {
          console.log(JSON.stringify(data));
          swChange = true;
        }).catch(error => {
          let url = "http://"+ this.camara[i].ds_ipDynamic +"/SivaAPI/upload.php?action="+action+"&tipo="+this.tipo;
          this.http.post(url, {}, {}).then(data => {
            console.log(JSON.stringify(data));
            swChange = true;
          }).catch(e=> {
            console.log(JSON.stringify(e));
            if(this.camara.length-1 == i && !swChange){
              this.toast.showLongCenter(this.error_connection).subscribe(toast => {
                console.log(JSON.stringify(toast));
              });
            }
            this.alarmStatus = false;
            this.changeStatus(false);
          });
        });
      }
    }
  }

}
