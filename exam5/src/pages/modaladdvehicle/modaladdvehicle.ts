import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase'
@Component({
  selector: 'page-modaladdvehicle',
  templateUrl: 'modaladdvehicle.html',
})
export class ModaladdvehiclePage {
  bsxref: any;
  currentUser: any;
  cars: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {

    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);


  }

  addvehicle(bsxf, loaixef, tenxef, hangxef) {
    let dktc = this.alertCtrl.create({
      subTitle: 'Thêm thành công!',
      buttons: [{
        text: "Ok",
        role: 'cancel'
      }]
    });
        let dktb = this.alertCtrl.create({
      subTitle: 'Đã có xe này!',
      buttons: [{
        text: "Ok",
        role: 'cancel'
      }]
    });
    firebase.database().ref("user/"+this.currentUser).child("transport").once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var vehicle = childSnapshot.val();
        if (vehicle.bsx == bsxf) {
          this.bsxref = vehicle.bsx;
        }
        return false;
      });
    }).then(newvehicle => {

      if (this.bsxref == bsxf) { dktb.present(); }

      else {
        this.af.database.list("/user/" + this.currentUser + "/transport").update(bsxf, {
          tenxe: tenxef,
          loaixe: loaixef,
          hangxe: hangxef,
          bsx: bsxf,
        }).then(done => {
          dktc.present();
          this.navCtrl.pop();
        });
      }
    });
  }

}
