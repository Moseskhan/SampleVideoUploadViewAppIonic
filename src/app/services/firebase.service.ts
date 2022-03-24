import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MediaFile } from '@awesome-cordova-plugins/media-capture';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
 result:any;
  constructor(private storage: AngularFireStorage) { }

  pushFileToStorage(blob: Blob, fileName: string) {
    let storageRef = this.storage.storage.ref();
    let firebaseFileUrl = `uploads-test`;
    let uploadTask = storageRef.child(firebaseFileUrl).put(blob);
    return uploadTask.snapshot.ref.getDownloadURL()

  }


}
