import { CommonModule } from "@angular/common"
import { AfterViewInit, Component, inject, Injector, signal, ViewChild, ViewContainerRef } from "@angular/core"
import { Router, RouterOutlet } from "@angular/router"
import { DialogLayoutModule, GridModule, LayoutModule, OverlayManager, Subscriptable, TranslateService } from "dolfo-angular"
import { concatAll, filter, from, fromEvent, map, tap, zip } from "rxjs"
import { DirectivesModule } from "./shared/directives/directives.module"
import { StoreService } from "./shared/services"

@Component({
    selector: "jk-app",
    imports: [CommonModule, LayoutModule, DirectivesModule, DialogLayoutModule, GridModule, RouterOutlet],
    templateUrl: "./app.component.html"
})
export class AppComponent extends Subscriptable implements AfterViewInit{
    @ViewChild("multiContainer", { read: ViewContainerRef }) container: ViewContainerRef

    public loadingMessage = signal("...")
    private loading = signal(0)
    private translateService = inject(TranslateService)

    private readonly streams = [
        this.translateService.loadFromStorage$().pipe(map(() => this.translateService.translate("starting.translations")))
    ]

    constructor(private injector: Injector, router: Router, storeService: StoreService){
        super()
        
        from(Object.values(this.streams)).pipe(
            concatAll(),
            tap(desc => {
                this.loading.update(item => item + 1)
                this.loadingMessage.set(desc + "...")
            })
        ).subscribe(() => {
            if(this.loading() === Object.keys(this.streams).length){
                setTimeout(() => {
                    this.loadingMessage.set(null)
                    storeService.initialize()
                    router.initialNavigation()
                }, 500)
            }
        })

        this.addSubscription(zip([
            fromEvent<KeyboardEvent>(window, "keydown").pipe(
                filter(e => !storeService.isPressingCtrl() && e.ctrlKey),
                tap(() => storeService.setCtrlKey(true))
            ),
            fromEvent<KeyboardEvent>(window, "keyup").pipe(
                filter(e => storeService.isPressingCtrl() && e.key === "Control"),
                tap(() => storeService.setCtrlKey(false))
            ),
            fromEvent<KeyboardEvent>(window, "blur").pipe(
                filter(() => storeService.isPressingCtrl()),
                tap(() => storeService.setCtrlKey(false))
            )
        ]).subscribe())
    }

    ngAfterViewInit(){
        new OverlayManager(this.injector, this.container).init().forEach(s => this.addSubscription(s))
    }

    public get percentage(){
        return (this.loading() * 100) / Object.keys(this.streams).length
    }
}