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
import { Platform } from '@ionic/angular';
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
    private platform: Platform,
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
    
    if(this.platform.is("android")){
      this.FilePath.resolveNativePath(file.fullPath).then(
        (x) => {
          this.readBinaryFile(x, file.name, file.type);
        });
    }else{
      const path=this.transformIosFilePath(file.fullPath);
      this.readBinaryFile(path, file.name, file.type);
    }
    
  }

  transformIosFilePath(path: string){
    // /private/var/mobile/Containers/Data/Application/F2C86164-CD9D-4685-BE28-47B413AA0284/tmp/66984430706__9EC1E055-9A92-456D-A919-F9807375ACB9.MOV
    if(path.includes("/private/")){
      path=path.replace("/private/", "file:///");
    }
    return path;

  }

  readBinaryFile(normalizedFilePath: string, name: string, type: string) {

    let directoryPath=this.getDirectoryPath(normalizedFilePath);
    console.log("directory Path"+directoryPath);

    this.file.readAsArrayBuffer(directoryPath, name).then((x) => {
      console.log("read array" + x);
      var blob = new Blob([new Uint8Array(x)], { type: type });
      document.querySelector('#myVideo').setAttribute("src",  URL.createObjectURL(blob));
      console.log(blob);
      this.firebaseService.pushFileToStorage(blob, name).subscribe(x=>{
        x.ref.getDownloadURL().then((k)=>{
          console.log("Firebase url: ", k);
        });
        
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
