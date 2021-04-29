import { Injectable, InjectionToken, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createAction, props } from "@ngrx/store";
import { EMPTY, Observable } from "rxjs";
import { concatMap } from "rxjs/operators";

export interface NgrxColoquentBaseRequestErrorInterface {
    call(originAction, error);
}

export const NGRX_COLOQUENT_BASE_ERROR = new InjectionToken<NgrxColoquentBaseRequestErrorInterface[]>('NGRX_COLOQUENT_BASE_ERROR');

export const notifyErrorAction = createAction('[Effect Service] Display Error', props<{error: any, origin: any}>());

@Injectable()
export class NgrxColoquentBaseError {
    protected errorProcesses: NgrxColoquentBaseRequestErrorInterface[] = [];

    constructor(
        protected actions$: Actions,
        protected injector: Injector
    ) {
        this.errorProcesses = injector.get(NGRX_COLOQUENT_BASE_ERROR, [])
    }

    executeErrors(origin, error) {
        if (this.errorProcesses.length) {
            this.errorProcesses.forEach(
                (obj) => {
                    obj.call(origin, error);
                }
            );
        }
    }

    notifyError$ = createEffect(
        () => this.actions$.pipe(
            ofType(notifyErrorAction),
            concatMap((action: any) => {
                this.executeErrors(action.origin, action.error);
                return this.returnEmpty();
            })
        )
    );

    returnEmpty(): Observable<any> {
        return EMPTY;
    }
}