import { WebSocket } from "ws"
import { Rooms } from "../interfaces/room"
import { WsMessage, WsMessageType } from "../interfaces/ws-message"

export class WsClient{
    private server: {
        readonly getRoom: () => Rooms[string]
        readonly updateRoom: (room: Rooms[string]) => void
        readonly sendToRoom: (msg: WsMessage) => void
    }

    constructor(private userId: string, private connection: WebSocket){
        connection.on("message", b => this.onMessage(b.toString()))
    }

    public setServer = (server: typeof this.server) => this.server = server

    public getUserId = () => this.userId

    private onMessage = (message: string) => {
        try{
            const msg = JSON.parse(message) as WsMessage

            if(!msg.hasOwnProperty("type") || !msg.hasOwnProperty("data") || !Object.values(WsMessageType).includes(msg.type))
                throw new Error("Proprietà non valide!")

            this.manageMsg(msg)
        }catch(e){
            console.error(e)
            console.error("Messaggio non valido: ", message)
        }
    }

    private manageMsg = ({ type, data }: WsMessage) => {
        if(type === WsMessageType.ADD_SONG){
            const room = this.server.getRoom()

            if(room.songs.some(d => d.id === data.id)){
                return this.send({
                    type: WsMessageType.ERROR,
                    data: { msg: "songDuplicate" }
                }, false)
            }

            const songs = room.songs.concat(data)

            this.server.updateRoom({
                ...room,
                songs
            })

            this.send({
                type: WsMessageType.UPDATED_PLAYLIST,
                data: songs
            })
        }else if(type === WsMessageType.END_SONG || type === WsMessageType.REMOVE_SONG){
            const room = this.server.getRoom(),
            songs = room.songs.filter(d => d.id !== data)

            this.server.updateRoom({
                ...room,
                songs
            })

            this.send({
                type: WsMessageType.UPDATED_PLAYLIST,
                data: songs
            })
        }else if(type === WsMessageType.ADD_SONG_FIRST){
            const room = this.server.getRoom(),
            songs = [data, ...room.songs]

            this.server.updateRoom({
                ...room,
                songs
            })

            this.send({
                type: WsMessageType.UPDATED_PLAYLIST,
                data: songs
            })
        }
    }

    public send = (message: WsMessage, toRoom = true) => {
        this.connection.send(JSON.stringify(message))

        if(toRoom)
            this.server.sendToRoom(message)
    }
}
