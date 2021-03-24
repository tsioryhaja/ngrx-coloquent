import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { NGRX_COLOQUENT_VARIABLE_KEY } from "./ngrx/reducers/variables/config";
import { VariableReducer } from "./ngrx/reducers/variables/variable.reducer";
import { GlobalVariableService } from "./ngrx/reducers/variables/varialbe-global.service";

@NgModule({
    imports: [
        StoreModule.forFeature(NGRX_COLOQUENT_VARIABLE_KEY, VariableReducer)
    ],
    providers: [GlobalVariableService]
})
export class NgrxColoquentVariableModule {}
