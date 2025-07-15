import InteractiveContainer from "./interactiveContainer.js";
import TextArea from "./textArea.js";
import { createRectTexture, tintAnimation } from "../utils/graphics.js";

export default class Button extends InteractiveContainer {
    /**
    * Clase para los botones con texto 
    * 
    * IMPORTANTE: COMO NO SE PUEDE SOBRECARGAR LA CONSTRUCTORA, ES NECESARIO HACER PRIMERO UN NEW Y LUEGO
    * HACER UN CREATEIMGBUTTON O UN CREATERECTBUTTON DEPENDIENDO DEL TIPO DE BOTON QUE SE QUIERA CREAR
    * 
    * @extends InteractiveContainer
    * @param {Phaser.Scene} scene - escena en la que se va a crear el boton 
    * @param {Number} x - posicion x del boton 
    * @param {Number} y - posicion y del boton 
    */
    constructor(scene, x, y, onClick) {
        super(scene, x, y);

        this.onClick = onClick;
    }

    /**
    * Crea el boton con la imagen de fondo
    * @param {String} text - texto a escribir
    * @param {Object} textConfig - configuracion del texto
    * @param {Function} onClick - funcion a llamar al pulsar el boton
    * @param {String} imgAtlas - id del atlas en el que esta la imagen de fondo
    * @param {String} img - id de la imagen a utilizar de fondo
    * @param {Number} imgOriginX - origen x de la imagen [0-1] (opcional)
    * @param {Number} imgOriginY - origen y de la imagen [0-1] (opcional)
    * @param {Number} imgScaleX - escala x de la imagen (opcional)
    * @param {Number} imgScaleY - escala y de la imagen (opcional)
    * @param {Number} imgAlpha - alpha de la imagen [0-1] (opcional)
    * @param {Number} textPaddingX - margen x del texto (opcional)
    * @param {Number} textPaddingY - margen y del texto (opcional)
    * @param {Number} textOffsetX - offset x del texto (opcional)
    * @param {Number} textOffsetY - offset y del texto (opcional)
    * @param {Number} textOriginX - origen x del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textOriginY - origen y del texto [0-1] (si esta alineado en el centro, se ignoraa) (opcional)
    * @param {Number} textAlignX - alineacion horizontal del texto [0-1] (opcional)
    * @param {Number} textAlignY - alineacion vertical del texto [0-1] (opcional)
    * @param {Number} normalTintColor - valor hex del color normal
    * @param {Number} hoverTintColor - valor hex del color al pasar el puntero por encima
    * @param {Number} pressingTintColor - valor hex del color al pulsar el boton
    */
    createImgButton(text, textConfig, onClick,
        img = "", imgOriginX = 0.5, imgOriginY = 0.5, imgScaleX = 1, imgScaleY = 1, imgAlpha = 1,
        textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textOriginX = 0.5, textOriginY = 0.5, textAlignX = 0.5, textAlignY = 0.5,
        normalTintColor = 0xffffff, hoverTintColor = 0xd9d9d9, pressingTintColor = 0x969696) 
    {
        this.createImgButtonWithAtlas(text, textConfig, onClick, "", img, imgOriginX, imgOriginY, imgScaleX, imgScaleY, imgAlpha, textPaddingX, textPaddingY,
            textOffsetX, textOffsetY, textOriginX, textOriginY, textAlignX, textAlignY, normalTintColor, hoverTintColor, pressingTintColor);
    }
    createImgButtonWithAtlas(text, textConfig, onClick,
        imgAtlas = "", img = "", imgOriginX = 0.5, imgOriginY = 0.5, imgScaleX = 1, imgScaleY = 1, imgAlpha = 1,
        textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textOriginX = 0.5, textOriginY = 0.5, textAlignX = 0.5, textAlignY = 0.5,
        normalTintColor = 0xffffff, hoverTintColor = 0xd9d9d9, pressingTintColor = 0x969696) 
    {
        if (imgAtlas == "") {
            this.image = this.scene.add.image(0, 0, img).setOrigin(imgOriginX, imgOriginY).setScale(imgScaleX, imgScaleY).setAlpha(imgAlpha);
        }
        else {
            this.image = this.scene.add.image(0, 0, imgAtlas, img).setOrigin(imgOriginX, imgOriginY).setScale(imgScaleX, imgScaleY).setAlpha(imgAlpha);
        }
        this.add(this.image);

        this.textObj = new TextArea(this.scene, 
            0, 0, this.image.displayWidth, this.image.displayHeight, text, textConfig, textOriginX, textOriginY, textPaddingX, textPaddingY, textOffsetX, textOffsetY, textAlignX, textAlignY)
        this.textObj.adjustFontSize();
        this.add(this.textObj);

        this.calculateRectangleSize();
        this.setInteractive();
        tintAnimation(this, this.list, onClick, normalTintColor, hoverTintColor, pressingTintColor);
    }


