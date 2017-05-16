import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {


  constructor(public navCtrl: NavController, public platform: Platform) {


}
}