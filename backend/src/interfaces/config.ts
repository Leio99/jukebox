export interface IConfig{
    readonly configuration: {
        readonly server: {
            readonly port: number
        }
    }
}

export interface IEnv{
    readonly HTTPS: string
    readonly SERVER_PORT: string
}