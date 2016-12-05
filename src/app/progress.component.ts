import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'progress-circle',
    templateUrl: './progress.component.html'
})

export class ProgressComponent {
    private minorRadius:number = 95;
    private minorCircumference:number = 2 * Math.PI * this.minorRadius;

    private majorRadius:number = 80;
    private majorCircumference:number = 2 * Math.PI * this.majorRadius;

    @Input() minorMaxValue:number;
    @Input() majorMaxValue:number;

    @Input() minorValue:number;
    @Input() majorValue:number;

    private majorDecrement:number;
    private minorDecrement:number;

    private minorDashOffset:number;
    private majorDashOffset:number;

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        this.minorDecrement = 100 / this.minorMaxValue;
        let minorProgress = (this.minorDecrement * this.minorValue) / 100;
        this.minorDashOffset = this.minorCircumference * (1 - minorProgress);

        this.majorCircumference = 2 * Math.PI * this.majorRadius;
        this.majorDecrement = 100 / this.majorMaxValue;
        let majorProgress = (this.majorDecrement * this.majorValue) / 100;
        this.majorDashOffset = this.majorCircumference * (1 - majorProgress);

        console.log('MAJOR - max: ' + this.majorMaxValue + 
            ',  value: ' + this.majorValue + 
            ', Offset: ' + this.majorDashOffset + 
            ', decrement: ' + this.majorDecrement,
            ', circ: ' + this.majorCircumference +
            ', radius: ' + this.majorRadius);
        console.log('MINOR - max: ' + this.minorMaxValue + 
            ',  value: ' + this.minorValue + 
            ', Offset: ' + this.minorDashOffset + 
            ', decrement: ' + this.minorDecrement,
            ', circ: ' + this.minorCircumference +
            ', radius: ' + this.minorRadius);
    }


    // init(majorMax:number, minorMax:number) {
    //     this.minorMaxValue = minorMax;
    //     this.majorMaxValue = majorMax;

    //     this.majorDecrement = 100 / majorMax;
    //     this.minorDecrement = 100 / minorMax;
    // }

    // setProgress(majorValue:number, minorValue:number): void {
    //     this.majorValue = majorValue;
    //     this.minorValue = minorValue;

    //     let progress = majorValue / 100;
    //     this.majorDashOffset = this.majorCircumference * (1 - progress);            

    //     progress = minorValue / 100;
    //     this.minorDashOffset = this.minorCircumference * (1 - progress);        
    // }
}