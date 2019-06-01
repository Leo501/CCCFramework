

export class GameInfoModel {

    private static instance: GameInfoModel = null;

    private _curGame: string;

    constructor() {
        console.log('hello GameInfoModel');
        this.curGame = "hall";
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
}
