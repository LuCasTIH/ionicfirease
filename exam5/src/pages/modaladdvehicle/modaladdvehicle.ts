import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';
@Component({
  selector: 'page-modaladdvehicle',
  templateUrl: 'modaladdvehicle.html',
})
export class ModaladdvehiclePage {
  currentUser: any;
  cars: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {

    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);


  }

  addvehicle(bsxf, loaixef, tenxef, hangxef) {
    let da = this.alertCtrl.create({
      subTitle: 'Thêm thành công!',
      buttons: [{
        text: "Ok",
        role: 'cancel'
      }]
    });
    this.af.database.list("/user/" + this.currentUser + "/transport").update(bsxf, {
      tenxe: tenxef,
      loaixe: loaixef,
      hangxe: hangxef,
      bsx: bsxf,
    }).then(done => {
      da.present();
      this.navCtrl.pop();
    });
  }

}
