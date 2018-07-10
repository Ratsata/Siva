import { Component } from '@angular/core';
import { NavController,
		ToastController,
		ModalController,
		AlertController } from 'ionic-angular';
//import { Http, Jsonp } from '@angular/http';
import { MediaPlayerService } from '../services/MediaPlayerService';
import { DataServiceProvider } from '../../providers/data-service/data-service';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { HTTP } from '@ionic-native/http';

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
	private videoActive1 : boolean = false;
	private videoActive2 : boolean = false;
	private videoActive3 : boolean = false;
	private videoActive4 : boolean = false;
	camara: any;

	constructor(public navCtrl: NavController, public toastCtrl: ToastController, public mplayer: MediaPlayerService, public modalCtrl: ModalController,public alertCtrl: AlertController, public DataService: DataServiceProvider,public http: HttpClient, private httpadvance: HTTP) {
		this.camara = [];
		/* this.camara = this.DataService.camara;
		this. */
	}

	listCameras(id,data){
		this.camara = data;

		let alert = this.alertCtrl.create();
		alert.setTitle('Seleccione una camara');
		for (let x = 0; x < this.camara.length; x++) {
			let check = (x==0)?true:false;
			alert.addInput({
				type: 'radio',
				label: this.camara[x].ds_nombre,
				value: x.toString(),
				checked: check
			});
		}
		alert.addButton('Cancelar');
		alert.addButton({
		text: 'Aceptar',
		handler: data => {
			console.log(data);
			if (data){
				if (id==0){
					this.videoActive1 = true;
					this.mplayer.loadMedia({"url":'http://'+this.camara[data].ds_ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv1"},true);
				}else if (id==1){
					this.videoActive2 = true;
					this.mplayer.loadMedia({"url":'http://'+this.camara[data].ds_ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv2"},true);
				}else if (id==2){
					this.videoActive3 = true;
					this.mplayer.loadMedia({"url":'http://'+this.camara[data].ds_ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv3"},true);
				}else if (id==3){
					this.videoActive4 = true;
					this.mplayer.loadMedia({"url":'http://'+this.camara[data].ds_ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv4"},true);
				}
			}
		}
		});
		alert.present();
	}

	getCameras(id) {
		this.DataService.select().then((data) => 
			this.listCameras(id,data)
		);		
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
	

	someAction(){
		let url = 'http://192.168.1.108/cgi-bin/ptz.cgi?action=start&channel=1&code=Right&arg1=0&arg2=3&arg3=0';
		let headers = new HttpHeaders();
		console.log("GET");
		/* this.http.get('https://api.github.com/users/seeschweiler').subscribe(data => {
      		console.log(JSON.stringify(data));
		}); */
		this.httpadvance.get(url, {}, {})
		.then(data => {
			console.log("success");
			console.log(data.status);
			console.log(data.data); // data received by server
			console.log(data.headers);
		})
		.catch(error => {
			let response = error.headers["www-authenticate"];
			response += ', username="admin"';
			console.log(response);

			//'username="admin", uri="/cgi-bin/ptz.cgi?action=start&channel=1&code=Right&arg1=0&arg2=3&arg3=0", algorithm="MD5", nc=00000001, cnonce="FzXaxXzY", response="534233be13e1c1dd8e5f0661bfe884bb"
			Digest realm="Login to 3K00CE2PAJ00081", qop="auth", nonce="322296991", opaque="a2a14c59272e8bf51644424b28a1ea6f1bbe774f"
			/* let httpOptions = {
				headers: new HttpHeaders().set('Authorization',response)
			}; */
			/* this.http.get(url, httpOptions).subscribe(data => {
      			console.log(JSON.stringify(data));
			}); */
			/* console.log(JSON.stringify(error));
			console.log(error.status);
			console.log(error.error); */
			
		});
		console.log("---");
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
