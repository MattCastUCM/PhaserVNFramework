export default class TextArea extends Phaser.GameObjects.Text {
    /**
    * Texto que tiene que estar contenido en un area especifica
    * @extends Phaser.GameObjects.Text
    * @param {Phaser.GameObjects.Scene} scene - escena en la que se crea (idealmente la escena de UI)
    * @param {Number} x - posicion x del texto (opcional)
    * @param {Number} y - posicion y del texto (opcional)
    * @param {Number} maxWidth - ancho maximo que puede ocupar el texto (opcional)
    * @param {Number} maxHeight - alto maximo que puede ocupar el texto (opcional)
    * @param {String} text - texto a mostrar (opcional)
    * @param {Object} style - estilo del texto (opcional)
    * @param {Number} textOriginX - origen x del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textOriginY - origen y del texto [0-1] (si esta alineado en el centro, se ignora) (opcional)
    * @param {Number} textPaddingX - margen x entre el texto y sus dimensiones maximas (opcional)
    * @param {Number} textPaddingY - margen y entre el texto y sus dimensiones maximas (opcional)
    * @param {Number} textOffsetX - offset x del texto (opcional)
    * @param {Number} textOffsetY - offset y del texto (opcional)
    * @param {Number} textAlignX - alineacion horizontal del texto [0-1] (opcional)
    * @param {Number} textAlignY - alineacion vertical del texto [0-1] (opcional)
    */
    constructor(scene, x = 0, y = 0, maxWidth = 100, maxHeight = 100, text = "", style = {}, 
        textOriginX = 0.5, textOriginY = 0.5, textPaddingX = 0, textPaddingY = 0, textOffsetX = 0, textOffsetY = 0,  textAlignX = 0.5, textAlignY = 0.5) 
    {
        // Se crea el texto y se anade a la escena
        super(scene, x, y, text, style);
        scene.add.existing(this);

        // Se calculan las dimensiones maximas en base a las indicadas y el padding
        this.maxWidth = maxWidth - textPaddingX * 2;
        this.maxHeight = maxHeight - textPaddingY * 2;
        
        // Se pone el texto en el origen indicado
        this.setOrigin(textOriginX, textOriginY);

        // Se coloca el texto segun su alineacion y el padding
        this.x -= this.maxWidth * (0.5 - textAlignX) + textPaddingX * (0.5 - textAlignX) * 2 + textOffsetX;
        this.y -= -this.maxHeight * (0.5 - textAlignY) + textPaddingY * (0.5 - textAlignY) * 2 + textOffsetY;

        if (gameDebug.enableText) {
            this.setInteractive();
            scene.input.enableDebug(this, gameDebug.textColor);
            this.disableInteractive();
        }
    }

    /**
    * Comprueba si el texto indicado cabe los limites establecidos
    * @param {String} text - texto a mostrar
    * @returns {Boolean} - true si el texto cabe, false en caso contrario
    */
    fits(text) {
        let prevText = this.text;
        this.setText(text);
        let fits = true;

        // Si el texto no tiene ajuste de linea, cabe si tanto su ancho como su alto no exceden los limites
        if (this.style.wordWrapWidth == null) {
            fits = this.displayWidth <= this.maxWidth && this.displayHeight <= this.maxHeight;
        }
        // Si tiene ajuste de linea, cabe si su alto no excede los limites (independientemente del ancho)
        else {
            fits = this.displayHeight <= this.maxHeight;
        }
        this.setText(prevText);

        // if (!fits) {
        //     console.log(text, this.displayWidth, this.displayHeight, this.maxWidth, this.maxHeight);
        // }
        return fits;
    }


    /**
    * Ajusta automaticamente el tamano de la fuente hasta que quepa al menos 1 caracter
    * @param {String} text - primer caracter del texto a mostrar
    * @param {Number} reduction - reduccion que se le ira aplicando a la fuente cada vez que se compruebe si cabe o no 
    * 
    * IMPORTANTE: ESTE METODO VA RECONSTRUYENDO EL TEXTO CON UN TAMANO DE FUENTE CADA VEZ
    * MENOR Y COMPROBANDO SI CABE DENTRO DE LOS LIMITES DE LA CAJA, POR LO QUE SI EL TAMANO
    * DEL TEXTO ES ENORME O LA REDUCCION ES MUY PEQUENA, TARDARA MUCHO TIEMPO EN TERMINAR
    */
    adjustFontSize(text = "", reduction = 5) {
        if (text == null || text == "") {
            text = this.text;
        }
        if (text != "") {
            let textConfig = this.style;
            let fontSize = textConfig.fontSize.replace("px", "");

            while (this.maxWidth > 0 && this.maxHeight > 0 && text != "" && !this.fits(text)) {
                fontSize -= reduction;
                this.setFontSize(fontSize);
                // this.setSize(this.getBounds().width, this.getBounds().height);
            }

            if (gameDebug.enableText) {
                this.setInteractive();
                this.scene.input.enableDebug(this, gameDebug.textColor);
                this.disableInteractive();
            }
        }
        // console.log(fontSize);
    }

    /**
    * Ajusta automaticamente el texto para que quepa dentro de los limites.
    * Si el texto excede el tamano, se recorta progresivamente hasta que encoja
    * 
    * @param {Boolean} keepRight - Si es true, se recortan caracteres por la izquierda (se mantiene el final del texto).
    *                              Si es false, se recortan por la derecha (se mantiene el inicio del texto).
    * @param {String} - texto que se quiere ajustar. Si no se proporciona, se usara el texto actual.
    * @param {Number} - cantidad de caracteres que se eliminan por iteracion (opcionaL9)
    */
    adjustTextLength(keepRight, text = "", reduction = 1) {
        if (text == null || text == "") {
            text = this.text;
        }
        if (text != "") {
            while (this.maxWidth > 0 && this.maxHeight > 0 && text !== "" && !this.fits(text)) {
                if (keepRight) {
                    // Se elimina caracteres del inicio para mantener el final de texto
                    text = text.slice(reduction - text.length);
                }
                else {
                    // Se eliminan caracteres del final para mantener el inicio
                    text = text.slice(0, -reduction);
                }
                this.setText(text);
            }
        }
    }
}