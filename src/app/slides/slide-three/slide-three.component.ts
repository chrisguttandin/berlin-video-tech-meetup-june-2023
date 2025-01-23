import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, NgFor],
    selector: 'vtm-slide-three',
    styleUrls: ['./slide-three.component.scss'],
    templateUrl: './slide-three.component.html'
})
export class SlideThreeComponent implements OnInit {
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
