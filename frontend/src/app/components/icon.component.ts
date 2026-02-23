import { ChangeDetectionStrategy, Component, Input } from "@angular/core"
import { AnimationProp, FaIconComponent, IconDefinition } from "@fortawesome/angular-fontawesome"
import { faCaretDown, faCheck, faCopy, faEllipsisV, faPen, faPencil, faQuestionCircle, faSpinner, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { IconName } from "dolfo-angular"

@Component({
    selector: "trip-icon",
    standalone: true,
    imports: [FaIconComponent],
    template: `<fa-icon [icon]="getIcon()" [animation]="animation"></fa-icon>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyIconComponent{
    @Input({ required: true }) name: IconName
    
    public animation: AnimationProp

    ngOnInit(){
        if(this.name.startsWith("spinner"))
            this.animation = "spin"
    }

    public getIcon = (): IconDefinition => {
        if(this.name.startsWith("spinner"))
            return faSpinner
        if(this.name === "bin2")
            return faTrash
        if(this.name === "pencil")
            return faPencil
        if(this.name === "flickr")
            return faEllipsisV
        if(this.name === "checkmark")
            return faCheck
        if(this.name === "cross")
            return faXmark
        if(this.name === "copy")
            return faCopy
        if(this.name === "circle-down")
            return faCaretDown
        if(this.name === "pen")
            return faPen
        if(this.name === "bin")
            return faTrash

        return faQuestionCircle
    }
}