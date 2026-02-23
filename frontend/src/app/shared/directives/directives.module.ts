import { NgModule } from "@angular/core"
import { NavigateDirective } from "./navigate.directive"

@NgModule({
    declarations: [NavigateDirective],
    exports: [NavigateDirective]
})
export class DirectivesModule{}