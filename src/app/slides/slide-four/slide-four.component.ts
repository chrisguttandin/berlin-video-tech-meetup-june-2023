import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vtm-slide-four',
    styleUrls: ['./slide-four.component.scss'],
    templateUrl: './slide-four.component.html'
})
export class SlideFourComponent implements OnInit {
    public bars$!: Observable<number[]>;

    public ngOnInit(): void {
        this.bars$ = of(
            Array.from({ length: 56 }, (_, index) => {
                const remainder = index % 8;

                if (remainder < 4) {
                    return 22 * (8 - remainder * 2);
                }

                return 22 * (8 - remainder);
            })
        );
    }
}
