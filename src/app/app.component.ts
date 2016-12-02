import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { SettingsService } from './settings.service';

@Component({
    templateUrl: 'app.html',
    providers: [ SettingsService ]
})

export class MyApp {
    // make HomePage the root (or first) page
    rootPage: any = HomePage;

  constructor(
      public platform: Platform,
      public menu: MenuController
  ) {
      this.initializeApp();
  }

  initializeApp() {
      this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
      });
  }
}
