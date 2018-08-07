import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListCameraPage } from '../pages/list-camera/list-camera'
//import { ListPage } from '../pages/list/list';
import { AlarmPage } from '../pages/alarm/alarm';

import { TranslateService } from '@ngx-translate/core';

import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private translate: TranslateService, private fcm: FCM) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Camaras', component: ListCameraPage },
      { title: 'Alarma', component: AlarmPage }
      //{ title: 'Configuracion', component: ListPage }
    ];

    this.initTranslate();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      //Notifications
      this.fcm.subscribeToTopic('all');
      this.fcm.subscribeToTopic('mac');
      /* this.fcm.getToken().then(token=>{
          console.log(token);
      }) */
      this.fcm.onNotification().subscribe(data=>{
        if(data.wasTapped){
          console.log("Received in background");
          console.log(JSON.stringify(data));
        } else {
          console.log("Received in foreground");
          console.log(JSON.stringify(data));
        };
      })
      this.fcm.onTokenRefresh().subscribe(token=>{
        console.log(token);
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('es');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('es');
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
