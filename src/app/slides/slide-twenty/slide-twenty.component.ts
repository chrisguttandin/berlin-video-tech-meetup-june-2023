import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, concat, filter, from, map, of, switchMap, take } from 'rxjs';
import { animationFrame, on } from 'subscribable-things';
import { TimingObjectService } from '../../timing-object.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe],
    selector: 'vtm-slide-twenty',
    standalone: true,
    styleUrls: ['./slide-twenty.component.scss'],
    templateUrl: './slide-twenty.component.html'
})
export class SlideTwentyComponent implements OnInit {
    public backgroundColor$!: Observable<string>;

    constructor(private _timingObjectService: TimingObjectService) {}

    public ngOnInit(): void {
        const { timingObject } = this._timingObjectService;

        this.backgroundColor$ = concat(of(null), from(on(timingObject, 'readystatechange'))).pipe(
            map(() => timingObject.readyState),
            filter((readyState) => readyState === 'open'),
            take(1),
            switchMap(() => animationFrame()),
            map((now) => {
                const { position } = timingObject.query();
                const remainder = position >= 1000 ? position % 3 : (now / 1000) % 3;

                return remainder < 1 ? '#e86850' : remainder < 2 ? '#000' : '#fff';
            })
        );
    }
}
