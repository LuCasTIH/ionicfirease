
import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { EditprofilePage } from '../editprofile/editprofile';
import { Camera } from '@ionic-native/camera';
import { Device } from "@ionic-native/device";
import { ImageProvider } from "../../providers/image/image";
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from "@ionic-native/file-path";

import { NgZone } from '@angular/core';
import { Toast } from '@ionic-native/toast';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  images: {};
  nativepath: any;
  userimg: any;
  progress: number = 0
  captureDataUrl: any;

  userProfile = {
    name: '',
    password: '',
    phonenumber: '',
    cmnd: '',
    email: '',
    url: null
  };

  currentUser: any;
  firestore = firebase.storage();
  users: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController, public camera: Camera, public device: Device, public platform: Platform, public img: ImageProvider
    , public filechooser: FileChooser, public filepath: FilePath, public ngZone: NgZone, public toast: Toast) {

    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);
    this.users = this.af.database.list('user');

  }




  ionViewDidEnter() {
    var ref = firebase.database().ref("user/" + this.currentUser);
    ref.once("value", (snapshot) => {
      var user = snapshot.val();

      this.userProfile.email = user.email;
      this.userProfile.password = user._password;
      this.userProfile.phonenumber = user.phonenumber;
      this.userProfile.name = user.name;
      this.userProfile.url = user.url;

      return false;

    });

  }

  editprofile() {
    this.navCtrl.push(EditprofilePage)
  }

  changepassword() {
    let mkc = this.alertCtrl.create({
      subTitle: 'Mật khẩu cũ không đúng',
      buttons: [{
        text: "Ok",
        role: 'cancel'
      }]
    });
    let dmktc = this.alertCtrl.create({
      subTitle: 'Đổi mật khẩu thành công',
      buttons: [{
        text: "Ok",
        role: 'cancel'
      }]
    });

    let mkm = this.alertCtrl.create({
      subTitle: 'Mật khẩu mới không trùng khớp',
      buttons: [{
        text: "Ok",
        role: 'cancel'
      }]
    });
    let prompt = this.alertCtrl.create({
      subTitle: 'Đổi mật khẩu',

      inputs: [
        {
          name: 'oldpassword',
          type: 'password',
          placeholder: 'Mật khẩu cũ',

        },
        {
          name: 'newpassword',
          type: 'password',
          placeholder: 'Mật khẩu mới',
        },
        {
          name: 'repassword',
          type: 'password',
          placeholder: 'Nhập lại mật khẩu mới',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: data => {

            if (data.oldpassword == this.userProfile.password) {
              if (data.newpassword == data.repassword) {
                this.users.update(this.currentUser, {
                  _password: data.newpassword
                }).then(present => {
                  dmktc.present();
                });
              }
              else {
                mkm.present();
              }
            }
            else {
              mkc.present();
            }

          }

        }]
    });
    prompt.present();

  }
  /*
    makeFileIntoBlob(_imagePath) {
  
      return new Promise((resolve, reject) => {
        (<any>window).resolveLocalFileSystemURL(_imagePath, (fileEntry) => {
  
          fileEntry.file((resFile) => {
  
            var reader = new FileReader();
            reader.readAsArrayBuffer(resFile);
            reader.onloadend = (evt: any) => {
              var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            
              resolve(imgBlob);
            };
  
            reader.onerror = (e) => {
              console.log('Failed file read: ' + e.toString());
              reject(e);
            };
  
  
          });
        });
      });
  
    }
  
    uploadToFirebase(_imageBlob) {
      var fileName = this.currentUser + '.jpg';
  
      return new Promise((resolve, reject) => {
        var fileRef = firebase.storage().ref(fileName);
  
        var uploadTask = fileRef.put(_imageBlob);
  
        uploadTask.on('state_changed', (_snapshot) => {
          console.log('snapshot progess ' + _snapshot);
        }, (_error) => {
          reject(_error);
        }, () => {
          // completion...
          resolve(uploadTask.snapshot);
        });
      });
    }
  
    saveToDatabaseAssetList(_uploadSnapshot) {
      var ref = firebase.database().ref('user/' + this.currentUser);
  
      return new Promise((resolve, reject) => {
  
        // we will save meta data of image in database
        var dataToSave = {
          'URL': _uploadSnapshot.downloadURL, // url to access file
          'lastUpdated': new Date().getTime(),
        };
  
        ref.update(dataToSave, (_response) => {
          resolve(_response);
        }).catch((_error) => {
          reject(_error);
        });
      });
  
    }
  
    getpic() {
  
      let imageSource = (this.device.isVirtual ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.PHOTOLIBRARY);
  
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: imageSource,
        targetHeight: 640,
        correctOrientation: true
      }).then((_imagePath) => {
        alert('got image path ' + _imagePath);
        // convert picture to blob
        return this.makeFileIntoBlob(_imagePath);
      }).then((_imageBlob) => {
        alert('got image blob ' + _imageBlob);
  
        // upload the blob
        return this.uploadToFirebase(_imageBlob);
      }).then((_uploadSnapshot: any) => {
        alert('file uploaded successfully  ' + _uploadSnapshot.downloadURL);
  
        // store reference to storage in database
        return this.saveToDatabaseAssetList(_uploadSnapshot);
  
      }).then((_uploadSnapshot: any) => {
        alert('file saved to asset catalog successfully  ');
      }, (_error) => {
        alert('Error ' + (_error.message || _error));
      });
  
    }
    */
  _pictureUploadProgress = (_progress): void => {
    this.ngZone.run(() => {
      console.log("_pictureUploadProgress", _progress)
      this.progress = Math.round((_progress.bytesTransferred / _progress.totalBytes) * 100);
      if (this.progress === 100) {
        setTimeout(() => { this.progress = 0 }, 500);
      }
    })
  }

  getpic() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    }).then((imageData) => {
      // imageData is a file path

      // get the path correct for android devices
      if (this.platform.is("android")) {
        imageData = "file://" + imageData
      }

      (<any>window).resolveLocalFileSystemURL(imageData, (fileEntry) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {

            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = 'sample.jpg';

            this.images['blob'] = imgBlob;

            this.img.uploadPhotoFromFile(this.images, this._pictureUploadProgress)
              .subscribe((data) => {
                console.log(data)

                this.toast.show("File Uploaded Successfully", "1000", "center").subscribe(
                  toast => {
                    console.log(toast);
                  }
                );
              },
              (error) => {
                console.log(error)
                this.toast.show("File Error" + error, "5000", "center").subscribe(
                  toast => {
                    console.log(toast);
                  }
                );
              },
              () => { });
          };
          reader.onerror = (e) => {
            console.log("Failed file read: " + e.toString());
          };
          reader.readAsArrayBuffer(resFile);

        });
      }, (err) => {
        console.log(err);
        alert(JSON.stringify(err))
      });

    }, (err) => {
      console.log("resolveLocalFileSystemURL", err);
      alert(JSON.stringify(err))
    });
  }



}







