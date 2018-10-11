import { Component, ViewChild } from '@angular/core';

declare var Peer: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  @ViewChild('myvideo') myVideo: any;
  @ViewChild('videoElement') videoElement: any;
  ownVideo: any;
  peer;
  anotherid;
  mypeerid;

  constructor() {
  }

  ngOnInit() {
    this.ownVideo = this.videoElement.nativeElement;
    //this.start()
    let video = this.videoElement.nativeElement;
    this.peer = new Peer();
    setTimeout(() => {
      this.mypeerid = this.peer.id;
    }, 3000);

    this.peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        console.log(data);
      });
    });

    var n = <any>navigator;

    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

    this.peer.on('call', function (call) {

      n.getUserMedia({ video: true, audio: true }, function (stream) {
        call.answer(stream);
        call.on('stream', function (remotestream) {
          console.log("answerd");
          console.log(remotestream);
          video.src = URL.createObjectURL(remotestream);
          video.play();
        })
      }, function (err) {
        console.log('Failed to get stream', err);
      })
    })

  }

  connect() {
    var conn = this.peer.connect(this.anotherid);
    conn.on('open', function () {
      conn.send('Message from that id');
    });
  }

  start() {
    this.initCamera({ video: true, audio: false });
  }

  initCamera(config:any) {
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.ownVideo.src = window.URL.createObjectURL(stream);
      this.ownVideo.play();
    });
  }
  videoconnect() {
    let video = this.myVideo.nativeElement;
    var localvar = this.peer;
    var fname = this.anotherid;

    var n = <any>navigator;

    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

    n.getUserMedia({ video: true, audio: true }, function (stream) {
      var call = localvar.call(fname, stream);
      call.on('stream', function (remotestream) {
        console.log(video);
        video.src = URL.createObjectURL(remotestream);
        video.play();
      })
    }, function (err) {
      console.log('Failed to get stream', err);
    })
  }
}
