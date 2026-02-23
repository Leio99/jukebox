import { Directive, ElementRef, Input, SimpleChanges } from "@angular/core"
import { Router } from "@angular/router"
import { Subscriptable } from "dolfo-angular"
import { filter, fromEvent } from "rxjs"
import { environment } from "../../../environments/environment"
import { StoreService } from "../services"

@Directive({
    selector: "[jkNavigate]",
    standalone: false
})
export class NavigateDirective extends Subscriptable{
    @Input({ required: true, alias: "jkNavigate" }) url: string
    private isLink: boolean

    constructor(storeService: StoreService, private elementRef: ElementRef<HTMLElement>, router: Router) {
        super()

        this.isLink = elementRef.nativeElement.tagName.toLocaleLowerCase() === "a"

        this.addSubscription(fromEvent<MouseEvent>(elementRef.nativeElement, "click").subscribe(e => {
            if(this.isLink)
                e.preventDefault()
            
            if(storeService.isPressingCtrl())
                this.openBlank()
            else
                router.navigateByUrl(this.url)
        }))

        this.addSubscription(fromEvent<MouseEvent>(elementRef.nativeElement, "mousedown").pipe(
            filter(e => e.button === 1 && !this.isLink)
        ).subscribe(() => this.openBlank()))
    }
    
    ngOnChanges(changes: SimpleChanges){
        if((this.isLink || (changes.url && changes.url.currentValue !== this.url)) && !!this.url)
            this.elementRef.nativeElement.setAttribute("href", this.url)
    }

    private openBlank = () => window.open(environment.PUBLIC_URL + this.url, "_blank")
}