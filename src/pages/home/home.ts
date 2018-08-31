import { Component } from '@angular/core';
import { NavController,
		ModalController,
		AlertController, 
		LoadingController} from 'ionic-angular';

import { MediaPlayerService } from '../services/MediaPlayerService';
import { DataServiceProvider } from '../../providers/data-service/data-service';

import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http';

import {Md5} from 'ts-md5/dist/md5';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';

import { NativeAudio } from '@ionic-native/native-audio';
import { Toast } from '@ionic-native/toast';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

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
	dashboard: any;
	recording: boolean = false;
	filePath: string;
	fileName: string;
	audio: MediaObject;
	audioList: any[] = [];
	dataSel: any = "del";
	conexion: number;
	enLinea: number;

	/* Translate */
	textTitleAlert: string = "";
	textCancel: string = "";
	textAccept: string = "";
	textConnect: string = "";
	textOffline: string = "";
	textOffline2: string = "";
	textRemove: string = "";
	textDelete: string = "";
	textRemoveTitle: string = "";

	constructor(public navCtrl: NavController, public toast: Toast, public mplayer: MediaPlayerService, public modalCtrl: ModalController,public alertCtrl: AlertController, public DataService: DataServiceProvider,public http: HttpClient, private httpadvance: HTTP, private media: Media, private file: File, private transfer: Transfer, private nativeAudio: NativeAudio, public loadingCtrl: LoadingController, private translateService: TranslateService) {
		this.initTranslate();
		this.camara = [];
		this.dashboard = [];
		this.toolbarActive = 'mic';
		this.conexion = 0;
		this.enLinea = 0;
		this.nativeAudio.preloadSimple('uniqueId1', 'assets/sound/rec-sound.wav').then(function (e){
			console.log(JSON.stringify(e));
		}, function (e){
			console.log(JSON.stringify(e));
		});
	}

	ionViewDidEnter() {
		this.conexion = 0;
		this.enLinea = 0;
		this.DataService.selectDashboard().then(data_dashboard => {
			this.dashboard = data_dashboard;
			this.DataService.selectCamaras().then((data_camara) =>{
				this.camara = data_camara;
				
				for (let x = 0; x < this.dashboard.length; x++) {
					for (let i = 0; i < this.camara.length; i++) {
						if(this.dashboard[x].id_camara == this.camara[i].id_camara){
							this.conexion ++;
							this.assignCameras(this.dashboard[x].id_cuadro,i);
						}
					}
				}
			});
		})
	}

	initTranslate(){
		this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
			this.translateService.get('LABEL_TITLE_ALERT').subscribe(value => {
				this.textTitleAlert = value;
			});
			this.translateService.get('CANCEL_BUTTON_TEXT').subscribe(value => {
				this.textCancel = value;
			});
			this.translateService.get('DONE_BUTTON_TEXT').subscribe(value => {
				this.textAccept = value;
			});
			this.translateService.get('LABEL_CONNECT').subscribe(value => {
				this.textConnect = value;
			});
			this.translateService.get('LABEL_OFFLINE').subscribe(value => {
				this.textOffline = value;
			});
			this.translateService.get('LABEL_OFFLINE2').subscribe(value => {
				this.textOffline2 = value;
			});
			this.translateService.get('LABEL_REMOVE_CAMERA_TITLE').subscribe(value => {
				this.textRemoveTitle = value;
			});
			this.translateService.get('LABEL_REMOVE_CAMERA').subscribe(value => {
				this.textRemove = value;
			});
			this.translateService.get('DELETE_BUTTON_TEXT').subscribe(value => {
				this.textDelete = value;
			});
		});
	}

	alertCameras(id){
		let alert = this.alertCtrl.create();
		alert.setTitle(this.textTitleAlert);
		for (let x = 0; x < this.camara.length; x++) {
			let check = (x==0)?true:false;
			alert.addInput({
				type: 'radio',
				label: this.camara[x].ds_nombre,
				value: x.toString(),
				checked: check
			});
		}
		alert.addButton(this.textCancel);
		alert.addButton({
			text: this.textAccept,
			handler: data => {
				this.DataService.insertDashboard(id, this.camara[data].id_camara)
					.then(res => console.log(JSON.stringify(res)));
				this.assignCameras(id,data);
			}
		});
		alert.present();
	}

	assignCameras(id_cuadro,index_cam){
		let ip = null;
		if (index_cam!=null){
			const loader = this.loadingCtrl.create({
				spinner: "dots",
				content: this.textConnect
			});
			loader.present();
			this.ping(this.camara[index_cam].ds_ip,2).then((res) =>{
				if(res["status"]=="nok"){
					this.ping(this.camara[index_cam].ds_ipDynamic,2).then((res) =>{
						if(res["status"]=="nok"){
							this.toast.showLongBottom(this.textOffline+this.camara[index_cam].ds_nombre+this.textOffline2).subscribe(
								toast => { console.log("ERROR IP"); loader.dismiss();}
							);
						}else{
							ip = res["ip"];
							console.log("ipDynamic: "+ip);
							this.enLinea++;
						}
						loader.dismiss();
					});
				}else{
					ip = res["ip"];
					console.log("ip: "+ip);
					loader.dismiss();
					this.enLinea++;
				}
			});
			if (id_cuadro==1){
				this.videoActive1 = true;
				this.mplayer.loadMedia({"url":ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv1"},true);
			}else if (id_cuadro==2){
				this.videoActive2 = true;
				this.mplayer.loadMedia({"url":ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv2"},true);
			}else if (id_cuadro==3){
				this.videoActive3 = true;
				this.mplayer.loadMedia({"url":ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv3"},true);
			}else if (id_cuadro==4){
				this.videoActive4 = true;
				this.mplayer.loadMedia({"url":ip+':8080/hls/stream.m3u8',"Title":"Test","id":"myMediaDiv4"},true);
			}
		}
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
	}

	camResize(id=1){
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
		let url = "http://192.168.0.142/upload/upload.php?action=voice";
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

	deleteButtonToolbar(){
		const confirm = this.alertCtrl.create({
			title: this.textRemoveTitle,
			message: this.textRemove,
			buttons: [{
				text: this.textCancel,
				handler: () => {
					return;
				}
			},{
				text: this.textDelete,
				handler: () => {
					this.DataService.deleteDashboard(this.visible)
						.then(res => console.log(res));
					document.getElementById("myMediaDiv"+this.visible).innerHTML = "";
					this.camResize(this.visible);
					switch (this.visible) {
						case 1:
							this.videoActive1 = !this.videoActive1;
							break;
						case 2:
							this.videoActive2 = !this.videoActive2;
							break;
						case 3:
							this.videoActive3 = !this.videoActive3;
							break;
						case 4:
							this.videoActive4 = !this.videoActive4;
							break;
					}
				}
			}]
		});
		confirm.present();
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

	ping(url,tiempo = 5){
		return new Promise((resolve, reject) => {
			if (url != null){
				if (url.substring(0, 4) != "http") url = "http://"+url;
				this.httpadvance.setRequestTimeout(tiempo);
				this.httpadvance.get(url, {}, {}).then(data => {
					resolve ({"ip":url,"status":"ok"});
				}).catch(error => {
					resolve ({"ip":url,"status":"nok"});
				});
			}else{
				resolve ({"ip":url,"status":"nok"});
			}
		});
	}

}
