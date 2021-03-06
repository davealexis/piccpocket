import { Component } from '@angular/core';
import { ToastController, NavController, Events, Platform } from 'ionic-angular';

import { Vibration, Insomnia, ScreenOrientation } from 'ionic-native';

import { SettingsPage } from '../../pages/settings/settings';
import { SettingsService } from '../../app/settings.service';

@Component({
    templateUrl: 'home.html'
})

export class HomePage {
    // From settings/preferences
    medUnits:number;
    totalPumpTimeInMinutes: number;
    vibrationEnabled: boolean;
    soundEnabled: boolean;
    keepAwake: boolean;

    // Internal operations
    counter: number = 0;
    actionMessage: string = '';
    started: boolean = false;
    paused: boolean = false;
    medUnitCounter: number = 0;
    totalPumpTimeInSeconds: number = 0;
    periodSeconds: number = 0;
    periodCounter: number = 0;
    countdownMax:number = 100;
    countdownSecondsRatio: number;
    countdownSecondsLeft:number;
    dashOffset:number;
    RADIUS:number = 54;
    CIRCUMFERENCE:number;

    private isMobile: boolean;

    constructor(
        public toastCtrl: ToastController,
        public nav: NavController,
        private settingsService: SettingsService,
        private platform: Platform,
        events: Events) {
        
        events.subscribe(
                'settings-loaded',
                () => {
                    events.unsubscribe('settings-loaded');
                    this.loadSettings();
                });

        this.periodCounter = 0;

        this.dashOffset = 100;
        this.CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;
        this.setProgress(0);

        this.isMobile = platform.is('android') || platform.is('ios');

        events.subscribe(
            'settings-changed',
            () => {
                this.loadSettings();
            });
    }

    start(): void {
        let sound = new Audio('./assets/pump.wav');
        let endSound = new Audio('./assets/done.wav');

        this.loadSettings();

        this.started = true;
        this.paused = false;
        this.medUnitCounter = this.medUnits;

        if (this.isMobile) {
            if (this.keepAwake) {
                Insomnia.keepAwake();
            }

            ScreenOrientation.lockOrientation('portrait');
        }

        let getReadyCountdown = 5;

        if (this.soundEnabled === true) {
            sound.volume = 1.0;
        }

        this.countdownSecondsRatio = 100 / this.periodSeconds;
        this.periodCounter = this.periodSeconds - getReadyCountdown;

        this.actionMessage = '';
        this.showToast('Get Ready!');
        this.setProgress(getReadyCountdown);
        this.countdownSecondsLeft = getReadyCountdown;
        
        let homeCtl = this;

        // Start timing the infusions
        let timer = setInterval(
            function() {
                if (homeCtl.paused) {
                    return
                }

                homeCtl.periodCounter += 1;
                homeCtl.countdownSecondsLeft = homeCtl.periodSeconds - homeCtl.periodCounter;
                homeCtl.setProgress(homeCtl.countdownSecondsLeft);
                
                if (homeCtl.periodCounter === homeCtl.periodSeconds) {
                    if (homeCtl.soundEnabled) {
                        sound.currentTime = 0;
                        sound.play();
                    }

                    homeCtl.medUnitCounter -= 1;
                    homeCtl.periodCounter = 0;

                    homeCtl.actionMessage = 'PUMP';

                    if (homeCtl.vibrationEnabled) {
                        Vibration.vibrate(1000);
                    }

                    setTimeout(function() { homeCtl.actionMessage = ''; }, 3000);
                }

                if (homeCtl.medUnitCounter === 0 || homeCtl.started == false) {
                    clearInterval(timer);

                    if (homeCtl.soundEnabled) {
                        endSound.play();
                    }

                    setTimeout(function() { 
                        homeCtl.started = false;
                    }, 4000);
                    
                    homeCtl.setProgress(0);
                    homeCtl.showToast('Done');

                    if (homeCtl.isMobile && homeCtl.keepAwake) {
                        Insomnia.allowSleepAgain();
                        ScreenOrientation.unlockOrientation();
                    }
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
        this.nav.push(SettingsPage);
    }

    loadSettings(): void {
        if (!this.settingsService.isInitialized) {
            this.nav.push(SettingsPage);
            return;
        }

        let settingsData = this.settingsService.get();

        this.medUnits = settingsData.medicationUnits;
        this.totalPumpTimeInMinutes = settingsData.infusionTimeInMinutes;
        this.vibrationEnabled = settingsData.vibrationEnabled;
        this.soundEnabled = settingsData.soundEnabled;
        this.keepAwake = settingsData.keepAwake;

        this.medUnitCounter = this.medUnits;
        this.totalPumpTimeInSeconds = 60 * this.totalPumpTimeInMinutes;
        this.periodSeconds = Math.round(this.totalPumpTimeInSeconds / this.medUnitCounter);
    }
}
