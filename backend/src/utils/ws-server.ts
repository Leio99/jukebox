import * as http from "http"
import * as https from "https"
import _ from "lodash"
import randomatic from "randomatic"
import { v4 } from "uuid"
import { WebSocketServer } from "ws"
import { Rooms } from "../interfaces/room"
import { WsMessage, WsMessageType } from "../interfaces/ws-message"
import { WsClient } from "./ws-client"

export class WsServer{
    private clients: WsClient[] = []
    private rooms: Rooms = {}

    constructor(server: http.Server | https.Server){
        const ws = new WebSocketServer({ server })

        setInterval(() => {
            console.log("Controllo se ci sono stanze vuote...")

            Object.entries(this.rooms).forEach(([roomId, room]) => {
                if(room.users.length === 0)
                    delete this.rooms[roomId]
            })
        }, 60000)
        
        ws.on("connection", (connection, request) => {
            const userId = v4(),
            client = new WsClient(userId, connection)

            let roomId = new URLSearchParams(request.url).get("/?roomId")

            if(roomId && !Object.keys(this.rooms).includes(roomId)){
                client.send({
                    type: WsMessageType.ERROR,
                    data: { msg: "roomNotFound" }
                }, false)
                return
            }

            console.log("NUOVA CONNESSIONE", userId, "- Origine:", request.headers.origin)

            this.clients.push(client)

            if(roomId)
                this.rooms[roomId].users.push({ id: userId, owner: false })
            else{
                roomId = randomatic("A0", 6)

                while(Object.keys(this.rooms).includes(roomId))
                    roomId = randomatic("A0", 6)

                this.rooms[roomId] = { users: [{ id: userId, owner: true }], songs: [] }
            }

            console.log("CONNESSIONE ACCETTATA:", userId)

            client.setServer({
                getRoom: () => this.rooms[roomId],
                updateRoom: room => this.rooms = { ...this.rooms, [roomId]: room },
                sendToRoom: (msg: WsMessage) => this.rooms[roomId].users.forEach(us => this.send(msg, us.id))
            })

            this.send({
                type: WsMessageType.CONNECTED,
                data: {
                    id: userId,
                    roomId,
                    songs: this.rooms[roomId].songs,
                    isOwner: this.rooms[roomId].users.length === 1
                }
            }, userId)

            connection.on("close", () => {
                this.disconnectClient(userId, roomId)
                
                console.log("CONNESSIONE CHIUSA:", userId)
            })
        })
    }
    
    private send = (msg: WsMessage, clientId?: string) => this.clients
        .filter(c => !clientId || c.getUserId() === clientId)
        .forEach(client => client.send(msg, false))

    private disconnectClient = (id: string, roomId: string) => {
        this.clients = this.clients.filter(c => c.getUserId() !== id)
        this.rooms[roomId] = {
            ...this.rooms[roomId],
            users: this.rooms[roomId].users.filter(u => u.id !== id)
        }

        if(this.rooms[roomId].users.length > 0 && this.rooms[roomId].users.every(u => !u.owner)){
            const newOwner = _.sample(this.rooms[roomId].users)
            this.rooms[roomId] = {
                ...this.rooms[roomId],
                users: this.rooms[roomId].users.map(u => u.id === newOwner.id ? { ...u, owner: true } : u)
            }

            this.send({
                type: WsMessageType.NEW_OWNER,
                data: newOwner.id
            })
        }
    }
}
