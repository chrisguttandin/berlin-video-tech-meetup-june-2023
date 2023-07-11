import { Injectable } from '@angular/core';
import { ITimingObject, TimingObject } from 'timing-object';
import { TimingProvider } from 'timing-provider';

@Injectable({
    providedIn: 'root'
})
export class TimingObjectService {
    public readonly timingObject: Pick<
        ITimingObject,
        'addEventListener' | 'dispatchEvent' | 'query' | 'readyState' | 'removeEventListener' | 'update'
    >;

    constructor() {
        try {
            this.timingObject = new TimingObject(new TimingProvider('pM47wfJhgXpR3sP8JoyT'));
        } catch {
            this.timingObject = {
                // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
                addEventListener: () => {},
                dispatchEvent: () => true,
                query: () => ({ acceleration: 0, position: 0, timestamp: 0, velocity: 0 }),
                readyState: 'connecting',
                // eslint-disable-next-line @typescript-eslint/no-empty-function, no-empty-function
                removeEventListener: () => {},
                update: () => Promise.resolve()
            };
        }
    }
}
