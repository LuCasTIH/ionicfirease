import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
@Component({
  selector: 'page-station',
  templateUrl: 'station.html',
})
export class StationPage {
  id: any;
  stationref = {
    title: '',
    workinghour: '',
    describe: '',
    address: '',
    phonenumber: '',
    backgroundimg: null,
  };
  images: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.get('param');
   
    this.loadstation();
  }

  loadstation() {
    var ref = firebase.database().ref('stations').child(this.id);
    ref.once('value', snapshot => {
      var station = snapshot.val();
      this.stationref.title = station.title;
      this.stationref.workinghour = station.workinghour;
      this.stationref.address = station.address;
      this.stationref.phonenumber = station.phonenumber;
      this.stationref.describe = station.describe;
      this.stationref.backgroundimg = station.backgroundimg;
    }).then(() => {
      ref.child('images').on('value', snapshot2 => {
        snapshot2.forEach(childsnapshot => {
          var imageref = childsnapshot.val();
          this.images.push(imageref.url);
          return false;
        });
      });
    });
  }
}
