import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { Camera, CameraOptions } from '@ionic-native/camera';
/*
  Generated class for the ImageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ImageProvider {
  currentUser: any;
  cameraImage: string;

  constructor(public _CAMERA: Camera) {
    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);
  }

  selectImage(): Promise<any> {
    return new Promise(resolve => {
      let cameraOptions: CameraOptions = {
        sourceType: this._CAMERA.PictureSourceType.PHOTOLIBRARY,
        destinationType: this._CAMERA.DestinationType.DATA_URL,
        quality: 100,
        encodingType: this._CAMERA.EncodingType.JPEG,
        correctOrientation: true
      };

      this._CAMERA.getPicture(cameraOptions)
        .then((data) => {
          this.cameraImage = "data:image/jpeg;base64," + data;
          resolve(this.cameraImage);
        });


    });
  }

  takeImage(): Promise<any> {
    return new Promise(resolve => {
      let cameraOptions: CameraOptions = {
        sourceType: this._CAMERA.PictureSourceType.CAMERA,
        destinationType: this._CAMERA.DestinationType.DATA_URL,
        quality: 100,
        encodingType: this._CAMERA.EncodingType.JPEG,
        saveToPhotoAlbum: true,
      };

      this._CAMERA.getPicture(cameraOptions)
        .then((data) => {
          this.cameraImage = "data:image/jpeg;base64," + data;
          resolve(this.cameraImage);
        });
    });
  }

  uploadImage(imageString): Promise<any> {
    let image: string = 'movie-' + new Date().getTime() + '.jpg',
      storageRef: any,
      parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('posters/' + image);
      parseUpload = storageRef.putString(imageString, 'data_url');

      parseUpload.on('state_changed', (_snapshot) => {
      },
        (_err) => {
          reject(_err);
        },
        (success) => {
          resolve(parseUpload.snapshot);
        });
    });
  }
  uploadPhotoFromFile(_imageData, _progress) {


    return new Observable(observer => {
      var _time = new Date().getTime()
      var fileRef = firebase.storage().ref('images/sample-' + _time + '.jpg')
      var uploadTask = fileRef.put(_imageData['blob']);

      uploadTask.on('state_changed', function (snapshot) {
        console.log('state_changed', snapshot);
        _progress && _progress(snapshot)
      }, function (error) {
        console.log(JSON.stringify(error));
        observer.error(error)
      }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        var downloadURL = uploadTask.snapshot.downloadURL;

        // Metadata now contains the metadata for file
        fileRef.getMetadata().then(function (_metadata) {

          // save a reference to the image for listing purposes
          var ref = firebase.database().ref('user/'+this.currentUser);
          ref.update({
            'imageURL': downloadURL,

          });
          observer.next(uploadTask)
        }).catch(function (error) {
          // Uh-oh, an error occurred!
          observer.error(error)
        });

      });
    });
  }
}
