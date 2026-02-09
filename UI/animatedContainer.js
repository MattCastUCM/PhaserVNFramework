import { fadeAnimation } from "../utils/graphics.js";
import SimpleContainer from "./simpleContainer.js";

export default class AnimatedContainer extends SimpleContainer {
    /**
    * Clase que extiende Container para agregar animaciones al activar/desactivar la visibilidad
    * @extends Phaser.GameObjects.Container
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {Number} x - posicion x (opcional)
    * @param {Number} y - posicion y (opcional)
    */
    constructor(scene, x = 0, y = 0) {
        super(scene, x, y);

        this.scene = scene;

        // Configuracion de las animaciones
        this.animConfig = {
            fadeTime: 150,
            fadeEase: "linear"
        }
        this.fadeAnim = null;
        this.saveOriginalPosition(this);
    }

    /**
    * Activar o desactivar los objetos con una animacion de opacidad
    * @param {Boolean} active - si se va a activar el objeto
    * @param {Function} onComplete - funcion a la que llamar cuando acaba la animacion (opcional)
    * @param {Number} delay - tiempo en ms que tarda en llamarse a onComplete (opcional)
    */
    activate(active, onComplete = () => { }, delay = 0) {
        this.fadeAnim = fadeAnimation(this, active);

        // Al terminar la animacion, se ejecuta el onComplete si es una funcion valida
        this.fadeAnim.on("complete", () => {
            if (!active) {
                this.setVisible(false);
            }

            setTimeout(() => {
                onComplete();
            }, delay);
        });
    }
}