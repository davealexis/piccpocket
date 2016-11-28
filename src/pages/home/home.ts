import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Vibration } from 'ionic-native';

@Component({
    templateUrl: 'home.html'
})

export class HomePage {

    counter: number = 0;
    counterMessage: string = '';
    actionMessage: string = '';
    unitsMessage: string = '';
    started: boolean = false;
    paused: boolean = false;

    medUnits: number = 0;
    totalPumpTimeInSeconds: number = 0;
    periodSeconds: number = 0;
    periodCounter: number = 0;

    constructor(public toastCtrl: ToastController) {
        this.medUnits = 20;
        this.totalPumpTimeInSeconds = 60 * 12;
        this.periodSeconds = Math.round(this.totalPumpTimeInSeconds / this.medUnits);
        this.periodCounter = 0;
    }

    start(): void {
        this.started = true;
        this.paused = false;

        //let count = 0;
        let sound = new Audio('./assets/pump.wav');
        let endSound = new Audio('./assets/done.wav');
        sound.volume - 1.0;

        this.actionMessage = this.unitsMessage = this.counterMessage = '';
        this.showToast('Get Ready!');

        this.periodCounter = this.periodSeconds - 5;

        let homeCtl = this;

        // Time the rest of the pumps
        let timer = setInterval(
            function() {
                if (homeCtl.paused) {
                    return
                }

                homeCtl.periodCounter++;

                if (homeCtl.periodCounter === homeCtl.periodSeconds) {
                    homeCtl.medUnits -= 1;
                    sound.play();
                    homeCtl.actionMessage = 'PUMP!';
                    homeCtl.showToast('PUMP!');
                    Vibration.vibrate(1000);
                    
                    homeCtl.periodCounter = 0;
                    sound.currentTime=0;
                    setTimeout(function() { homeCtl.actionMessage = ''; }, 2000);
                }

                homeCtl.counterMessage = (String)(homeCtl.periodSeconds - homeCtl.periodCounter);
                homeCtl.unitsMessage = homeCtl.medUnits.toString() + ' units left';

                if (homeCtl.medUnits === 0 || homeCtl.started == false) {
                    clearInterval(timer);
                    endSound.play();
                    homeCtl.unitsMessage = '';
                    homeCtl.counterMessage = 'Done';
                    
                    setTimeout(function() { 
                        homeCtl.started = false;
                    }, 2000);
                    
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
}
