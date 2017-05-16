
import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { EditprofilePage } from '../editprofile/editprofile';
import { Camera } from '@ionic-native/camera';
import { Device } from "@ionic-native/device";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  captureDataUrl: any;

  userProfile = {
    name: '',
    password: '',
    phonenumber: '',
    cmnd: '',
    email: '',
  };

  currentUser: any;

  users: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController, public camera: Camera, public device: Device, public platform: Platform) {

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

  makeFileIntoBlob(_imagePath) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
  
      return new Promise((resolve, reject) => {
        (<any>window).resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

          fileEntry.file((resFile) => {

            var reader = new FileReader();
            reader.onloadend = (evt: any) => {
              var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
              imgBlob.name = 'sample.jpg';
              resolve(imgBlob);
            };

            reader.onerror = (e) => {
              console.log('Failed file read: ' + e.toString());
              reject(e);
            };

            reader.readAsArrayBuffer(resFile);
          });
        });
      });
   
  }

  uploadToFirebase(_imageBlob) {
    var fileName = 'sample-' + new Date().getTime() + '.jpg';

    return new Promise((resolve, reject) => {
      var fileRef = firebase.storage().ref('images/' + fileName);

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




}







