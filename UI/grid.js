export default class Grid extends Phaser.GameObjects.Container {
    /**
    * Crea una cuadricula para organizar elementos visuales
    *
    * @param {Phaser.Scene} scene - escena donde se crea la cuadricula.
    * @param {Number} x - posicion x de la esquina superior izquierda
    * @param {Number} y - posicion y de la esquina superior izquierda
    * @param {Number} width - ancho total de la cuadricula
    * @param {Number} height - alto total de la cuadrícula
    * @param {Number} columns - nuemro de columnas
    * @param {Number} rows - numero de filas
    * @param {Number} padding - espacio desde los bordes hacia dentro
    */
    constructor(scene, x, y, width, height, columns, rows, padding) {
        super(scene, x, y);

        scene.add.existing(this);

        this.setSize(width, height);
        this.columns = columns;
        this.rows = rows;
        this.padding = padding;

        // Se calcula el punto inicial (esquina superior izquierda)
        this.startingX = this.x + this.padding;
        this.startingY = this.y + this.padding;

        // Se calcula el ancho y el alto de cada celda
        this.cellWidth = (this.width - this.padding * 2) / this.columns;
        this.cellHeight = (this.height - this.padding * 2) / this.rows;

        if (gameDebug.enable) {
            let debugRect = this.scene.add.rectangle(this.startingX, this.startingY, this.columns * this.cellWidth, this.rows * this.cellHeight, 0xff, 0);
            debugRect.setStrokeStyle(2, gameDebug.color);
            debugRect.setOrigin(0, 0);
        }
    }

    arrange() {
        Phaser.Actions.GridAlign(this.list, {
            width: this.columns,
            height: this.rows,
            cellWidth: this.cellWidth,
            cellHeight: this.cellHeight,
            position: Phaser.Display.Align.CENTER,
            x: this.padding,
            y: this.padding
        })
    }

    addItem(item) {
        if (!this.exists(item)) {
            this.add(item);
            this.arrange();
        }
    }
}