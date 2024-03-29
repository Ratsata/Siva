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

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private translate: TranslateService, private fcm: FCM, public toast: Toast, public toastCtrl: ToastController, public DataService: DataServiceProvider, public settings: SettingsProvider) {
    this.initializeApp();

    this.pages = [
      { title: "Inicio", component: HomePage },
      { title: "Camaras", component: ListCameraPage },
      { title: "Alarma", component: AlarmPage },
      { title: "Configuración", component: ConfigPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
      this.initTranslate();

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
      })
      this.fcm.onTokenRefresh().subscribe(token=>{
        console.log(token);
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
    });
  }

  initTranslate() {
    this.translate.setDefaultLang('es');
    this.DataService.selectConfig().then(data => {
      this.settings.setActiveTheme(data[0].ds_tema);
      this.translate.use(data[0].ds_idioma);
      this.translateData();
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.translateData();
      });
    });
  }

  translateData(){
    this.translate.get('TAB_INICIO').subscribe(value => {
      this.pages[0].title = value;
    });
    this.translate.get('TAB_CAMARAS').subscribe(value => {
      this.pages[1].title = value;
    });
    this.translate.get('TAB_ALARMA').subscribe(value => {
      this.pages[2].title = value;
    });
    this.translate.get('TAB_CONFIGURACION').subscribe(value => {
      this.pages[3].title = value;
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
