import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { StationPage } from "../station/station";
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  locations: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public geolocation: Geolocation) {
    this.load();
  }
  load() {
    firebase.database().ref("stations").once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var locationsref = childSnapshot.val();
        this.locations.push({
          key: childSnapshot.key,
          title: locationsref.title,
          latitude: locationsref.latitude,
          longitude: locationsref.longitude,
        });
        return false;
      });
    }).then(() => {
      this.applyHaversine(this.locations);
    });

  }
  gotostation(key) {
    this.navCtrl.push(StationPage, { param: key });
  }

  applyHaversine(locations) {
    let locationOptions = { timeout: 10000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(locationOptions).then(position => {
      let usersLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      locations.map((location) => {

        let placeLocation = {
          lat: location.latitude,
          lng: location.longitude
        };

        location.distance = this.getDistanceBetweenPoints(
          usersLocation,
          placeLocation,
          'km'
        ).toFixed(2);
      });
    });


  }

  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'km'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }
}