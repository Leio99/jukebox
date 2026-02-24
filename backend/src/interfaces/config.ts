export interface IConfig{
    readonly configuration: {
        readonly server: {
            readonly url: string
            readonly port: number
        }
    }
}

export interface IEnv{
    readonly HTTPS: string
    readonly SERVER_PORT: string
    readonly SERVER_URL: string
}