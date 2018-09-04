# Readme - SIVA


## Sistema

El sistema principal consta de una aplicación Mobile para la administración de cámaras IP, visualización en tiempo real, paneo, envió de audio, entre otros.
Se apoya de un servidor RestAPI desarrollado en PHP alojado en una Raspberry Pi, la cual también sirve como conversor de video del protocolo RTSP A HLS para la posterior visualización de esta.

## Ciclo de Vida

### Raspberry Pi
La cámara IP es conectada vía ethernet a la Raspberry, quien se encarga de convertir el video transmitido de RTSP a HLS y distribuirla a través de una IP en RTMP.
Se pueden activar alarmas y reproducir sonidos a través de un servidor RestAPI, quien está a la escucha y responde ejecutando scripts de manera local en la Raspberry PI (reproduciendo sonidos y activando relés). Los scripts son escritos en Python y Shell Scripts, se utilizan los puertos GPIO para manejar el Relé y el programa Mplayer junto cVlc para la reproducción de sonidos.
Cuando la cámara detecta un movimiento envía un correo electrónico. La Raspberry Pi se encarga de estar a la espera del correo, al recibirlo a través de un Daemon(GetMail) corriendo en el background le envía como Notificación Push hacia la App.

### App Mobile
La aplicación Mobile permite el manejo de cámaras, dando la posibilidad de agregarlas manualmente (IP) o vía código QR, las cámaras son registradas en una base de datos local en la aplicación (SQLite) una vez agregada se puede visualizar con el plugin jwplayer que es el repductor capaz de reproducir RTMP.
Se puede enviar audios a todas las cámaras como también a una en específico presionando el botón de grabar. también permite el paneo de una cámara.

## Dispositivos

### Camara
*IP:* `192.168.1.108`
*User:* `admin`
*Pass:* `cleanvoltage2018`

### Raspberry Pi
*IP:* `192.168.0.192`
*User:* `pi`
*Pass:* `toor`

## Nota
Se edito el siguiente archivo para la funcionalidad de FCM
> plugins/cordova-plugin-fcm/scripts/fcm_config_files_process.js

 

    // Cambiar
    var strings = fs.readFileSync("platforms/android/res/values/strings.xml").toString();
    // a
    var strings = fs.readFileSync("platforms/android/app/src/main/res/values/strings.xml").toString();
        
    //Cambiar
    fs.writeFileSync("platforms/android/res/values/strings.xml", strings);
    //a
    fs.writeFileSync("platforms/android/app/src/main/res/values/strings.xml", strings);

*Agregar siguientes Rutas*
> -   platforms/android/google-services.json
> -   platforms/android/app/google-services.json

##Notas Raspberry Pi

###Programas
**ffmpeg**: Encargado de la conversion de RTSP a RTMP
**Nginx**: Servidor que aloja el streaming RTMP
**LAMP**:  Servidor Rest-API escrito en php
**Python 2.7**: Lenguaje para ejecutar las tareas programadas
**cVlc**: Reproduccion de alarmas
**mplayer**: Reproduccion de audios

###Rutas
    /var/www/html/upload/assets : Programas a ejecutar
	/home/pi/launcher.sh : Script que se lanza al iniciar' 

###Otras
**Red**: 
>Wifi Estatica
>Ethernet Estatico Default 192.168.1.1

**Conversion RTMP**:

    ffmpeg -rtsp_transport tcp -re -i "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov" -s 640x480 -vcodec libx264 -vprofile baseline -acodec aac -strict -2 -f flv rtmp://localhost/show/stream