import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; //Module for interaction with DOM
import { AppComponent } from './app.component';

@NgModule({
    imports: [ //Bring in other modules
        BrowserModule
    ],
    declarations: [ //Make componenets, directives, and pipes available to the module that are not from another module
        AppComponent
    ],
    bootstrap: [ //Entry point of the app code
        AppComponent
    ]
})
export class AppModule {}