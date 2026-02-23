export interface IConfig{
    readonly configuration: {
        readonly server: {
            readonly url: string
            readonly port: number
            readonly tokenKey: string
        }
    }
}

export interface IEnv{
    readonly HTTPS: string
    readonly SERVER_PORT: string
    readonly SECRET_KEY: string
    readonly SERVER_URL: string
}