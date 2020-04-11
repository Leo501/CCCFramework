import { GameInfoModel } from "../Data/GameInfoModel";
import { ConstValue } from "../Base/ConstValue";

export class AudioMgr {
    private static instance: AudioMgr = new AudioMgr();

    private bgm: string = "";

    private sound: string = "";

    private _mgmVolume: number = 0.5;

    private _soundVolume: number = 0.5;

    private _root: string = '';

    public static Instance(): AudioMgr {
        // if (this.instance == null) {
        //     this.instance = new AudioMgr();
        // }
        return this.instance;
    }

    constructor() {
        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, () => {
            this.resumeAll();
        });

        this._mgmVolume = cc.sys.localStorage.getItem('bgmVolume') || this._mgmVolume;
        this._soundVolume = cc.sys.localStorage.getItem('soundVolume') || this._soundVolume;

        this._root = GameInfoModel.Instance().curGame + "/" + ConstValue.AUDIO_DIR;

        cc.audioEngine.setMusicVolume(this._mgmVolume);
        cc.audioEngine.setEffectsVolume(this._soundVolume);

    }

    public setBGMVolume(volume) {
        this._mgmVolume = volume;
        cc.audioEngine.setMusicVolume(volume);
        cc.sys.localStorage.setItem('bgmVolume');
    }

    public getBGMVolume() {
        return this._mgmVolume;
    }

    public setSoundVolume(volume) {
        this._soundVolume = volume;
        cc.audioEngine.setEffectsVolume(volume);
        cc.sys.localStorage.setItem('soundVolume');
    }

    public getSoundVolume() {
        return this._soundVolume;
    }

    public pauseAll() {
        cc.audioEngine.pauseAll();
    }

    public resumeAll() {
        cc.audioEngine.resumeAll();
    }

    public playSound(soundName: string, loop?: boolean, volume?: number) {

        if (this._soundVolume <= 0) {
            return;
        }
        // if (this.sound == soundName) return;

        this.sound = soundName;

        let path = this._root + soundName;

        cc.loader.loadRes(path, cc.AudioClip, (err, clip) => {
            if (err) {
                cc.error(err);
                return;
            }
            var audioID = cc.audioEngine.play(clip, loop ? loop : false, volume ? volume : this._soundVolume);
        });
    }

    public playBGM(soundName: string) {

        if (this._mgmVolume <= 0) {
            return;
        }

        if (this.bgm == soundName) return;

        this.bgm = soundName;

        let path = this._root + soundName;

        cc.audioEngine.stopMusic();

        cc.loader.loadRes(path, cc.AudioClip, (err, clip) => {
            if (err) {
                cc.error(err);
                return;
            }
            cc.audioEngine.playMusic(clip, true);
        });
    }

    public resumeBGM() {
        cc.audioEngine.stopMusic();
        let path = this._root + this.bgm;
        cc.loader.loadRes(path, cc.AudioClip, (err, clip) => {
            if (err) {
                cc.error(err);
                return;
            }
            cc.audioEngine.playMusic(clip, true);
        });
    }
}