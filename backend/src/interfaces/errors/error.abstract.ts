import { StatusCode } from "../status-code"

export abstract class ErrorAbstract extends Error{
    protected abstract readonly statusCode: StatusCode

    constructor(public message: string){
        super(message)
    }

    public getStatusCode = () => this.statusCode 
}