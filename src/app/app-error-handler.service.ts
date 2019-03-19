import { ErrorHandler, Injectable, InjectionToken, Injector } from '@angular/core';
import * as Rollbar from 'rollbar';

const rollbarConfig = {
    // accessToken: '6dbfa96a77884d0ea254f713ad05960a',
    captureUncaught: false,
    captureUnhandledRejections: false
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    handleError(err: any): void {
        const rollbar = this.injector.get(RollbarService);
        rollbar.error(err.originalError || err);
    }
}

export function rollbarFactory() {
    return new Rollbar(rollbarConfig);
}
