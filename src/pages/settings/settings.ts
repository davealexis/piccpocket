import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SettingsService } from '../../app/settings.service';

@Component({
    templateUrl: 'settings.html'
})

export class SettingsPage {

    infusionTime:number;
    medUnits:number;

    constructor(
        public nav: NavController,
        private settingsService: SettingsService) {
            console.log('Infustion Time: ' + settingsService.infusionTimeInMinutes);

            this.infusionTime = settingsService.infusionTimeInMinutes;
            this.medUnits = settingsService.medicationUnits;
            settingsService.infusionTimeInMinutes = 15;
        }

    goBack(): void {
        this.nav.setRoot(HomePage)
    }
}
