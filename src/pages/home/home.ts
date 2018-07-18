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

import {Md5} from 'ts-md5/dist/md5';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';

import { NativeAudio } from '@ionic-native/native-audio';

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
	private buttonActive : boolean = false;
	private toolbarActive : string;
	camara: any;

	recording: boolean = false;
	filePath: string;
	fileName: string;
	audio: MediaObject;
	audioList: any[] = [];

	constructor(public navCtrl: NavController, public toastCtrl: ToastController, public mplayer: MediaPlayerService, public modalCtrl: ModalController,public alertCtrl: AlertController, public DataService: DataServiceProvider,public http: HttpClient, private httpadvance: HTTP, private media: Media, private file: File, private transfer: Transfer, private nativeAudio: NativeAudio) {
		this.camara = [];
		this.toolbarActive = 'mic';
		this.nativeAudio.preloadSimple('uniqueId1', 'assets/sound/rec-sound.wav').then(
			function (e){console.log(JSON.stringify(e))}, function (e){console.log(JSON.stringify(e))});
		/* this.camara = this.DataService.camara;
		this. */
	}

	listCameras(id,json){
		console.log("ID:"+id);
		this.camara = json;
		let alert = this.alertCtrl.create();
		alert.setTitle('Seleccione una camara');
		for (let x = 0; x < this.camara.length; x++) {
			console.log("x:"+x);
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
			if (data){
				if (id==1){
					this.videoActive1 = true;
					this.mplayer.loadMedia({"url":'http://'+this.camara[data].ds_ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv1"},true);
				}else if (id==2){
					this.videoActive2 = true;
					this.mplayer.loadMedia({"url":'http://'+this.camara[data].ds_ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv2"},true);
				}else if (id==3){
					this.videoActive3 = true;
					this.mplayer.loadMedia({"url":'http://'+this.camara[data].ds_ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv3"},true);
				}else if (id==4){
					this.videoActive4 = true;
					this.mplayer.loadMedia({"url":'http://'+this.camara[data].ds_ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv4"},true);
				}
			}
		}
		});
		alert.present();
	}

	getCameras(id) {
		console.log("getcameras:"+id);
		this.DataService.select().then((data) => 
			this.listCameras(id,data)
		);		
	}

	pressUp(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Up&arg1=0&arg2=3&arg3=0');
	}
	pressDown(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Down&arg1=0&arg2=3&arg3=0');
	}
	pressLeft(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Left&arg1=0&arg2=3&arg3=0');
	}
	pressRight(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Right&arg1=0&arg2=3&arg3=0');
	}

	clickUp(){
		console.log("click");
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Position&arg1=0&arg2=-1000&arg3=0');
	}
	clickDown(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Position&arg1=0&arg2=1000&arg3=0');
	}
	clickLeft(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Position&arg1=-1000&arg2=0&arg3=0');
	}
	clickRight(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Position&arg1=1000&arg2=1000&arg3=0');
	}

	pressZoom(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Position&arg1=0&arg2=0&arg3=2');
	}
	pressWide(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=start&channel=1&code=Position&arg1=0&arg2=0&arg3=-2');
	}

	dontpress(){
		this.callHTTP('http://192.168.1.108','/cgi-bin/ptz.cgi?action=stop&channel=1&code=Up&arg1=0&arg2=0&arg3=0');
	}

	ionViewDidLoad() {
		let url = "htp://cdnapi.kaltura.com/p/1878761/sp/187876100/playManifest/entryId/1_usagz19w/flavorIds/1_5spqkazq,1_nslowvhp,1_boih5aji,1_qahc37ag/format/applehttp/protocol/http/a.m3u8";
	}

	camSelect(id=1){
		if (this.selected == id) id = null;
		this.selected = id;
		console.log(this.selected);
	}

	camResize(id=1){
		console.log("ID. :"+id);
		this.columnaCamera = (this.columnaCamera == 'col6')?'col12':'col6';
		this.visible = id;
	}
	
	ionViewWillEnter() {
		/* this.getAudioList(); */
	}

	getAudioList() {
		if(localStorage.getItem("audiolist")) {
			this.audioList = JSON.parse(localStorage.getItem("audiolist"));
			console.log(JSON.stringify(this.audioList));
		}
	}

	toggleClass (){
		this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
		this.buttonActive = !this.buttonActive;
		console.log(this.buttonActive);
	}
	
	startRecord() {
		this.toggleClass();
		//this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';
		this.fileName = 'voiceTemp.mp3';
		this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
		this.audio = this.media.create(this.filePath);
		
		this.audio.startRecord();
		this.recording = true;
		console.log("startRecording");
	}

	stopRecord() {
		if (this.recording){
		this.audio.stopRecord();
		console.log("stopRecording");
		/* let data = { filename: this.fileName };
		this.audioList.push(data);
		localStorage.setItem("audiolist", JSON.stringify(this.audioList)); */
		this.recording = false;
		//this.getAudioList();
		this.sendRecord();
		this.toggleClass();
		}else{
			this.startRecord();
		}
	}

	sendRecord() {
		let url = "http://192.168.1.26/upload/upload.php";
		this.fileName = 'voiceTemp.mp3';
		let targetPath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
 
  		let options = {
    		fileKey: "file",
    		fileName: this.fileName,
    		chunkedMode: false,
    		mimeType: "multipart/form-data",
    		params : {'fileName': this.fileName}
  		};
 
  		const fileTransfer: TransferObject = this.transfer.create();
 
  		/* this.loading = this.loadingCtrl.create({
    		content: 'Uploading...',
  		});
		this.loading.present(); */
		  
  		fileTransfer.upload(targetPath, url, options).then(data => {
			console.log("SUCCESS:"+JSON.stringify(data));
    		/* this.loading.dismissAll()
    		this.presentToast('Image succesful uploaded.'); */
  		}, err => {
			console.log(JSON.stringify(err));
    		/* this.loading.dismissAll()
    		this.presentToast('Error while uploading file.'); */
  		});
	}

	toolbar(data){
		this.toolbarActive = data;
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

	callHTTP(ip,uri){
		this.httpadvance.get(ip+uri, {}, {}).then(data => {
			return true;
		}).catch(error => {
			try{
				let request = error.headers["www-authenticate"].split(",");
				let nonce = request[2].slice(8,request[2].length-1);
				let opaque = request[3].slice(9,request[3].length-1);
				const cnonce = "8RqcCQCC";
				const cn = "00000001";
				const qop = 'auth';

				const HA1 = Md5.hashStr('admin:Login to 3K00CE2PAJ00081:cleanvoltage2018');
				let HA2 = Md5.hashStr('GET:'+uri);
				let response = Md5.hashStr(HA1+':'+nonce+':'+cn+':'+cnonce+':'+qop+':'+HA2);
				
				request = 'Digest username="admin", realm="Login to 3K00CE2PAJ00081", nonce="'+nonce+'", uri="'+uri+'", algorithm="MD5", qop=auth, nc=00000001, cnonce="'+cnonce+'", response="'+response+'", opaque="'+opaque+'"';
				let headers = {
					'Authorization': request
				};
				this.httpadvance.get(ip+uri, {}, headers).then(data => {
					return true;
				}).catch(error => {
					console.log(JSON.stringify(error));
				});
			}catch (e){
				return ;
			}
		});
	}

}
