import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import { ResetpasswordPage } from "../resetpassword/resetpassword";
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  //email:FirebaseListObservable<any>;
  // password:FirebaseListObservable<any>;
  idref: any;
  passwordref: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) { }

  gotosignup() {
    this.navCtrl.push(SignupPage);
  }

  login(idf, passwordf) {
    firebase.database().ref("user").once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var user = childSnapshot.val();
        if (user.id == idf) {
          this.idref = user.id;
          this.passwordref=user._password ;
        }
        return false;
      });

    }).then(login => {

      if (idf == this.idref && passwordf == this.passwordref) {
        let currentuser = this.idref;
        window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
        this.navCtrl.setRoot(HomePage);
      } else {
        console.log(this.idref, this.passwordref);
        let alert = this.alertCtrl.create({
          subTitle: "Tài khoản hoặc mật khẩu không đúng",
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      }
    });
  }

  gotoreset() {
    this.navCtrl.push(ResetpasswordPage);
  }

}


