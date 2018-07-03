import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { NewCameraPage } from './new-camera';

@NgModule({
  declarations: [
    NewCameraPage,
  ],
  imports: [
    IonicPageModule.forChild(NewCameraPage),
    TranslateModule.forChild()
  ],
  exports: [
    NewCameraPage
  ]
})
export class NewCameraPageModule {}
