import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrismComponent } from '../prism/prism.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PrismComponent],
    selector: 'vtm-slide-seven',
    templateUrl: './slide-seven.component.html'
})
export class SlideSevenComponent {}
