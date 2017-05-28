import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { EditprofilePage } from '../pages/editprofile/editprofile';

import { AngularFireModule } from 'angularfire2';
import { TabsPage } from "../pages/tabs/tabs";
import { ListPage } from "../pages/list/list";

import { Camera } from '@ionic-native/camera';
import { Device } from "@ionic-native/device";
import { ProfiletabsPage } from "../pages/profiletabs/profiletabs";
import { BookingPage } from "../pages/booking/booking";
import { VehiclePage } from "../pages/vehicle/vehicle";
import { ModaladdvehiclePage } from "../pages/modaladdvehicle/modaladdvehicle";
import { ModaleditvehiclePage } from "../pages/modaleditvehicle/modaleditvehicle";
import {Geolocation} from '@ionic-native/geolocation'
import { GoogleMaps } from '@ionic-native/google-maps';
import { Network } from '@ionic-native/network';
import { StationPage } from "../pages/station/station";
import { MapPage } from "../pages/map/map";
const firebaseConfig = {
  apiKey: "AIzaSyCi-VjhHR_vNmpA0gYCIJ25uDomjFYS-XA",
  authDomain: "zxczxc-c727c.firebaseapp.com",
  databaseURL: "https://zxczxc-c727c.firebaseio.com",
  projectId: "zxczxc-c727c",
  storageBucket: "zxczxc-c727c.appspot.com",
  messagingSenderId: "274529849874"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetpasswordPage,
    EditprofilePage,
    MapPage,
    TabsPage,
    ListPage,
    ProfiletabsPage,
    BookingPage,
    VehiclePage,
    ModaladdvehiclePage,
    ModaleditvehiclePage,
    StationPage


  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetpasswordPage,
    EditprofilePage,
    MapPage,
    TabsPage,
    ListPage,
    ProfiletabsPage,
    VehiclePage,
    BookingPage,
    ModaladdvehiclePage,
    ModaleditvehiclePage,
    StationPage

  ],
  providers: [
    StatusBar,
    SplashScreen,

    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    Device, 
    Geolocation,
    Network,
    GoogleMaps

  ]
})
export class AppModule { }
