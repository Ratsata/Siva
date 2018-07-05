import { Component } from '@angular/core';
import { NavController,
		ToastController,
		ModalController,
		AlertController } from 'ionic-angular';
//import { Http, Jsonp } from '@angular/http';
import { MediaPlayerService } from '../services/MediaPlayerService';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MediaPlayerService, DataServiceProvider]
})

export class HomePage {
	
	/*private buttonColor: string = "#a7253f";
	private count = 0;
	private timeStart  = 0;
	private timeResult  = 0;
	private activeButton = false;*/
	private columnaCamera : string  = 'col6';
	private visible : number = 1;
	private selected : number = 1;
	camara: any;

	constructor(public navCtrl: NavController, public toastCtrl: ToastController, public mplayer: MediaPlayerService, public modalCtrl: ModalController,public alertCtrl: AlertController, public DataService: DataServiceProvider) {
		this.camara = this.DataService.getData();
	}

	addCamera() {
		console.log("Data:"+JSON.stringify(this.camara));
		//const modal = this.modalCtrl.create('SelectCameraPage');
		//modal.present();
		let alert = this.alertCtrl.create();
		alert.setTitle('Seleccione una camara');

		alert.addInput({
			type: 'radio',
			label: 'Camara 1',
			value: '1',
			checked: true
		});
		alert.addInput({
			type: 'radio',
			label: 'Camara 2',
			value: '2',
			checked: false
		});
		
		alert.addButton('Cancelar');
		alert.addButton({
		text: 'Aceptar',
		handler: data => {
			console.log(data);
		}
		});
		alert.present();
	}

	pressUp(){}
	pressDown(){}
	pressLeft(){}
	pressRight(){}
	pressZoom(){console.log("1");}
	pressWide(){console.log("3");}
	dontpress(){console.log("2");}

	ionViewDidLoad() {
		let url = "htp://cdnapi.kaltura.com/p/1878761/sp/187876100/playManifest/entryId/1_usagz19w/flavorIds/1_5spqkazq,1_nslowvhp,1_boih5aji,1_qahc37ag/format/applehttp/protocol/http/a.m3u8";
		/* this.mplayer.loadMedia({"url":url,
								"Title":"Test","id":"myMediaDiv1"},true);
		this.mplayer.loadMedia({"url":url,
								"Title":"Test","id":"myMediaDiv2"},true);
		this.mplayer.loadMedia({"url":url,
								"Title":"Test","id":"myMediaDiv3"},true);
		this.mplayer.loadMedia({"url":url,
								"Title":"Test","id":"myMediaDiv4"},true); */
	}
	someAction(){
		console.log("dale");
	}

	camSelect(id=1){
		if (this.selected == id) id = null;
		this.selected = id;
		console.log(this.selected);
	}

	camResize(id=1){
		this.columnaCamera = (this.columnaCamera == 'col6')?'col12':'col6';
		this.visible = id;
	}
	/*someAction(){
		if(this.activeButton) return true;
		if (this.timeStart == 0) this.timeStart = new Date().getTime();
		this.count ++;
		if (this.count > 5 && this.timeResult != 0){
			let newColor = this.getTintedColor(this.buttonColor, 30);
			this.buttonColor = newColor;
			const toast = this.toastCtrl.create({
		      message: 'Esta a '+(11-this.count)+' intentos de activar la alarma',
		      duration: 500
		    });
		    toast.present();
			if(this.count > 10 && this.timeResult !=0){
				this.activeButton = true;
			}
		}else{
			this.buttonClass = "example2";
		}
		let end = new Date().getTime();
		this.timeResult = end - this.timeStart;
		console.log("start: "+this.timeStart+"  end: "+end+"    Result: "+this.timeResult);
		if (this.timeResult > 3000){
			this.timeStart = 0;
			this.timeResult = 0;
			this.count = 0;
			this.buttonClass = "example2";
		}
	}

	getTintedColor(color, v) {
		if (color.length >6) { color= color.substring(1,color.length)}
		let rgb = parseInt(color, 16); 
		let r = Math.abs(((rgb >> 16) & 0xFF)-v); if (r>255) r=r-(r-255);
		let g = Math.abs(((rgb >> 8) & 0xFF)-v); if (g>255) g=g-(g-255);
		let b = Math.abs((rgb & 0xFF)-v); if (b>255) b=b-(b-255);

		let rStr = Number(r < 0 || isNaN(r)) ? '0' : ((r > 255) ? 255 : r).toString(16); if (rStr.length == 1) rStr = '0' + rStr;
		let gStr = Number(g < 0 || isNaN(g)) ? '0' : ((g > 255) ? 255 : g).toString(16); if (gStr.length == 1) gStr = '0' + gStr;
		let bStr = Number(b < 0 || isNaN(b)) ? '0' : ((b > 255) ? 255 : b).toString(16); if (bStr.length == 1) bStr = '0' + bStr;
		return "#" + rStr + gStr + bStr;
	} */

}
