import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListCameraPage } from './list-camera';

@NgModule({
  declarations: [
    ListCameraPage,
  ],
  imports: [
    IonicPageModule.forChild(ListCameraPage),
  ],
})
export class ListCameraPageModule {}
