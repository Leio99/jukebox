import { StatusCode } from "../status-code"
import { ErrorAbstract } from "./error.abstract"

export class ErrorForbidden extends ErrorAbstract{
    protected readonly statusCode = StatusCode.FORBIDDEN
}