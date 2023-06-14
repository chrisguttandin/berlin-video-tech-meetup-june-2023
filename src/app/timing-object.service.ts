import { Injectable } from '@angular/core';
import { TimingObject } from 'timing-object';
import { TimingProvider } from 'timing-provider';

@Injectable({
    providedIn: 'root'
})
export class TimingObjectService {
    public readonly timingObject = new TimingObject(new TimingProvider('pM47wfJhgXpR3sP8JoyT'));
}
