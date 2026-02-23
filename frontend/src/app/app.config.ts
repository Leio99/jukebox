import { APP_BASE_HREF, registerLocaleData } from "@angular/common"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import localeIt from '@angular/common/locales/it'
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core"
import { provideRouter, withDisabledInitialNavigation, withViewTransitions } from "@angular/router"
import { ICON_COMPONENT, provideDolfoLanguages } from "dolfo-angular"
import { environment } from "../environments/environment"
import { routes } from "./app.routes"
import { MyIconComponent } from "./components/icon.component"
import { errorInterceptor } from "./shared/interceptors/error.interceptor"
import { Lang, LANGUAGES } from "./shared/interfaces"

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: APP_BASE_HREF, useValue: environment.PUBLIC_URL },
        { provide: ICON_COMPONENT, useValue: MyIconComponent },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withDisabledInitialNavigation(), withViewTransitions()),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideDolfoLanguages(LANGUAGES, Lang.IT)
    ]
}

registerLocaleData(localeIt)