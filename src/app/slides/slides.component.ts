import { transition, trigger, useAnimation } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { EMPTY, Subscription, catchError, concat, filter, from, map, of, switchMap, take } from 'rxjs';
import { animationFrame, mediaQueryMatch, on } from 'subscribable-things';
import { TimingObjectService } from '../timing-object.service';
import { WindowService } from '../window.service';
import { slideAnimation } from './slide.animation';

const EXCLUDED_FORWARD_TRANSITIONS = [4, 5];
const NO_TRANSITION_PARAMS = { duration: '0s', enterTransform: 'none', leaveTransform: 'none', top: 'auto', width: 'auto' };

@Component({
    animations: [trigger('transition', [transition('* => *', [useAnimation(slideAnimation)])])],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterOutlet],
    styleUrls: ['./slides.component.scss'],
    templateUrl: './slides.component.html'
})
export class SlidesComponent implements OnDestroy, OnInit {
    @HostBinding('@transition') public transition!: {
        params: { duration: string; enterTransform: string; leaveTransform: string; top: string; width: string };

        value: number;
    };

    private _index: number;

    private _isPreferingReducedMotion: boolean;

    private _matchMediaQueryMatchSubscription: null | Subscription;

    private _readySubscription: null | Subscription;

    private _routerEventsSubscription: null | Subscription;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _timingObjectService: TimingObjectService,
        private _windowService: WindowService
    ) {
        this._index = 0;
        this._isPreferingReducedMotion = false;
        this._matchMediaQueryMatchSubscription = null;
        this._readySubscription = null;
        this._routerEventsSubscription = null;
    }

    @HostListener('document:keyup', ['$event']) public handleKeyUp(event: KeyboardEvent): void {
        if (
            (event.code !== undefined && event.code === 'ArrowLeft') ||
            // The keyCode property is deprecated but it should be fine to use it here as it is only used as a fallback.
            event.keyCode === 37
        ) {
            this._goToPreviousSlide();
        } else if (
            (event.code !== undefined && event.code === 'ArrowRight') ||
            // The keyCode property is deprecated but it should be fine to use it here as it is only used as a fallback.
            event.keyCode === 39
        ) {
            this._goToNextSlide();
        }
    }

    public handleSwipeLeft(): void {
        this._goToNextSlide();
    }

    public handleSwipeRight(): void {
        this._goToPreviousSlide();
    }

    public ngOnDestroy(): void {
        this._matchMediaQueryMatchSubscription?.unsubscribe();
        this._readySubscription?.unsubscribe();
        this._routerEventsSubscription?.unsubscribe();
    }

    public ngOnInit(): void {
        this._matchMediaQueryMatchSubscription = from(mediaQueryMatch('(prefers-reduced-motion: reduce)'))
            .pipe(catchError(() => EMPTY))
            .subscribe((isPreferingReducedMotion) => (this._isPreferingReducedMotion = isPreferingReducedMotion)); // eslint-disable-line max-len, rxjs-angular/prefer-async-pipe

        this._routerEventsSubscription = this._router.events
            .pipe(filter((routerEvent) => routerEvent instanceof NavigationEnd))
            .subscribe(() => this._setIndexAndTransition()); // eslint-disable-line rxjs-angular/prefer-async-pipe

        const timingObject = this._timingObjectService.timingObject;

        this._readySubscription = concat(of(null), from(on(timingObject, 'readystatechange')))
            .pipe(
                map(() => timingObject.readyState),
                filter((readyState) => readyState === 'open'),
                take(1),
                switchMap(() => animationFrame())
            )
            // eslint-disable-next-line rxjs-angular/prefer-async-pipe
            .subscribe(() => {
                const { position } = this._timingObjectService.timingObject.query();
                const index = Math.floor(position / 1000);

                if (index > 0 && this._index !== index) {
                    this._router.navigate([`${index}`], {
                        queryParams: this._router.routerState.snapshot.root.queryParams,
                        relativeTo: this._activatedRoute
                    });
                }
            });

        const activatedChildRoute = this._activatedRoute.firstChild;

        if (activatedChildRoute !== null) {
            const index = parseInt(activatedChildRoute.snapshot.url[0].path, 10);

            this._index = index;
            this.transition = { params: NO_TRANSITION_PARAMS, value: index };
        }
    }

    private _goToNextSlide(): void {
        if (this._index < 26) {
            this._router.navigate([`${this._index + 1}`], {
                queryParams: this._router.routerState.snapshot.root.queryParams,
                relativeTo: this._activatedRoute
            });
        }
    }

    private _goToPreviousSlide(): void {
        if (this._index > 1) {
            this._router.navigate([`${this._index - 1}`], {
                queryParams: this._router.routerState.snapshot.root.queryParams,
                relativeTo: this._activatedRoute
            });
        }
    }

    private _setIndexAndTransition(): void {
        const activatedChildRoute = this._activatedRoute.firstChild;

        if (activatedChildRoute !== null) {
            const newIndex = parseInt(activatedChildRoute.snapshot.url[0].path, 10);
            const direction = newIndex > this._index ? 'forwards' : 'backwards';

            this._index = newIndex;

            if (this._isPreferingReducedMotion || (direction === 'forwards' && EXCLUDED_FORWARD_TRANSITIONS.includes(newIndex))) {
                this.transition = { params: NO_TRANSITION_PARAMS, value: newIndex };
            } else {
                const nativeWindow = this._windowService.nativeWindow;
                const isPortrait = nativeWindow !== null && nativeWindow.innerWidth / nativeWindow.innerHeight <= 16 / 9;
                const distance = isPortrait ? '108%' : '108vw';

                this.transition = {
                    params: {
                        duration: '0.5s',
                        enterTransform: direction === 'forwards' ? `translateX(${distance})` : `translateX(-${distance})`,
                        leaveTransform: direction === 'forwards' ? `translateX(-${distance})` : `translateX(${distance})`,
                        top: isPortrait ? '3.9vw' : '6.9333333333vh',
                        width: isPortrait ? '92.2%' : '163.9111111111vh'
                    },
                    value: newIndex
                };
            }
        }
    }
}
