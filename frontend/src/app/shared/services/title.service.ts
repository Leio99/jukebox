import { inject, Injectable } from "@angular/core"
import { TranslateService } from "dolfo-angular"

@Injectable({
	providedIn: "root"
})
export class TitleService {
	private translateService = inject(TranslateService)

	public getTitle = (key: string) => `${this.translateService.translate("siteTitle")} | ${this.translateService.translate(key)}`
}
