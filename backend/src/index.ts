import { dirname } from "path"
import "reflect-metadata"
import { fileURLToPath } from "url"
import { initENV } from "./utils/env-utils"
import { ServerRouter } from "./utils/server-router"

const getFileDir = (importUrl: string) => {
    const __filename = fileURLToPath(importUrl)
    return dirname(__filename) + "/"
},
indexDir = getFileDir(import.meta.url)

initENV(indexDir)
    .then(async() => {
        const server = new ServerRouter()

        server.listen()

        return server
    })
    .catch(err => console.error("ERRORE INIZIALIZZAZIONE:", err.message))
