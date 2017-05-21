import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { ModaladdvehiclePage } from "../modaladdvehicle/modaladdvehicle";
import { ModaleditvehiclePage } from "../modaleditvehicle/modaleditvehicle";
@Component({
  selector: 'page-vehicle',
  templateUrl: 'vehicle.html',
})
export class VehiclePage {
  currentUser: any;
  vehicles: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController) {

    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);
    this.vehicles = af.database.list("user/" + this.currentUser + "/transport");
  }

  gotoaddvehicle() {
    this.navCtrl.push(ModaladdvehiclePage);
  }

  deletevehicle(vehiclekey): void {
    let prompt = this.alertCtrl.create({

      subTitle: 'Xóa xe này ?',
      buttons: [
        {
          text: "Hủy",
          role: "cancel"
        },
        {
          text: "Xóa",
          handler: data => {
            this.vehicles.remove(vehiclekey);
          }
        }

      ]
    });
    prompt.present();

  }

  gotoeditvehicle(vehicle) {
    this.navCtrl.push(ModaleditvehiclePage, {
      parambsx: vehicle.bsx,
      paramloaixe: vehicle.loaixe,
      paramtenxe: vehicle.tenxe,
      paramhangxe: vehicle.hangxe
    });

  }

}
