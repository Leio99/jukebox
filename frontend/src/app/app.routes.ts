import { Routes } from "@angular/router"
import { RouteCheckService } from "./shared/services/route-check.service"

export const ROOT_PATH = ""
export const JOIN_PATH = "join"

export const routes: Routes = [
    {
        path: JOIN_PATH,
        canActivate: [RouteCheckService],
        pathMatch: "full",
        loadComponent: () => import("./components/join-room.component").then(m => m.JoinRoomComponent)
    },
    {
        path: ROOT_PATH,
        canActivate: [RouteCheckService],
        pathMatch: "full",
        loadComponent: () => import("./components/home/home.component").then(m => m.HomeComponent)
    },
    {
        path: "**",
        pathMatch: "full",
        redirectTo: ""
    }
]