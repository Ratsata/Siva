import { Component } from '@angular/core';
import { NavController,
		ToastController,
		ModalController,
		AlertController } from 'ionic-angular';
import { MediaPlayerService } from '../services/MediaPlayerService';
import { DataServiceProvider } from '../../providers/data-service/data-service';

import { HttpClient } from '@angular/common/http';
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
	
	private columnaCamera : string  = 'col6';
	private selected : number = 1;
	private buttonActive : boolean = false;
	visible : number = 1;
	videoActive1 : boolean = false;
	videoActive2 : boolean = false;
	videoActive3 : boolean = false;
	videoActive4 : boolean = false;
	toolbarActive : string;
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
		this.recording = false;
		this.sendRecord();
		this.toggleClass();
		}else{
			this.startRecord();
		}
	}

	sendRecord() {
		let url = "http://192.168.0.192/upload/upload.php?action=voice";
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
		  
  		fileTransfer.upload(targetPath, url, options).then(data => {
			console.log("SUCCESS:"+JSON.stringify(data));
  		}, err => {
			console.log(JSON.stringify(err));
  		});
	}

	toolbar(data){
		this.toolbarActive = data;
	}

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
