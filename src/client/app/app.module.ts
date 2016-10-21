import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef, ComponentRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { BASE_HREF } from 'core/settings/common.settings';

import { AppRoutingModule } from 'app-routing.module';
import { CoreModule } from 'core/modules/core.module';

import { IHmrStore } from 'core/types/hmr-store.type';

import { HomeModule } from 'home/home.module';

import { AppComponent } from 'app.component';



@NgModule({
    bootstrap: [
        AppComponent,
    ],

    declarations: [
        AppComponent,
    ],

    imports: [
        AppRoutingModule,
        BrowserModule,
        CoreModule.forRoot(),
        HomeModule,
    ],

    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: BASE_HREF,
        },
    ],
})
/**
 * Our application module.
 *
 * Handles the bootstrapping and declaration of everything.
 */
export class AppModule {
    /**
     * Construct the application module.
     *
     * @constructs AppModule
     *
     * @param {ApplicationRef} _appRef The application reference.
     */
    constructor(private _appRef: ApplicationRef) {}


    hmrAfterDestroy(_HmrStore: IHmrStore): void {
        // Display new elements
        _HmrStore.disposeOldHosts();
        delete _HmrStore.disposeOldHosts;
    }

    hmrOnDestroy(_HmrStore: IHmrStore): void {
        let cmpLocation: ComponentRef<{}>[] = this._appRef.components.map((cmp: ComponentRef<{}>) => {
            return cmp.location.nativeElement;
        });

        // Recreate elements
        _HmrStore.disposeOldHosts = createNewHosts(cmpLocation);

        // Remove styles
        removeNgStyles();
    }

    hmrOnInit(_HmrStore: IHmrStore): void {
        if (!_HmrStore || !_HmrStore.state) {
            return;
        }
        this._appRef.tick();
    }
}
