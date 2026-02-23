export interface WsMessage{
    readonly type: WsMessageType
    readonly data: any
}

export enum WsMessageType{ CONNECTED, ERROR, UPDATED_PLAYLIST, ADD_SONG, END_SONG, ADD_SONG_FIRST, REMOVE_SONG, NEW_OWNER }