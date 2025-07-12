import InteractiveContainer from "./interactiveContainer.js";
import TextArea from "./textArea.js";
import { createRectTexture, hexToColor } from "../utils/graphics.js";

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
    * @param {Number} width - ancho maximo del boton 
    * @param {Number} height - alto maximo del boton
    */
    constructor(scene, x, y, width, height) {
        super(scene);

        this.posX = x;
        this.posY = y;
        this.rectWidth = width;
        this.rectHeight = height;
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
    * @param {Number} textOriginY - origen y del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textAlignX - alineacion horizontal del texto [0-1] (opcional)
    * @param {Number} textAlignY - alineacion vertical del texto [0-1] (opcional)
    * @param {Number} normalTintColor - valor hex del color normal
    * @param {Number} hoverTintColor - valor hex del color al pasar el puntero por encima
    * @param {Number} pressingTintColor - valor hex del color al pulsar el boton
    */
    createImgButton(text = "", textConfig = {}, onClick = () => { },
        img = "", imgOriginX = 0.5, imgOriginY = 0.5, imgScaleX = 1, imgScaleY = 1, imgAlpha = 1,
        textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textOriginX = 0.5, textOriginY = 0.5, textAlignX = 0.5, textAlignY = 0.5,
        normalTintColor = 0xffffff, hoverTintColor = 0xd9d9d9, pressingTintColor = 0x969696)
    {
        this.createImgButtonWithAtlas(text, textConfig, onClick, "", img, imgOriginX, imgOriginY, imgScaleX, imgScaleY, imgAlpha, textPaddingX, textPaddingY, 
            textOffsetX, textOffsetY, textOriginX, textOriginY, textAlignX, textAlignY, normalTintColor, hoverTintColor, pressingTintColor);
    }
    createImgButtonWithAtlas(text = "", textConfig = {}, onClick = () => { },
        imgAtlas = "", img = "", imgOriginX = 0.5, imgOriginY = 0.5, imgScaleX = 1, imgScaleY = 1, imgAlpha = 1,
        textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textOriginX = 0.5, textOriginY = 0.5, textAlignX = 0.5, textAlignY = 0.5,
        normalTintColor = 0xffffff, hoverTintColor = 0xd9d9d9, pressingTintColor = 0x969696) 
    {
        if (imgAtlas == "") {
            this.image = this.scene.add.image(this.posX, this.posY, img).setOrigin(imgOriginX, imgOriginY).setScale(imgScaleX, imgScaleY).setAlpha(imgAlpha);
        }
        else {
            this.image = this.scene.add.image(this.posX, this.posY, imgAtlas, img).setOrigin(imgOriginX, imgOriginY).setScale(imgScaleX, imgScaleY).setAlpha(imgAlpha);
        }
        this.add(this.image);

        this.textObj = this.createText(text, textConfig, textPaddingX, textPaddingY, textOffsetX, textOffsetY, textOriginX, textOriginY, textAlignX, textAlignY);
        this.add(this.textObj);

        this.calculateRectangleSize();
        this.setInteractive();
        this.animateButton([this.image, this.textObj], onClick, normalTintColor, hoverTintColor, pressingTintColor);
    }



    /**
    * Crea el boton con un rectangulo de fondo
    * @param {String} text - texto a escribir
    * @param {Object} textConfig - configuracion del texto
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
    createRectButton(text = "", textConfig = {}, onClick = () => { }, textureId = "buttonTexture",
        radiusPercentage = 0, fillColor = 0xffffff, fillAlpha = 1, borderThickness = 5, borderNormalColor = 0x000000, borderAlpha = 1,
        textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, textOriginX = 0.5, textOriginY = 0.5, textAlignX = 0.5, textAlignY = 0.5,
        normalTintColor = 0xffffff, hoverTintColor = 0xd9d9d9, pressingTintColor = 0x969696) 
    {
        // TODO: probablemente se podria hacer con Shape, que es la version mejor o no crear la textura, porque nunca se va a reutilizar
        createRectTexture(this.scene, textureId, this.rectWidth, this.rectHeight, fillColor, fillAlpha, borderThickness, borderNormalColor, borderAlpha, radiusPercentage);

        // Se crea la imagen en base a la textura
        this.image = this.scene.add.image(this.posX, this.posY, textureId).setOrigin(0.5, 0.5);
        this.add(this.image);

        this.textObj = this.createText(text, textConfig, textPaddingX, textPaddingY,textOffsetX, textOffsetY, textOriginX, textOriginY, textAlignX, textAlignY);
        this.add(this.textObj);

        this.calculateRectangleSize();
        this.setInteractive();
        this.animateButton([this.image, this.textObj], onClick, normalTintColor, hoverTintColor, pressingTintColor);
    }

    /**
    * Se crea el texto del boton
    * @param {String} text - texto a escribir
    * @param {Object} textConfig - configuracion del texto
    * @param {Number} textPaddingX - margen x del texto (opcional)
    * @param {Number} textPaddingY - margen y del texto (opcional)
    * @param {Number} textOffsetX - offset x del texto (opcional)
    * @param {Number} textOffsetY - offset y del texto (opcional)
    * @param {Number} textOriginX - origen x del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textOriginY - origen y del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textAlignX - alineacion horizontal del texto [0-1] (opcional)
    * @param {Number} textAlignY - alineacion vertical del texto [0-1] (opcional)
    * @returns {TextArea} - texto creado
    */
    createText(text = "", textConfig = {}, textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0, 
        textOriginX = 0.5, textOriginY = 0.5, textAlignX = 0.5, textAlignY = 0.5) 
    {
        let textObj = new TextArea(this.scene, this.posX, this.posY, this.rectWidth - textPaddingX * 2, this.rectHeight - textPaddingY * 2, text, textConfig)
            .setOrigin(textOriginX, textOriginY);

        this.textX = this.posX - this.rectWidth * (0.5 - textAlignX) + textPaddingX * (0.5 - textAlignX) * 2 + textOffsetX;
        this.textY = this.posY - this.rectHeight * (0.5 - textAlignY) + textPaddingY * (0.5 - textAlignY) * 2 + textOffsetY;
        textObj.setPosition(this.textX, this.textY);

        textObj.adjustFontSize();

        return textObj;
    }


    /**
    * Se anaden las animaciones de pasar y quitar el puntero y de pulsar
    * @param {Array} targets - objetos que cambiar de color 
    * @param {Function} onClick - funcion a llamar al pulsar el boton
    * @param {Number} normalTintColor - valor hex del color normal (opcional)
    * @param {Number} hoverTintColor - valor hex del color al pasar el puntero por encima (opcional)
    * @param {Number} pressingTintColor - valor hex del color al pulsar el boton (opcional)
    */
    animateButton(targets, onClick = () => { }, normalTintColor = 0xffffff, hoverTintColor = 0xd9d9d9, pressingTintColor = 0x969696) {
        let tintFadeTime = 50;

        let normalTint = hexToColor(normalTintColor);
        let hoverTint = hexToColor(hoverTintColor);
        let pressingTint = hexToColor(pressingTintColor);

        this.on("pointerover", () => {
            this.scene.tweens.addCounter({
                targets: targets,
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(normalTint, hoverTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    Phaser.Actions.SetTint(targets, colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });
        this.on("pointerout", () => {
            this.scene.tweens.addCounter({
                targets: this,
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hoverTint, normalTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    Phaser.Actions.SetTint(targets, colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        this.on("pointerdown", () => {
            let fadeColor = this.scene.tweens.addCounter({
                targets: this,
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(hoverTint, pressingTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    Phaser.Actions.SetTint(targets, colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
                yoyo: true
            });
            fadeColor.on("complete", () => {
                if (onClick != null && typeof onClick == "function") {
                    onClick();
                }
            });
        });
    }
}