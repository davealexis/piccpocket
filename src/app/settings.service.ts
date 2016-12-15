import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SettingsData } from './settingsData';
import { Events } from 'ionic-angular';

@Injectable()
export class SettingsService {

    isInitialized: boolean = false;

    private settingsData: SettingsData;
    
    constructor (private storage: Storage, private events: Events) {

        // Get settings from storage
        this.events.publish('loading-settings');

        try {
            storage.get('settings')
                .then(
                    data => {
                        this.settingsData = data;                        
                        this.isInitialized = data !== null;
                        
                        if (!this.isInitialized) {
                            this.settingsData = {
                                infusionTimeInMinutes: 10,
                                medicationUnits: 20,
                                vibrationEnabled: true,
                                soundEnabled: true,
                                keepAwake: true
                            };
                        }

                        this.events.publish('settings-loaded');
                    },
                    error => {
                        this.settingsData = this.settingsData = {
                                infusionTimeInMinutes: 10,
                                medicationUnits: 20,
                                vibrationEnabled: true,
                                soundEnabled: true,
                                keepAwake: true
                            };

                        this.isInitialized = false;
                        this.events.publish('settings-loaded');
                    }
                );          
        } catch (error) {
             alert(error);   
        }
    
    }

    get(): SettingsData {
        this.events.publish('settings-loaded');
        return this.settingsData;
    }

    set(data: SettingsData): void {
        this.isInitialized = true;
        this.storage.set('settings', data);
    }
}
