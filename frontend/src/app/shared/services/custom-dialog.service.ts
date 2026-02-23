import { Injectable } from "@angular/core"
import { DialogActionType, DialogComponentInput, DialogService, IDialogInput, TranslateService } from "dolfo-angular"
import { catchError, delay, filter, mergeMap, Observable, ObservableInput, of, tap, throwError } from "rxjs"

@Injectable({
    providedIn: "root"
})
export class CustomDialogService{
    constructor(private dialogService: DialogService, private translateService: TranslateService){}

    public showLoading$ = <T, T2>(obs: (res: T2) => Observable<T>) => mergeMap<T2, ObservableInput<T>>(res => of(res).pipe(
        delay(0),
        tap(() => this.dialogService.showLoading().subscribe()),
        mergeMap(res => obs(res)),
        catchError(err => {
            this.closeLatestDialog()
            return throwError(() => err)
        })
    ))

    public hideLoading = () => this.closeLatestDialog()

    public closeLatestDialog = () => this.dialogService.close()

    public closeWithAction = <T>(data: T) => {
        this.dialogService.action({ type: DialogActionType.OK, data })
        this.closeLatestDialog()
    }

    public openDialogComponent = (component: DialogComponentInput) => this.dialogService.openDialogComponent(component)

    public openDialog = (input: IDialogInput) => this.dialogService.openDialog(input)

    public askConfirmAndLoad = (
        input: Pick<IDialogInput, "title" | "message" | "hideCloseX" | "width">,
        obs: (resp: DialogActionType) => Observable<unknown>,
        getDialogResp = false
    ) => this.dialogService.openDialog({
        title: this.translateService.translate(input.title),
        message: this.translateService.translate(input.message),
        type: "confirm",
        hideCloseX: input.hideCloseX,
        width: input.width
    }).pipe(
        filter(res => res.type === DialogActionType.OK || getDialogResp),
        this.showLoading$(res => obs(res.type)),
        tap(() => this.hideLoading())
    )
}