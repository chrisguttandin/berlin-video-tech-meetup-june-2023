import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription, concat, filter, from, map, of, take, zip } from 'rxjs';
import { on } from 'subscribable-things';
import { ITimingObject, TTimingStateVectorUpdate } from 'timing-object';
import Player from '@vimeo/player';
import { TimingObjectService } from '../../timing-object.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vtm-slide-eighteen',
    templateUrl: './slide-eighteen.component.html'
})
export class SlideEighteenComponent implements OnDestroy, OnInit {
    private _mappedTimingObject!: Pick<ITimingObject, 'addEventListener' | 'query' | 'readyState' | 'removeEventListener' | 'update'>;

    private _player!: Player;

    private _readySubscription: null | Subscription;

    private _timingSrcConnector: any;

    private _toggleSubscription: null | Subscription;

    constructor(private _timingObjectService: TimingObjectService) {
        this._readySubscription = null;
        this._toggleSubscription = null;
    }

    @HostListener('document:keyup', ['$event']) public handleKeyUp(event: KeyboardEvent): void {
        if (event.code === 'Space') {
            this._toggleSubscription?.unsubscribe();

            const timingObject = this._timingObjectService.timingObject;

            this._toggleSubscription = zip(
                from(this._player.ready()),
                concat(of(null), from(on(timingObject, 'readystatechange'))).pipe(
                    map(() => timingObject.readyState),
                    filter((readyState) => readyState === 'open'),
                    take(1)
                )
            )
                // eslint-disable-next-line rxjs-angular/prefer-async-pipe
                .subscribe(() => {
                    const { position, velocity } = timingObject.query();

                    if (position >= 1000) {
                        timingObject.update({ position: velocity === 0 ? 18500 : position, velocity: velocity === 0 ? 1 : 0 });
                    }
                });
        }
    }

    public ngOnDestroy(): void {
        this._readySubscription?.unsubscribe();
        this._timingSrcConnector?.then((timingSrcConnector: any) => timingSrcConnector.disconnect());
        this._toggleSubscription?.unsubscribe();
    }

    public ngOnInit(): void {
        this._player = new Player('vimeo-player', {
            byline: false,
            controls: false,
            dnt: true,
            id: 802212449,
            keyboard: false,
            muted: true,
            responsive: true
        });

        const timingObject = this._timingObjectService.timingObject;

        this._mappedTimingObject = {
            addEventListener(...args: Parameters<typeof timingObject.addEventListener>) {
                return timingObject.addEventListener(...args);
            },
            query() {
                const { position, velocity, ...vector } = timingObject.query();
                const mappedPosition = Math.min(42, Math.max(0, position - 18500));

                return { ...vector, position: mappedPosition, velocity: mappedPosition === 0 || mappedPosition === 42 ? 0 : velocity };
            },
            get readyState() {
                return timingObject.readyState;
            },
            removeEventListener(...args: Parameters<typeof timingObject.removeEventListener>) {
                return timingObject.removeEventListener(...args);
            },
            update(newVector: TTimingStateVectorUpdate) {
                const { position } = newVector;

                if (position === null || position === undefined) {
                    return timingObject.update(newVector);
                }

                return timingObject.update({ ...newVector, position: position + 18500 });
            }
        };
        this._readySubscription = zip(
            from(this._player.ready()),
            concat(of(null), from(on(timingObject, 'readystatechange'))).pipe(
                map(() => timingObject.readyState),
                filter((readyState) => readyState === 'open'),
                take(1)
            )
        )
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe
            .subscribe(() => {
                this._timingSrcConnector = (<any>this._player).setTimingSrc(this._mappedTimingObject);
            });
    }
}
