import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SlideOneComponent } from './slide-one/slide-one.component';
import { SlideTwoComponent } from './slide-two/slide-two.component';
import { SlidesRoutingModule } from './slides-routing.module';
import { SlidesComponent } from './slides.component';

@NgModule({
    declarations: [
        SlideOneComponent,
        SlidesComponent,
        SlideTwoComponent
    ],
    imports: [CommonModule, SlidesRoutingModule]
})
export class SlidesModule {}
