import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {

    infusionTimeInMinutes: number = 12;
    medicationUnits: number = 20;
    vibrationEnabled: boolean = true;
    soundEnabled: boolean = true;
    
}