import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { McButtonModule } from '@ptsecurity/mosaic/button';

import { McFormFieldModule } from '../../mosaic/form-field';
import { McIconModule } from '../../mosaic/icon';
import { McInputModule } from '../../mosaic/input/';


@Component({
    selector: 'app',
    template: require('./template.html'),
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./styles.scss']
})
export class InputDemoComponent {
    value: string = '';
    numberValue: number | null = null;
    min = -5;
}


@NgModule({
    declarations: [
        InputDemoComponent
    ],
    imports: [
        BrowserModule,
        McButtonModule,
        McInputModule,
        McFormFieldModule,
        FormsModule,
        McIconModule
    ],
    bootstrap: [
        InputDemoComponent
    ]
})
export class InputDemoModule {}

// tslint:disable:no-console
platformBrowserDynamic()
    .bootstrapModule(InputDemoModule)
    .catch((error) => console.error(error));

