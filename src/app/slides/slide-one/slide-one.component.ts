import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vtm-slide-one',
    standalone: true,
    styleUrls: ['./slide-one.component.scss'],
    templateUrl: './slide-one.component.html'
})
export class SlideOneComponent {}
