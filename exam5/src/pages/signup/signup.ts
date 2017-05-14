import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  users: FirebaseListObservable<any>;
  idref: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {
    this.users = this.af.database.list('user');
  }


  signup(idf, passwordf, squestionf, awnserf) {
    firebase.database().ref("user").once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var user = childSnapshot.val();
        if (user.id == idf) {
          this.idref = user.id;
        }
        return false;
      });
    }).then(signup => {
      if (this.idref == idf) {
        let alert = this.alertCtrl.create({
          subTitle: "ID đã được sử dụng",
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      }

      else {
        
        this.users.update(idf, {
          id: idf,
          _password: passwordf,
          name: '',
          email:'',
          phonenumber: '',
          squestion: squestionf,
          awnser: awnserf,
          transports: null

        }).then(newUsers => {
          let alert = this.alertCtrl.create({
            subTitle: "Đăng Kí Thành Công",
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.navCtrl.setRoot(LoginPage);
                }
              }
            ]
          });
          alert.present();

        });
      }
    });



  }








}
