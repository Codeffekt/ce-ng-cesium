
interface LutsMapTable {
    [key: string]: LutTable
};

type LutTable = [number, string][];

const LUT_MAP_TABLE: LutsMapTable = {
    "rainbow": [[0.0, '#0000FF'], [0.2, '#00FFFF'], [0.5, '#00FF00'], [0.8, '#FFFF00'], [1.0, '#FF0000']],
    "cooltowarm": [[0.0, '#3C4EC2'], [0.2, '#9BBCFF'], [0.5, '#DCDCDC'], [0.8, '#F6A385'], [1.0, '#B40426']],
    "blackbody": [[0.0, '#000000'], [0.2, '#780000'], [0.5, '#E63200'], [0.8, '#FFFF00'], [1.0, '#FFFFFF']],
    "grayscale": [[0.0, '#000000'], [0.2, '#404040'], [0.5, '#7F7F80'], [0.8, '#BFBFBF'], [1.0, '#FFFFFF']],
    "orange": [[0.0, '#F9A365'], [0.2, '#D9834C'], [0.4, '#C55B11'], [0.8, '#C03F3F'], [1.0, '#C02F2F']]
};

export type LutNames = "rainbow" | "cooltowarm" | "blackbody" | "grayscale" | "orange";

export interface LutOptions {
    lut: LutNames;
    nColors: number;
    minV: number;
    maxV: number;
}

const DEFAULT_N_COLORS = 256;

export class Lut {

    private lut: string[] = [];
    private map: LutTable = [];

    constructor(private options: LutOptions = {
        lut: "rainbow",
        nColors: DEFAULT_N_COLORS,
        minV: 0,
        maxV: 1
    }) {
        this.map = LUT_MAP_TABLE[options.lut];
        if (!this.map) {
            throw new Error(`Lut table ${options.lut} not found`);
        }
    }

    buildLut() {
        this.lut = [];

        if(this.options.minV === this.options.maxV) {
            this.lut.push(this.map[0][1]);
            return;
        }

        const step = (this.options.maxV - this.options.minV) / this.options.nColors;        

        const tmpColor = Cesium.Color.fromCssColorString("#ffffff");
        
        for (let i = this.options.minV; i <= this.options.maxV; i += step) {

            const alpha = (i - this.options.minV) / (this.options.maxV - this.options.minV)

            for (let j = 0; j < this.map.length - 1; j++) {

                if (alpha >= this.map[j][0] && alpha < this.map[j + 1][0]) {

                    const min = this.map[j][0];
                    const max = this.map[j + 1][0];

                    const minColor = Cesium.Color.fromCssColorString(this.map[j][1]);
                    const maxColor = Cesium.Color.fromCssColorString(this.map[j + 1][1]);
                    
                    Cesium.Color.lerp(minColor, maxColor, (alpha - min) / (max - min), tmpColor);

                    this.lut.push(tmpColor.toCssHexString());
                }
            }
        }
    }

    inRange(alpha: number) {
        return alpha >= this.options.minV && alpha < this.options.maxV;
    }

    getColor(alpha: number): string {

        if (this.options.maxV === this.options.minV) {
            return this.lut[0];
        }

        if (alpha <= this.options.minV) {
            alpha = this.options.minV;
        } else if (alpha >= this.options.maxV) {
            alpha = this.options.maxV;
        }

        alpha = (alpha - this.options.minV) / (this.options.maxV - this.options.minV);
        const colorPosition = Math.max(0, Math.round(alpha * this.options.nColors) - 1);
        return this.lut[colorPosition];
    }
}