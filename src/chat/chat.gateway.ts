import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken'

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer(
  )
  server: Server;



  handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization
    let result = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true })
    if(!result){
      client.conn.close()
    }

    console.log(`Client connected: ${client.id}`);


  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.server.to(room).emit('userJoined', `${client.id} has joined the room, ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    this.server.to(room).emit('userLeft', `${client.id} has left the room.`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, data) {
    console.log(data.message)
    this.server.to(data.room).emit('newMessage', `${client.id}: ${data.message}`);
  }
}

