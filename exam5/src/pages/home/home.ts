
import { Component } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
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


  userProfile = {
    name: '',
    password: '',
    phonenumber: '',
    cmnd: '',
    email: '',
    squestion: '',
    url: null
  };

  currentUser: any;
  firestore = firebase.storage();
  users: FirebaseListObservable<any>;
  loader = this.loadingCtrl.create({
    content: "Xin chờ 1 lát...",
    duration: 3000
  });
  constructor(public navCtrl: NavController, public af: AngularFire, public alertCtrl: AlertController, 
  public camera: Camera, public device: Device, public platform: Platform, public loadingCtrl: LoadingController) {
    
    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);
    this.users = this.af.database.list('user');
  }

  ionViewDidEnter() {
    firebase.database().ref("user/" + this.currentUser)
      .once("value", (snapshot) => {
        var user = snapshot.val();
        this.userProfile.email = user.email;
        this.userProfile.password = user._password;
        this.userProfile.phonenumber = user.phonenumber;
        this.userProfile.name = user.name;
        this.userProfile.url = user.url;
        this.userProfile.squestion = user.squestion;
        return false;
      });


  }

  gotoeditprofile() {
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
            alert('Failed file read: ' + e.toString());
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

  saveToDatabase(_uploadSnapshot) {
    var ref = firebase.database().ref('user/' + this.currentUser);

    return new Promise((resolve, reject) => {


      var dataToSave = {
        'url': _uploadSnapshot.downloadURL,

      };

      ref.update(dataToSave, (_response) => {
        resolve(_response);
      }).catch((_error) => {
        reject(_error);
      });
    });

  }

  getpic() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 100,
      correctOrientation: true
    }).then((_imagePath) => {
      this.loader.present();
      return this.makeFileIntoBlob(_imagePath);
    }).then((_imageBlob) => {


      // upload the blob
      return this.uploadToFirebase(_imageBlob);
    }).then((_uploadSnapshot: any) => {


      // store reference to storage in database
      return this.saveToDatabase(_uploadSnapshot);

    }).then((_uploadSnapshot: any) => {
      this.loader.dismiss();
    }, (_error) => {
      alert('Error ' + (_error.message || _error));
    });

  }



}







