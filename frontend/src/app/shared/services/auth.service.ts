import { inject, Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { NotificationService, TranslateService } from "dolfo-angular"
import { BehaviorSubject, Observable } from "rxjs"
import { environment } from "../../../environments/environment"
import { JOIN_PATH, ROOT_PATH } from "../../app.routes"
import { User, WsMessage, WsMessageType } from "../interfaces"
import { CustomDialogService } from "./custom-dialog.service"

@Injectable({
    providedIn: "root"
})
export class AuthService{
    private router = inject(Router)
    private notificationService = inject(NotificationService)
    private translateService = inject(TranslateService)
    private customDialogService = inject(CustomDialogService)
    private user$ = new BehaviorSubject<User>(null)
    private ws: WebSocket
    
    public join$ = (roomId?: string) => new Observable(obs => {
        this.ws = new WebSocket(`${environment.WS_URL}${roomId ? `?roomId=${roomId}` : ""}`)
        this.ws.onopen = () => console.log("Connesso al WS!")
        this.ws.onclose = () => {
            console.log("Disconnesso dal WS!")
            this.logout()
        }
        this.ws.onerror = e => console.error("Errore WS!", e)
        this.ws.onmessage = m => {
            if(!obs.closed){
                obs.next(null)
                obs.complete()
            }
            
            this.manageWsMessage(JSON.parse(m.data) as WsMessage)
        }
    })

    private manageWsMessage = ({ type, data }: WsMessage) => {
        if(type === WsMessageType.ERROR){
            this.notificationService.show({
                type: "error",
                message: this.translateService.translate("errors." + data.msg)
            })
        }else if(type === WsMessageType.CONNECTED){
            this.user$.next(data as User)
            this.checkCurrentRoute()
        }else if(type === WsMessageType.UPDATED_PLAYLIST){
            this.user$.next({
                ...this.user$.getValue(),
                songs: data
            })
        }else if(type === WsMessageType.NEW_OWNER){
            this.user$.next({
                ...this.user$.getValue(),
                isOwner: true
            })

            this.notificationService.show({
                type: "info",
                message: this.translateService.translate("room.newOwner")
            })
        }
    }

    public sendMessage = (type: WsMessageType, data: any) => this.ws.send(JSON.stringify({ type, data }))

    public logout = () => {
        this.customDialogService.closeLatestDialog()
        this.user$.next(null)
        this.checkCurrentRoute()
    }

    public checkCurrentRoute = () => {
        const { url } = this.router
        this.checkRoute(url.substring(1, url.length))
    }

    public getUser = () => this.user$.getValue()

    public getUser$ = () => this.user$.asObservable()

    public checkRoute = (path: string) => {
        const user = this.getUser()

        if(path === JOIN_PATH && !!user)
            return this.router.navigateByUrl(ROOT_PATH)
        if(path !== JOIN_PATH && !user)
            return this.router.navigateByUrl(JOIN_PATH)

        return Promise.resolve(true)
    }
}