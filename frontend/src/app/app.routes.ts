import { inject } from "@angular/core"
import { Routes } from "@angular/router"
import { TitleService } from "./shared/services"
import { RouteCheckService } from "./shared/services/route-check.service"

export const ROOT_PATH = ""
export const JOIN_PATH = "join"

export const routes: Routes = [
    {
        path: JOIN_PATH,
        canActivate: [RouteCheckService],
        pathMatch: "full",
        loadComponent: () => import("./components/join-room.component").then(m => m.JoinRoomComponent),
        title: () => inject(TitleService).getTitle("join.title")
    },
    {
        path: ROOT_PATH,
        canActivate: [RouteCheckService],
        pathMatch: "full",
        loadComponent: () => import("./components/home/home.component").then(m => m.HomeComponent),
        title: () => inject(TitleService).getTitle("playlist.title")
    },
    {
        path: "**",
        pathMatch: "full",
        redirectTo: ""
    }
]