import { StatusCode } from "../status-code"
import { ErrorAbstract } from "./error.abstract"

export class ErrorUnauthorized extends ErrorAbstract{
    protected readonly statusCode = StatusCode.UNAUTHORIZED
}