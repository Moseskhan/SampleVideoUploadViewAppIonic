import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MediaFile } from '@awesome-cordova-plugins/media-capture';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  result: any;
  basePath: string = "uploads";
  constructor(private storage: AngularFireStorage) { }

  pushFileToStorage(blob: Blob, fileName: string) {

    const filePath = `${this.basePath}/${fileName}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, blob);

    return uploadTask.snapshotChanges();
  }


}
