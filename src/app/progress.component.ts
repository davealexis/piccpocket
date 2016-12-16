import { Component, Input, SimpleChange } from '@angular/core';

@Component({
    selector: 'progress-circle',
    templateUrl: './progress.component.html',
    styles: [ `.scaling-svg-container {
 position: relative; 
 height: 0; 
 width: 100%; 
 padding: 0;
 padding-bottom: calc(50vh); 
 /* override this inline for aspect ratio other than square */
}
.scaling-svg {
 position: absolute; 
 height: 100%; 
 width: 100%; 
 top: 0;
 left: 0;
}`]
})

export class ProgressComponent {
    private minorRadius:number = 95;
    minorCircumference:number = 2 * Math.PI * this.minorRadius;

    private majorRadius:number = 80;
    majorCircumference:number = 2 * Math.PI * this.majorRadius;

    @Input() minorMaxValue:number;
    @Input() majorMaxValue:number;

    @Input() minorValue:number;
    @Input() majorValue:number;

    private majorDecrement:number;
    private minorDecrement:number;

    minorDashOffset:number;
    majorDashOffset:number;

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        this.minorDecrement = 100 / this.minorMaxValue;
        let minorProgress = (this.minorDecrement * this.minorValue) / 100;
        this.minorDashOffset = this.minorCircumference * (1 - minorProgress);

        this.majorCircumference = 2 * Math.PI * this.majorRadius;
        this.majorDecrement = 100 / this.majorMaxValue;
        let majorProgress = (this.majorDecrement * this.majorValue) / 100;
        this.majorDashOffset = this.majorCircumference * (1 - majorProgress);
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