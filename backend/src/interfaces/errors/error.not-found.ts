import { StatusCode } from "../status-code"
import { ErrorAbstract } from "./error.abstract"

export class ErrorNotFound extends ErrorAbstract{
    protected readonly statusCode = StatusCode.NOT_FOUND
}