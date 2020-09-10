import { Component } from '@angular/core';

@Component({
    selector: 'mw-app', //DOM Element selector for rendering
    templateUrl: './app.component.html',
    styles: [
        `
        h1 { color: #ffffff; }
        `,
        `
        .description { 
            font-style: italic;
            color: green; 
        }
        `
    ] //Array of styles to be applied to the HTML provided through either the template or templateUrl metadata
}) 
export class AppComponent {}