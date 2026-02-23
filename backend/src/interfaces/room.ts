export interface Rooms{
    [roomId: string]: {
        readonly users: {
            readonly id: string
            readonly owner: boolean
        }[]
        readonly songs: {
            readonly id: string
            readonly thumbUrl: string
            readonly channelName: string
            readonly title: string
            readonly datePublished: string
        }[]
    }
}