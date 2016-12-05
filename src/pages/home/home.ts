import { Component } from '@angular/core';
import { ToastController, NavController } from 'ionic-angular';

import { Vibration, Insomnia } from 'ionic-native';

import { SettingsPage } from '../../pages/settings/settings';
import { SettingsService } from '../../app/settings.service';

@Component({
    templateUrl: 'home.html'
})

export class HomePage {
    counter: number = 0;
    actionMessage: string = '';
    started: boolean = false;
    paused: boolean = false;

    medUnits:number;
    medUnitCounter: number = 0;
    totalPumpTimeInMinutes: number;
    totalPumpTimeInSeconds: number = 0;
    periodSeconds: number = 0;
    periodCounter: number = 0;

    countdownMax:number = 100;
    countdownSecondsRatio: number;
    countdownSecondsLeft:number;
    dashOffset:number;
    RADIUS:number = 54;
    CIRCUMFERENCE:number;

    constructor(
        public toastCtrl: ToastController,
        public nav: NavController,
        private settingsService: SettingsService) {

        this.medUnits = settingsService.medicationUnits;
        this.medUnitCounter = this.medUnits;
        this.totalPumpTimeInMinutes = settingsService.infusionTimeInMinutes;
        this.totalPumpTimeInSeconds = 60 * this.totalPumpTimeInMinutes;
        this.periodSeconds = Math.round(this.totalPumpTimeInSeconds / this.medUnitCounter);
        this.periodCounter = 0;

        this.dashOffset = 100;
        this.CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;
        this.setProgress(0);
    }

    start(): void {
        this.started = true;
        this.paused = false;
        this.medUnitCounter = this.medUnits;

        Insomnia.keepAwake();
        
        let sound = new Audio('./assets/pump.wav');
        let endSound = new Audio('./assets/done.wav');
        let getReadyCountdown = 5;
        sound.volume - 1.0;

        this.countdownSecondsRatio = 100 / this.periodSeconds;
        this.periodCounter = this.periodSeconds - getReadyCountdown;

        this.actionMessage = '';
        this.showToast('Get Ready!');
        this.setProgress(getReadyCountdown);
        this.countdownSecondsLeft = getReadyCountdown;
        
        let homeCtl = this;

        // Time the rest of the pumps
        let timer = setInterval(
            function() {
                if (homeCtl.paused) {
                    return
                }

                homeCtl.periodCounter += 1;
                homeCtl.countdownSecondsLeft = homeCtl.periodSeconds - homeCtl.periodCounter;
                homeCtl.setProgress(homeCtl.countdownSecondsLeft);
                
                if (homeCtl.periodCounter === homeCtl.periodSeconds) {
                    sound.currentTime = 0;
                    sound.play();

                    homeCtl.medUnitCounter -= 1;
                    homeCtl.periodCounter = 0;

                    homeCtl.actionMessage = 'PUMP!';
                    Vibration.vibrate(1000);

                    setTimeout(function() { homeCtl.actionMessage = ''; }, 3000);
                }

                if (homeCtl.medUnitCounter === 0 || homeCtl.started == false) {
                    clearInterval(timer);
                    endSound.play();
                    
                    setTimeout(function() { 
                        homeCtl.started = false;
                    }, 4000);
                    
                    homeCtl.setProgress(0);
                    homeCtl.showToast('Done');
                    Insomnia.allowSleepAgain();
                }
            },
            1000
        );
    }

    pause(): void {
        this.paused = !this.paused;
        this.actionMessage = this.paused ? '( paused )' : '';
    }

    cancel(): void {
        this.started = false;
        this.paused = false;
        this.actionMessage = '';
    }

    showToast(text: string): void {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'middle',
            cssClass: 'toast'
        });

        toast.present();
    }

    setProgress(seconds:number): void {
        let progress = (this.countdownSecondsRatio * seconds) / 100;
        this.dashOffset = this.CIRCUMFERENCE * (1 - progress);
    }

    openSettings():void {
        this.nav.setRoot(SettingsPage);
    }
}
