import { SettingsProvider } from './../../providers/settings/settings';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from './../../providers/data-service/data-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {
  selectedTheme: string;
  selectedLang: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public settings: SettingsProvider, private DataService: DataServiceProvider, private translate: TranslateService) {
    this.DataService.selectConfig().then(data => {
      console.log("DATA:!!!"+JSON.stringify(data));
      this.selectedLang = data[0].ds_idioma;
      this.selectedTheme = data[0].ds_tema;
    });
  }

  saveState() {
    this.DataService.updateConfig(this.selectedLang,this.selectedTheme);
    this.translate.use(this.selectedLang);
    this.settings.setActiveTheme(this.selectedTheme);
  }
  
}
