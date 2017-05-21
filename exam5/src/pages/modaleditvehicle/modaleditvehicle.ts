import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
@Component({
  selector: 'page-modaleditvehicle',
  templateUrl: 'modaleditvehicle.html',
})
export class ModaleditvehiclePage {
  bsxb: any;
  currentUser: any;
  bsxf: any;
  hangxef: any;
  tenxef: any;
  loaixef: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    this.loaixef = navParams.get('paramloaixe');
    this.tenxef = navParams.get('paramtenxe');
    this.bsxf = navParams.get('parambsx');
    this.bsxb = navParams.get('parambsx');
    this.hangxef = navParams.get('paramhangxe');
    var val = window.localStorage.getItem('currentuser');
    this.currentUser = JSON.parse(val);

  }

  editvehicle(bsxf, loaixef, tenxef, hangxef) {
    this.af.database.list("/user/" + this.currentUser + "/transport").remove(this.bsxb)
      .then(edit => {
        this.af.database.list("/user/" + this.currentUser + "/transport").update(bsxf, {
          tenxe: tenxef,
          loaixe: loaixef,
          hangxe: hangxef,
          bsx: bsxf,
        });
      }).then(() => {
        this.navCtrl.pop();
      });
  }
}
