import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { SettingsService } from '../../app/settings.service';

@Component({
    templateUrl: 'settings.html'
})

export class SettingsPage {

    constructor(
        public nav: NavController,
        public settings: SettingsService,
        private events: Events) {
        }

    ionViewWillLeave(){
        this.events.publish('settings-changed');
    }

}
