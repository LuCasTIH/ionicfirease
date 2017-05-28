import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Camera } from "@ionic-native/camera";
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';
import { TabsPage } from "../tabs/tabs";
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  imgb64: string;
  photodisplay: any = [];
  currentUser: any;
  photos: any = [];
  vehicles: FirebaseListObservable<any>;

  loader = this.loadingCtrl.create({
    content: "Xin chờ 1 lát...",
    duration: 3000
  });
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public af: AngularFire, public camera: Camera, public actionSheetCtrl: ActionSheetController, public geolocation: Geolocation,
    public loadingCtrl: LoadingController) {
    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);
    this.vehicles = af.database.list('user/' + this.currentUser + '/transport');

  }





  deletePhoto(index) {

    let confirm = this
      .alertCtrl
      .create({
        title: 'Bạn có chắc muốn xóa không?',
        message: '',
        buttons: [
          {
            text: 'Không',
            handler: () => {
              console.log('Cancel');
            }
          }, {
            text: 'Xóa',
            handler: () => {
              this.photos.splice(index, 1);
              this.photodisplay.splice(index, 1);
              console.log('deleted');
            }
          }
        ]
      });
    confirm.present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Thêm ảnh',
      buttons: [
        {
          text: 'Máy ảnh',
          handler: () => {
            this.takePicture();
          }
        }, {
          text: 'Thư mục',
          handler: () => {
            this.grabPicture();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    actionSheet.present();
  }


  b64toBlob(b64Data, sliceSize, contentType) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
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
  takePicture() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      quality: 100,
      correctOrientation: true
    }).then(_imagePath => {
    
      this.photodisplay.push(_imagePath);
     return this.makeFileIntoBlob(_imagePath);
    }).then((_imageBlob) => {
      
      this.photos.push(_imageBlob);
    })
  }
  grabPicture() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 100,
      correctOrientation: true
    }).then(_imagePath => {
    
      this.photodisplay.push(_imagePath);
     return this.makeFileIntoBlob(_imagePath);
    }).then((_imageBlob) => {
      
      this.photos.push(_imageBlob);
    })
  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  sendrequest(describef, formf, vehiclef) {
    this.loader.present();
    this.af.database.list('booking').update(this.currentUser, {
      describe: describef,
      form: formf,
      vehicle: vehiclef,
      images: null
    }).then(() => {
      this.geolocation.getCurrentPosition().then(respon => {
        this.af.database.list('booking').update(this.currentUser,
          {
            longitude: respon.coords.longitude,
            latitude: respon.coords.latitude
          });
      }).catch((error) => {
        alert(error);
      });
    }).then(() => {
      if (this.photos) {
        this.photos.forEach(snap => {
          firebase.storage().ref().child("bookingimages").child(this.makeid() + ".jpg")
            .put(snap).then((savedPicture) => {
              firebase.database().ref("booking/" + this.currentUser).child("images").push({
                url: savedPicture.downloadURL
              });
            });
        });
      } else {
        this.loader.dismiss();
      }
    }).then(() => {
      this.loader.dismiss();
      this.navCtrl.setRoot(TabsPage);
    });
  }

}
