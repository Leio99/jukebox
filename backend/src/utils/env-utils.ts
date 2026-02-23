import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import _ from "lodash"
import { IConfig, IEnv } from "../interfaces/config"

export const getCfgUrl = (dir: string) => dir + "config.xml"

export const initENV = (dir: string, bypass = false) => new Promise<IConfig>((resolve, reject) => {
    const path = getCfgUrl(dir)

    fs.readFile(path, "utf-8", (err, data) => {
        if(err){
            return reject({
                message: "File di configurazione non trovato:\n" + path,
                missing: true
            })
        }

        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
            allowBooleanAttributes: true
        }),
        config = parser.parse(data) as IConfig

        if(bypass)
            return resolve(config)

        if(!config.configuration)
            reject({ message: "Nessuna configurazione trovata!" })
        else if(!config.configuration.server)
            reject({ message: "Nessuna configurazione del server!" })
        else if(
            !config.configuration.server.port ||
            !config.configuration.server.tokenKey ||
            !config.configuration.server.url
        )
            reject({ message: "Configurazione del server incompleta!" })
        else{
            const { server } = config.configuration

            setENVServer(server)

            resolve(config)
        }
    })  
})

const setENVServer = (config: IConfig["configuration"]["server"]) => {
    process.env.SERVER_PORT = config.port.toString()
    process.env.SECRET_KEY = config.tokenKey
    process.env.SERVER_URL = config.url
    
    if(config.url.toLowerCase().startsWith("https"))
        process.env.HTTPS = "true"
    else
        delete process.env.HTTPS
}

export const getEnv = (): IEnv => {
    const env = process.env

    return _.pick(env, [
        "HTTPS",
        "SERVER_PORT",
        "SECRET_KEY",
        "SERVER_URL"
    ])
}