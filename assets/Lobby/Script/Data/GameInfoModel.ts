

export class GameInfoModel {

    private static instance: GameInfoModel = null;

    private _curGame: string;
    private roomGameID: number;
    constructor() {
        console.log('hello GameInfoModel');
        this.curGame = "Lobby";
        this.roomGameID = 1;
    }

    public static Instance() {
        if (this.instance == null) {
            this.instance = new GameInfoModel();
        }
        return this.instance;
    }

    public get curGame(): string {
        return this._curGame;
    }

    public set curGame(game) {
        this._curGame = game;
    }

    public getRoomGameID() {
        return this.roomGameID;
    }

    public setRoomGameID(gameID) {
        this.roomGameID = gameID;
    }
}
