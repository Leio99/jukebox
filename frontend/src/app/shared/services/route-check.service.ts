import { Injectable } from "@angular/core"
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router"
import { AuthService, StoreService } from "./"

@Injectable({
    providedIn: "root"
})
export class RouteCheckService implements CanActivate{
    constructor(private storeService: StoreService, private authService: AuthService){}

    public canActivate({ routeConfig }: ActivatedRouteSnapshot) {
        if(!this.storeService.isInitialized())
            return false

        return this.authService.checkRoute(routeConfig.path)
    }
}