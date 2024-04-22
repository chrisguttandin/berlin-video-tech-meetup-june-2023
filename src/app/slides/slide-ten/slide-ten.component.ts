import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vtm-slide-ten',
    standalone: true,
    styleUrls: ['./slide-ten.component.scss'],
    templateUrl: './slide-ten.component.html'
})
export class SlideTenComponent {}
