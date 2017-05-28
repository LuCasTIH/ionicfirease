import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { GoogleMap, GoogleMaps, LatLng, CameraPosition, GoogleMapsEvent, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { Geolocation } from "@ionic-native/geolocation";
import firebase from 'firebase';
import { StationPage } from "../station/station";
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  locations: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public googleMaps: GoogleMaps, public geolocation: Geolocation) {


  }



  ngAfterViewInit() {
    this.loadMap();
  }


  loadMap() {
    let element = document.getElementById('map');
    let map: GoogleMap = this.googleMaps.create(element, {});
    let locationOptions = { timeout: 10000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(locationOptions).then(position => {
      let latlng = new LatLng(position.coords.latitude, position.coords.longitude);

      map.one(GoogleMapsEvent.MAP_READY).then(() => {

        let position: CameraPosition = {
          target: latlng,
          zoom: 20,
          tilt: 30
        };
        map.moveCamera(position);

        let usermarker: MarkerOptions = {
          position: latlng,
          title: 'Vị trí của bạn'
        };
        map.addMarker(usermarker).then((marker: Marker) => {
          marker.showInfoWindow();
        });


        firebase.database().ref("stations").once("value", (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            var locationsref = childSnapshot.val();
            this.locations.push({
              title: locationsref.title,
              latitude: locationsref.latitude,
              longitude: locationsref.longitude,
              key: childSnapshot.key,
            });
            return false;
          });
        }).then(() => {
          this.locations.forEach(element => {
            let stationlatLng = new LatLng(element.latitude, element.longitude);
            let markeroption: MarkerOptions = {
              position: stationlatLng,
              title: element.title,
            };
           let marker= map.addMarker(markeroption).then((marker: Marker) => {
              marker.showInfoWindow();
             
            });
          });
        });
      });
    });
  }
}