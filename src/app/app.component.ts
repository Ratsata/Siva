import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListCameraPage } from '../pages/list-camera/list-camera';
import { AlarmPage } from '../pages/alarm/alarm';
import { ConfigPage } from '../pages/config/config';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { SettingsProvider } from './../providers/settings/settings';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { FCM } from '@ionic-native/fcm';
import { Toast } from '@ionic-native/toast';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  selectedTheme: String;
  pages: Array<{title: string, component: any}>;
  current: any;
  public counter=0;

  /* Translate */
  textDashboard: string = "Inicio";
  textCamera: string = "Camaras";
  textAlarm: string = "Alarma";
  textConfiguration: string = "Configuración";

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private translate: TranslateService, private fcm: FCM, public toast: Toast, public toastCtrl: ToastController, private network: Network, public DataService: DataServiceProvider, public settings: SettingsProvider) {
    this.initializeApp();

    this.pages = [
      { title: this.textDashboard, component: HomePage },
      { title: this.textCamera, component: ListCameraPage },
      { title: this.textAlarm, component: AlarmPage },
      { title: this.textConfiguration, component: ConfigPage }
    ];

    this.initTranslate();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("despues");
      //Notifications
      this.fcm.subscribeToTopic('all');
      this.fcm.onNotification().subscribe(data=>{
        if (data.type == "ip"){
          this.DataService.updateIp(data.topic,data.ip).then(res => {
              console.log("New ip dynamic: "+data.ip);
          });
        }else{
          console.log("Notification"+JSON.stringify(data));
        }
        if(data.wasTapped){ 
          //console.log("Received in background");
          //console.log(JSON.stringify(data));
        } else {
          //console.log("Received in foreground");
          //console.log(JSON.stringify(data));
        };
      })
      this.fcm.onTokenRefresh().subscribe(token=>{
        console.log(token);
      });

      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
      });
      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            console.log('wifi');
          }else{
            console.log('not wifi - 3g');
          }
        }, 3000);
      });

      this.platform.registerBackButtonAction(() => {
        console.log("click");
        if (this.counter == 0) {
          this.counter++;
          this.presentToast();
          setTimeout(() => { this.counter = 0 }, 3000)
        } else {
          this.platform.exitApp();
        }
      }, 0)

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.current = this.nav.getActive();
      this.splashScreen.hide();
      this.translate2();
    });
  }

  initTranslate() {
    this.translate.setDefaultLang('es');
    this.DataService.selectConfig().then(data => {
      this.translate.use(data[0].ds_idioma);
    });
  }

  translate2(){
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.translate.get('TAB_INICIO').subscribe(value => {
          this.textDashboard = value;
        });
        this.translate.get('TAB_CAMARAS').subscribe(value => {
          this.textCamera = value;
        });
        this.translate.get('TAB_ALARMA').subscribe(value => {
          this.textAlarm = value;
        });
        this.translate.get('TAB_CONFIGURACION').subscribe(value => {
          this.textConfiguration = value;
        });
      });
  }

  presentToast() {
    this.toast.show('Presione nuevamente para salir', '5000', 'bottom').subscribe(
      toast => {
        console.log("back to exit");
      }
    );
  }

  openPage(page) {
    this.current = this.nav.getActive();
    if(page.component != this.current.component){
      this.nav.push(page.component);
    }
  }
}
