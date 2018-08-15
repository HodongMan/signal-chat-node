import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIO from 'socket.io';

import { Message } from './models/message';

export class ChatServer {

    public static readonly PORT: number = 7000;
    private app: express.Application;
    private server: Server;
    private io: socketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp() {
        this.app = express();
    }

    private createServer() {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIO(this.server);
    }

    private listen(): void {

        /*
            정확한 logging 등을 원하면 console.log를 다 바꿔야한다.
        */

        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }

}