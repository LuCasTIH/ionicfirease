import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { ModaladdvehiclePage } from "../modaladdvehicle/modaladdvehicle";
@Component({
  selector: 'page-vehicle',
  templateUrl: 'vehicle.html',
})
export class VehiclePage {
  currentUser: any;
  vehicles: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {

    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);
    this.vehicles = af.database.list("user/" + this.currentUser + "/transport");
  }

  gotoaddvehicle() {
    this.navCtrl.push(ModaladdvehiclePage);
  }

}
