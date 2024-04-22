import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vtm-slide-fifteen',
    standalone: true,
    templateUrl: './slide-fifteen.component.html'
})
export class SlideFifteenComponent {}
