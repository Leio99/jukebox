import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import _ from "lodash"
import { IConfig, IEnv } from "../interfaces/config"

export const getCfgUrl = (dir: string) => dir + "config.xml"

export const initENV = (dir: string, bypass = false) => new Promise<void>((resolve, reject) => {
    const path = getCfgUrl(dir)

    fs.readFile(path, "utf-8", (err, data) => {
        if(err){
            process.env.SERVER_PORT = "3001"

            console.log("Configurazione mancante, uso la porta di default (3001)")
            return resolve()
        }

        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
            allowBooleanAttributes: true
        }),
        config = parser.parse(data) as IConfig

        if(bypass)
            return resolve()

        if(!config.configuration)
            reject({ message: "Nessuna configurazione trovata!" })
        else if(!config.configuration.server)
            reject({ message: "Nessuna configurazione del server!" })
        else if(!config.configuration.server.port)
            reject({ message: "Configurazione del server incompleta!" })
        else{
            const { server } = config.configuration

            setENVServer(server)

            resolve()
        }
    })  
})

const setENVServer = (config: IConfig["configuration"]["server"]) => {
    process.env.SERVER_PORT = config.port.toString()
}

export const getEnv = (): IEnv => {
    const env = process.env

    return _.pick(env, [
        "HTTPS",
        "SERVER_PORT"
    ])
}