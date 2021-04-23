import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { NGRX_COLOQUENT_VARIABLE_KEY } from "./config";
import { VariableReducer } from "./variable.reducer";
import { GlobalVariableService } from "./varialbe-global.service";

@NgModule({
    imports: [
        StoreModule.forFeature(NGRX_COLOQUENT_VARIABLE_KEY, VariableReducer)
    ],
    providers: [GlobalVariableService]
})
export class NgrxColoquentVariableModule {}
