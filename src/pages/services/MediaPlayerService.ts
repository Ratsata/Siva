import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

declare var jwplayer: any;

@Injectable()
export class MediaPlayerService 
{
  constructor() {}

  loadMedia(media, isAutoPlay) 
  {
    console.log("Called");
    console.log(media.Title,media.id,media.url);

    var cfg = {
      "autostart": true,
      "controls" : true,
      "playbackRateControls" : true,
      //"file":  "http://192.168.0.117:8080/hls/stream.m3u8",
      "file" : media.url,
      //"file":  "http://cdnapi.kaltura.com/p/1878761/sp/187876100/playManifest/entryId/1_usagz19w/flavorIds/1_5spqkazq,1_nslowvhp,1_boih5aji,1_qahc37ag/format/applehttp/protocol/http/a.m3u8",
      //"image": "https://thumb1.shutterstock.com/display_pic_with_logo/1026019/113930149/stock-photo-online-and-internet-concept-present-by-green-internet-url-arrow-around-the-blue-world-isolated-on-113930149.jpg",
      /* "primary":"html5", */
      //"aspectratio":"4:3",
      "width":"100%",
      "height":"100%",
      /* "advertising": {
                    "client": 'googima',
                    "tag": 'https://pubads.g.doubleclick.net/gampad/ads?sz=918x516&iu=/178490712/JWPLAYER&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]'
                 } */
    };

    return Promise.resolve(
      jwplayer(media.id).setup(cfg)).then(
        playerInstance => {
          if (isAutoPlay) {
            setTimeout(() => {
              return playerInstance.play();
            }, 10);
          }
        }
      );
    }
}