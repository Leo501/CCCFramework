export class Utils {

    public static random(mix: number, max: number) {
        let num = mix + (max - mix) * Math.random();
        return Math.floor(num);
    }
}