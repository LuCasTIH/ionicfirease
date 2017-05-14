import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
  users: FirebaseListObservable<any>;
  userProfile = {
    name: '',
    email: '',
    phonenumber: '',
  
  };

  currentUser: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);
    this.users = this.af.database.list('user');
  }
  ionViewDidEnter() {
    var ref = firebase.database().ref("user/" + this.currentUser);
    ref.once("value", (snapshot) => {
      var user = snapshot.val();
      this.userProfile.email = user.email;
      this.userProfile.phonenumber = user.phonenumber;
      this.userProfile.name = user.name;
      

      return false;

    });
  }

  edit() {
    this.users.update(this.currentUser, {
      email: this.userProfile.email,
      name: this.userProfile.name,
      phonenumber: this.userProfile.phonenumber,

    }).then(finish => {
      this.navCtrl.pop();
    });

  }
}
