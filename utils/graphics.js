// Configuracion de texto por defecto
export let DEFAULT_TEXT_CONFIG = {
    fontFamily: "Arial",        // Fuente (tiene que estar precargada en el html o el css)
    fontSize: 25,               // Tamano de la fuente del dialogo
    fontStyle: "normal",        // Estilo de la fuente
    backgroundColor: null,      // Color del fondo del texto
    color: "#ffffff",           // Color del texto
    stroke: "#000000",          // Color del borde del texto
    strokeThickness: 5,         // Grosor del borde del texto 
    align: "left",              // Alineacion del texto ("left", "center", "right", "justify")
    wordWrap: null,
    padding: null               // Separacion con el fondo (en el caso de que haya fondo)
}

export function componentToHex(component) {
    // Se convierte en un numero de base 16, en string
    let hex = component.toString(16);
    // Si el numero es menor que 16, solo tiene un digito, por lo que hay que anadir un 0 delante
    return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(R, G, B) {
    return "#" + componentToHex(R) + componentToHex(G) + componentToHex(B);
}

export function hexToRgb(hex) {
    // ^ ---> tiene que comenzar por #
    // a-f\d --> caracteres entre a-f y entre 0-9 (\d)
    // {2} --> grupo de dos caracteres que cumplan la condicion de arriba
    // $ --> final de la cadena. De modo que por ejemplo, "Some text #ffffff some more" no valdria
    // i --> se permiten letras en minuscula y en mayuscula
    let regex = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    let result = regex.exec(hex);

    if (result) {
        return {
            R: parseInt(result[1], 16),
            G: parseInt(result[2], 16),
            B: parseInt(result[3], 16)
        }
    }
    return null;
}

export function hexToColor(hex) {
    return Phaser.Display.Color.IntegerToColor(hex);
}

/**
* Crea una textura a partir de un rectangulo con las caracteristicas indicadas
* @param {Phaser.Scene} scene - escena con acceso a las texturas existentes
* @param {String} textureId - id de la textura que se creara para el rectangulo. Si no se especifica, se reutilizara la del primer rectangulo sin id que se cree
* @param {Number} width - ancho del rectangulo
* @param {Number} height - alto del rectangulo
* @param {Number} fillColor - valor hex del color por defecto del rectangulo (opcional)
* @param {Number} fillAlpha - alpha del rectangulo [0-1] (opcional) 
* @param {Number} borderThickness - ancho del borde del rectangulo (opcional)
* @param {Number} borderNormalColor - valor hex del color por defecto del borde (opcional)
* @param {Number} borderAlpha - alpha del borde [0-1] (opcional)
* @param {Number} radiusPercentage - valor en porcentaje del radio de los bordes [0-100] (opcional)
*/
export function createRectTexture(scene, textureId = "rectTexture", width, height, 
    fillColor = 0xffffff, fillAlpha = 1, borderThickness = 5, borderNormalColor = 0x000000, borderAlpha = 1, radiusPercentage = 0)
{
    if (!scene.textures.exists(textureId)) {
        // Se crea el rectangulo con el borde
        let graphics = scene.add.graphics();
        graphics.fillStyle(fillColor, fillAlpha);
        graphics.lineStyle(borderThickness, borderNormalColor, borderAlpha);

        // Se calcula el radio y se rellenan el rectangulo y el borde redondeados
        let radius = Math.min(width, height) * (radiusPercentage / 100);
        graphics.fillRoundedRect(borderThickness, borderThickness, width, height, radius);
        graphics.strokeRoundedRect(borderThickness, borderThickness, width, height, radius);

        // Se crea la textura a utilizar para el fondo
        graphics.generateTexture(textureId, width + borderThickness * 2, height + borderThickness * 2);
        graphics.destroy();
    }
}

export function createCircleTexture(scene, textureId = "circleTexture", radius, 
    fillColor = 0xffffff, fillAlpha = 1, borderThickness = 5, borderNormalColor = 0x000000, borderAlpha = 1) 
{
    if (!scene.textures.exists(textureId)) {
        let graphics = scene.add.graphics();
        graphics.fillStyle(fillColor, fillAlpha);
        graphics.lineStyle(borderThickness, borderNormalColor, borderAlpha);

        let circle = new Phaser.Geom.Circle(radius + borderThickness / 2, radius + borderThickness / 2, radius);
        graphics.fillCircleShape(circle);
        graphics.strokeCircleShape(circle);

        graphics.generateTexture(textureId, (radius + borderThickness) * 2, (radius + borderThickness) * 2);
        graphics.destroy();
    }
}