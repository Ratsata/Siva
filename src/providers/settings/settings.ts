import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { DataServiceProvider } from './../data-service/data-service';

@Injectable()
export class SettingsProvider {

  private theme: BehaviorSubject<String>;
  
  constructor(public http: HttpClient, private DataService: DataServiceProvider) {
    this.theme = new BehaviorSubject('light-theme');
    /* this.DataService.selectConfig().then(data =>{
      this.setActiveTheme(data[0].ds_tema);
    }); */
  }
 
  setActiveTheme(val) {
    this.theme.next(val);
  }
 
  getActiveTheme() {
    return this.theme.asObservable();
  }
}
