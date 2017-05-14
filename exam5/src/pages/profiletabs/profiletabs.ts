import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";
import { VehiclePage } from "../vehicle/vehicle";

@Component({
  selector: 'page-profiletabs',
  templateUrl: 'profiletabs.html',
})
export class ProfiletabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = VehiclePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }



}
