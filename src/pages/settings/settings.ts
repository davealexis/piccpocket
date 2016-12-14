import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { SettingsService } from '../../app/settings.service';
import { SettingsData } from '../../app/settingsData'

@Component({
    templateUrl: 'settings.html'
})

export class SettingsPage {
    ready: boolean = false;
    isInitialized: boolean = false;

    settingsData: SettingsData = {
        infusionTimeInMinutes: 0,
        medicationUnits: 0,
        vibrationEnabled: false,
        soundEnabled: false,
        keepAwake: false
    };

    constructor(
        public nav: NavController,
        public settings: SettingsService,
        private events: Events) {
            events.subscribe(
                'settings-loaded',
                () => {
                    this.ready = true;
                });

            let data = settings.get();
            this.isInitialized = settings.isInitialized;
            
            if (data && settings.isInitialized) {
                this.settingsData = data;
            } else {
                data =  {
                    infusionTimeInMinutes: 0,
                    medicationUnits: 0,
                    vibrationEnabled: false,
                    soundEnabled: false,
                    keepAwake: false
                };
            }
        }

    ionViewWillLeave(){
        // Save settings
        this.settings.set(this.settingsData);
    
        // Let listeners know that settings may have changed.
        this.events.publish('settings-changed');
    }

}
