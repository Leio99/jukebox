import cors from "cors"
import express, { Express, json, NextFunction, Request, Response } from "express"
import * as fs from "fs"
import * as http from "http"
import * as https from "https"
import { StatusCode } from "../interfaces/status-code"
import { getEnv } from "./env-utils"
import { colorLog, LogColor } from "./logger"
import { WsServer } from "./ws-server"

export class ServerRouter {
    private router: Express

    constructor() {
        this.router = express()
        
        this.router.use(express.json({ limit: "50mb" }))

        this.router.use(cors({
            origin: "*",
            optionsSuccessStatus: StatusCode.SUCCESS,
            methods: ["GET", "POST", "PUT", "DELETE"]
        }))

        this.router.use(json())
        this.router.use(this.apiInterceptor())
    }

    private baseLogMsg = (r: Request) => `[${colorLog(new Date().toJSON(), LogColor.MAGENTA)}] ${colorLog(r.method.toUpperCase(), LogColor.GREEN)} ${colorLog(r.path, LogColor.YELLOW)}`

    private apiInterceptor = () => async (req: Request, _res: Response, next: NextFunction) => {
        console.log(this.baseLogMsg(req), colorLog("INIT", LogColor.GREEN), "api")

        req.on("end", () => console.log(this.baseLogMsg(req), colorLog("CLOSE", LogColor.CYAN), "api"))

        next()
    }

    public listen = () => {
        const { SERVER_PORT, HTTPS } = getEnv(),
        server = !HTTPS ? http.createServer() : https.createServer(),
        addS = HTTPS ? "S" : ""

        if (HTTPS) {
            const key = fs.readFileSync("cert/key.pem").toString(),
            cert = fs.readFileSync("cert/cert.pem").toString(),
            httpsServer = server as https.Server

            httpsServer.setSecureContext({ key, cert })
        }

        server.on("request", this.router)
        server.on("error", err => console.error("INTERNAL SERVER ERROR", err))

        new WsServer(server)

        server.listen(SERVER_PORT, () => console.log(`Server HTTP${addS} e WS in ascolto sulla porta ${SERVER_PORT}!`))
    }

    public static getServerURL = () => {
        const { SERVER_URL, SERVER_PORT } = getEnv()
        return `${SERVER_URL}:${SERVER_PORT}`
    }

    public static checkAlive = () => fetch(this.getServerURL())
}