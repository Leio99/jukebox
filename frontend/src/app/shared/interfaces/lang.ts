import { ILanguage } from "dolfo-angular"

export enum Lang{
    IT = "it",
    EN = "en"
}

export const LANGUAGES: ILanguage[] = [{
    locale: Lang.IT,
    name: Lang.IT
}, {
    locale: Lang.EN,
    name: Lang.EN
}]