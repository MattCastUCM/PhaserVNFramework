import InteractiveContainer from "./interactiveContainer.js";
import TextArea from "./textArea.js";

export default class ImageTextButton extends InteractiveContainer {
    /**
    * Clase para los botones con texto cuyo fondo es una imagen. Si no se especifica nada, por defecto
    * la imagen tendra su origen en el centro y el texto se colocara centrado en la imagen
    * 
    * @extends InteractiveContainer
    * @param {Phaser.Scene} scene - escena en la que se va a crear el boton 
    * @param {number} x - posicion x del boton 
    * @param {number} y - posicion y del boton 
    * @param {string} text - texto a escribir
    * @param {object} textConfig - configuracion del texto
    * @param {function} onClick - funcion a llamar al pulsar el boton (opcional)
    * @param {string} imgAtlas - id del atlas en el que esta la imagen de fondo (opcional)
    * @param {string} imgId - id de la textura que se creara para el fondo. Si no se especifica, se reutilizara la del primer rectangulo sin id que se cree (opcional)
    * @param {number} imgOriginX - origen x de la imagen [0-1] (opcional)
    * @param {number} imgOriginY - origen y de la imagen [0-1] (opcional)
    * @param {number} imgScaleX - escala x de la imagen (opcional)
    * @param {number} imgScaleY - escala y de la imagen (opcional)
    * @param {number} imgAlpha - alpha de la imagen [0-1] (opcional)
    * @param {number} textOriginX - origen x del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {number} textOriginY - origen y del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {number} textPaddingX - margen x entre el texto y sus dimensiones maximas (opcional)
    * @param {number} textPaddingY - margen y entre el texto y sus dimensiones maximas (opcional)
    * @param {number} textOffsetX - offset x del texto (opcional)
    * @param {number} textOffsetY - offset y del texto (opcional)
    * @param {number} textAlignX - alineacion horizontal del texto [0-1] (opcional)
    * @param {number} textAlignY - alineacion vertical del texto [0-1] (opcional)
    */
    constructor(scene, x, y, text, textConfig, onClick = () => { }, imgAtlas = "", imgId = "",
        imgOriginX = 0.5, imgOriginY = 0.5, imgScaleX = 1, imgScaleY = 1, imgAlpha = 1,
        textOriginX = 0.5, textOriginY = 0.5, textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textAlignX = 0.5, textAlignY = 0.5) {
        super(scene, x, y);

        if (imgAtlas == "") {
            this.image = this.scene.add.image(0, 0, imgId).setOrigin(imgOriginX, imgOriginY).setScale(imgScaleX, imgScaleY).setAlpha(imgAlpha);
        }
        else {
            this.image = this.scene.add.image(0, 0, imgAtlas, imgId).setOrigin(imgOriginX, imgOriginY).setScale(imgScaleX, imgScaleY).setAlpha(imgAlpha);
        }
        this.add(this.image);

        let textX = this.image.x + this.image.displayWidth * (0.5 - imgOriginX);
        let textY = this.image.y + this.image.displayHeight * (0.5 - imgOriginY);
        this.textObj = new TextArea(this.scene,
            textX, textY, this.image.displayWidth, this.image.displayHeight, text, textConfig, textOriginX, textOriginY, textPaddingX, textPaddingY,
            textOffsetX, textOffsetY, textAlignX, textAlignY)
        this.textObj.adjustFontSize();
        this.add(this.textObj);

        // this.calculateRectangleSize();

        if (onClick != null && typeof onClick === "function") {
            this.onClick = onClick;
            this.setInteractive();
            this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, onClick);
        }
    }


    // NUEVO
    /**
    * Clase para los botones con texto cuyo fondo es una imagen. Si no se especifica nada, el texto se colocara centrado en la imagen
    * 
    * @extends InteractiveContainer
    * @param {Phaser.Scene} scene - escena en la que se va a crear el boton 
    * @param {number} x - posicion x del boton 
    * @param {number} y - posicion y del boton 
    * @param {string} text - texto a escribir
    * @param {object} textConfig - configuracion del texto
    * @param {Phaser.GameObjects} img - instancia previamente creada de un GameObject (Image, Sprite, NineSlice...) que tenga  displayWidth y displayHeight
    * @param {function} onClick - funcion a llamar al pulsar el boton (opcional)
    * @param {number} textOriginX - origen x del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {number} textOriginY - origen y del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {number} textPaddingX - margen x entre el texto y sus dimensiones maximas (opcional)
    * @param {number} textPaddingY - margen y entre el texto y sus dimensiones maximas (opcional)
    * @param {number} textOffsetX - offset x del texto (opcional)
    * @param {number} textOffsetY - offset y del texto (opcional)
    * @param {number} textAlignX - alineacion horizontal del texto [0-1] (opcional)
    * @param {number} textAlignY - alineacion vertical del texto [0-1] (opcional)
    */
    // constructor(scene, x, y, text, textConfig, img, onClick = () => { }, 
    //     textOriginX = 0.5, textOriginY = 0.5, textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textAlignX = 0.5, textAlignY = 0.5) {
    //     super(scene, x, y);

    //     img.setPosition(0, 0);
    //     this.image = img;
    //     this.add(this.image);

    //     let textX = this.image.displayWidth * (0.5 - this.image.originX);
    //     let textY = this.image.displayHeight * (0.5 - this.image.originY);
    //     this.textObj = new TextArea(this.scene,
    //         textX, textY, this.image.displayWidth, this.image.displayHeight, text, textConfig, textOriginX, textOriginY, textPaddingX, textPaddingY,
    //         textOffsetX, textOffsetY, textAlignX, textAlignY)
    //     this.textObj.adjustFontSize();
    //     this.add(this.textObj);

    //     this.calculateRectangleSize();

    //     if (onClick != null && typeof onClick === "function") {
    //         this.onClick = onClick;
    //         this.setInteractive();
    //         this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, onClick);
    //     }
    // }
}