export class Utils {

    public static random(mix: number, max: number) {
        return mix + (max - mix) * Math.random();
    }
}