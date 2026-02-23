import { Song } from "./video"

export interface User{
    readonly id: string
    readonly roomId: string
    readonly isOwner: boolean
    readonly songs: Song[]
}