    /**
    * Crea el boton con un rectangulo de fondo
    * @param {String} text - texto a escribir
    * @param {Object} textConfig - configuracion del texto
    * @param {Number} width - ancho maximo del boton
    * @param {Number} height - alto maximo del boton
    * @param {Function} onClick - funcion a llamar al pulsar el boton
    * @param {String} textureId - id de la textura que se creara para el fondo. Si no se especifica, se reutilizara la del primer rectangulo sin id que se cree (opcional)
    * @param {Number} radiusPercentage - valor en porcentaje del radio de los bordes [0-100] (opcional)
    * @param {Number} fillColor - valor hex del color por defecto del rectangulo (opcional)
    * @param {Number} fillAlpha - alpha del rectangulo [0-1] (opcional) 
    * @param {Number} borderThickness - ancho del borde del rectangulo (opcional)
    * @param {Number} borderNormalColor - valor hex del color por defecto del borde (opcional)
    * @param {Number} borderAlpha - alpha del borde [0-1] (opcional)
    * @param {Number} pressingTintColor - valor hex del color al pulsar el boton (opcional)
    * @param {Number} textPaddingX - margen x del texto (opcional)
    * @param {Number} textPaddingY - margen y del texto (opcional)
    * @param {Number} textOffsetX - offset x del texto (opcional)
    * @param {Number} textOffsetY - offset y del texto (opcional)
    * @param {Number} textOriginX - origen x del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textOriginY - origen y del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textAlignX - alineacion horizontal del texto [0-1] (opcional)
    * @param {Number} textAlignY - alineacion vertical del texto [0-1] (opcional)
    * @param {Number} normalTintColor - valor hex del color normal (opcional)
    * @param {Number} hoverTintColor - valor hex del color al pasar el puntero por encima (opcional)
    */
    createRectButton(text, textConfig, width, height, onClick, textureId = "buttonTexture",
        radiusPercentage = 0, fillColor = 0xffffff, fillAlpha = 1, borderThickness = 5, borderNormalColor = 0x000000, borderAlpha = 1,
        textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textOriginX = 0.5, textOriginY = 0.5, textAlignX = 0.5, textAlignY = 0.5,
        normalTintColor = 0xffffff, hoverTintColor = 0xd9d9d9, pressingTintColor = 0x969696) 
    {
        createRectTexture(this.scene, textureId, width, height, fillColor, fillAlpha, borderThickness, borderNormalColor, borderAlpha, radiusPercentage);

        // Se crea la imagen en base a la textura
        this.image = this.scene.add.image(0, 0, textureId).setOrigin(0.5, 0.5);
        this.add(this.image);

        this.textObj = new TextArea(this.scene, 
            0, 0, width, height, text, textConfig, textOriginX, textOriginY, textPaddingX, textPaddingY, textOffsetX, textOffsetY, textAlignX, textAlignY)
        this.textObj.adjustFontSize();
        this.add(this.textObj);

        this.calculateRectangleSize();
        this.setInteractive();
        tintAnimation(this, this.list, onClick, normalTintColor, hoverTintColor, pressingTintColor);
    }
}