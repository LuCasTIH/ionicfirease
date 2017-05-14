import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {

  users: FirebaseListObservable<any>;
  squestionref: any;
  awnserref: any;
  idref: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public af: AngularFire) {
    this.users = this.af.database.list('user');

  }


  reset(idf, passwordf, squestionf, awnserf) {
    let chctl = this.alertCtrl.create({
      subTitle: 'Câu hỏi hoặc câu trả lời không đúng',
      buttons: [{
        text: "Ok",
        role: 'cancel'
      }]
    });
    let idkd = this.alertCtrl.create({
      subTitle: 'ID không tồn tại',
      buttons: [{
        text: "Ok",
        role: 'cancel'
      }]
    });
    firebase.database().ref("user").once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var user = childSnapshot.val();
        if (user.id == idf) {
          this.idref = user.id;
          this.squestionref = user.squestion;
          this.awnserref = user.awnser;
        }
        return false;
      });
    }).then(reset => {
      if (this.idref == idf) {
        if (squestionf == this.squestionref && this.awnserref == awnserf) {
          this.users.update(idf, {

            _password: passwordf,

          }).then(newUsers => {
            let alert = this.alertCtrl.create({
              subTitle: "Đổi mật khẩu thành công.",
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.navCtrl.pop();
                  }
                }
              ]
            });
            alert.present();

          });
        }
        else {
          chctl.present();
        }
      }
      else {
        idkd.present();
      }
    });



  }



}
