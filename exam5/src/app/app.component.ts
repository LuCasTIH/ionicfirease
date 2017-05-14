import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { LoginPage } from '../pages/login/login';
import { TabsPage } from "../pages/tabs/tabs";
import { ProfiletabsPage } from "../pages/profiletabs/profiletabs";
import { BookingPage } from "../pages/booking/booking";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    if (!this.isloggedin()) {
      this.rootPage = LoginPage;
    } else {
      this.rootPage = ProfiletabsPage;
    }

    this.pages = [
      { title: 'Home', component: TabsPage },
      { title: "Thông tin của bạn", component: ProfiletabsPage },
      { title: "Sửa xe", component: BookingPage },

    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  isloggedin() {
    if (window.localStorage.getItem('currentuser'))
      return true;
  }
  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    window.localStorage.removeItem('currentuser');
    this.nav.setRoot(LoginPage);

  }
}

