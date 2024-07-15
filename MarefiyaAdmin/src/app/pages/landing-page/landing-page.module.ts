import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: LandingPageComponent }]),
  ],
})
export class LandingPageModule {}
