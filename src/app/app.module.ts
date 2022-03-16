import {NgModule} from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MediaItemComponent } from './media-item.component';


@NgModule({
  imports: [
    BrowserModule
  ], //bring in any other modules that the module will need.
  declarations: [
    AppComponent,
    MediaItemComponent
  ], //used to make components, directives, and pipes available to the module that don't come from another module.
  bootstrap: [
    AppComponent
  ] //for a root model will let know which component or components will be the starting point of the app
})
export class AppModule {}
