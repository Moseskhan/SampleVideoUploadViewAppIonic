import { Component } from '@angular/core';
import { AnyForUntypedForms } from '@angular/forms';
import { CameraOptions } from '@awesome-cordova-plugins/camera';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Entry } from '@awesome-cordova-plugins/file';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { CaptureVideoOptions, MediaFile } from '@awesome-cordova-plugins/media-capture';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  captureVideoOptions: CaptureVideoOptions = {
    limit: 1
  }
  capturedVideo: AnyForUntypedForms;
  constructor(private mediaCapture: MediaCapture,
    private camera: Camera,
    private file: File,
    private webview: WebView,
    private FilePath: FilePath,
    private firebaseService: FirebaseService) { }


  takeVideo() {
    this.mediaCapture.captureVideo(this.captureVideoOptions).then(
      (x: any) => {
        console.log(x);
        x.forEach(element => {
          console.log(element.fullPath);
          console.log(element.name);
          console.log(element.type);
          console.log(element.lastModifiedDate);
          this.resolveFilePath(element);
        });

      },
      error => {
        alert(JSON.stringify(error));
        console.log(error);
      });
  }

  takeFrmCameraPL() {
    let options: CameraOptions = {
      mediaType: 1,
      destinationType: 0,
      sourceType: 1
    }
    this.camera.getPicture(options).then(
      (x) => {
        this.resolveFilePath(x);

      },
      error => {
        alert(JSON.stringify(error));
        console.log(error);
      }
    );
  }

  resolveFilePath(file: MediaFile) {
    
    this.FilePath.resolveNativePath(file.fullPath).then(
      (x) => {
        this.readBinaryFile(x, file.name, file.type);
      });
  }

  readBinaryFile(normalizedFilePath: string, name: string, type: string) {

    let directoryPath=this.getDirectoryPath(normalizedFilePath);
    console.log("directory Path"+directoryPath);

    this.file.readAsArrayBuffer(directoryPath, name).then((x) => {
      console.log("read array" + x);
      var blob = new Blob([new Uint8Array(x)], { type: type });
      document.querySelector('#myVideo').setAttribute("src",  URL.createObjectURL(blob));
      console.log(blob);
      this.firebaseService.pushFileToStorage(blob, name).then(x=>{
        console.log("Firebase url: ", x);
      });
    },
      error => {
        console.log("binary error" + JSON.stringify(error));
      });

  }

  getDirectoryPath(path: string){
    let directory = path.split("/");
    directory.splice((directory.length - 1));
    let directoryPath = directory.join("/");
    return directoryPath;
  }



}
