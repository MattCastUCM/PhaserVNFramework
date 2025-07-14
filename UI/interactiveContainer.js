import { setInteractive } from "../utils/misc.js";
import AnimatedContainer from "./animatedContainer.js";

export default class InteractiveContainer extends AnimatedContainer {
    /**
    * Clase base para los elementos de dialogo, con metodos para activar/desactivar el objeto y calcular su rectangulo de colision
    * @extends AnimatedContainer
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {Number} x - posicion x (opcional)
    * @param {Number} y - posicion y (opcional)
    */
    constructor(scene, x = 0, y = 0) {
        super(scene, x, y);
    }

    /**
    * Activa o desactiva los objetos indicados
    * @param {Boolean} active - si se va a activar el objeto
    * @param {Function} onComplete - funcion a la que llamar cuando acaba la animacion (opcional)
    * @param {Number} delay - tiempo en ms que tarda en llamarse a onComplete (opcional)
    */
    activate(active, onComplete = null, delay = 0) {
        if (!active) {
            this.disableInteractive();
        }

        super.baseActivate(active, () => {
            if (active) {
                this.setInteractive();
            }
            else {
                this.setVisible(false);
            }

            if (onComplete != null && typeof onComplete == "function") {
                setTimeout(() => {
                    onComplete();
                }, delay);
            }
        });
    }


    /**
    * Obtiene las dimensiones del rectangulo del container para hacerlo interactivo
    * @param {String} objectName - nombre del objeto a imprimir en el debug (opcional)
    */
    calculateRectangleSize(objectName = "") {
        // Esta en coordenadas globlaes
        let dims = this.getBounds();
        this.setSize(dims.width, dims.height);

        let rectangle = new Phaser.Geom.Rectangle(dims.x + dims.width / 2 - this.x, dims.y + dims.height / 2 - this.y,
            dims.width, dims.height);

        setInteractive(this, {
            hitArea: rectangle,
            hitAreaCallback: Phaser.Geom.Rectangle.Contains
        });

        if (gameDebug.enable) {
            this.on("pointerdown", () => {
                console.log("clicking", objectName);
            });
        }
        this.disableInteractive();
    }
}