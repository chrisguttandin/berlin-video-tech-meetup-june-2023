import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vtm-slide-seventeen',
    standalone: true,
    styleUrls: ['./slide-seventeen.component.scss'],
    templateUrl: './slide-seventeen.component.html'
})
export class SlideSeventeenComponent {}
