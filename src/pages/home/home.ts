import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Vibration } from 'ionic-native';

@Component({
    templateUrl: 'home.html'
})

export class HomePage {

    counter: number = 0;
    actionMessage: string = '';
    //unitsMessage: string = '';
    started: boolean = false;
    paused: boolean = false;

    medUnits:number;
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

    constructor(public toastCtrl: ToastController) {
        this.medUnits = 20
        this.medUnitCounter = this.medUnits;
        this.totalPumpTimeInSeconds = 60 * 12;
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

        let sound = new Audio('./assets/pump.wav');
        let endSound = new Audio('./assets/done.wav');
        let getReadyCountdown = 5;
        sound.volume - 1.0;

        this.countdownSecondsRatio = 100 / this.periodSeconds;
        this.periodCounter = this.periodSeconds - getReadyCountdown;

        this.actionMessage = '';
        this.showToast('Get Ready!');
        this.setProgress(getReadyCountdown);

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
                    homeCtl.medUnitCounter -= 1;
                    sound.currentTime = 0;
                    sound.play();
                    homeCtl.actionMessage = 'PUMP!';
                    homeCtl.showToast('PUMP!');
                    Vibration.vibrate(1000);
                    
                    homeCtl.periodCounter = 0;

                    setTimeout(function() { homeCtl.actionMessage = ''; }, 2000);
                }

                if (homeCtl.medUnitCounter === 0 || homeCtl.started == false) {
                    clearInterval(timer);
                    endSound.play();
                    
                    setTimeout(function() { 
                        homeCtl.started = false;
                    }, 2000);
                    
                    homeCtl.setProgress(0);
                    homeCtl.showToast('Done');
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
}
