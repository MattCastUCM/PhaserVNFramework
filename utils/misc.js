/**
* Comprueba y guarda las propiedades de defaultObj que falten en targetObj 
* @param {Object} targetObj - objeto a completar con las propiedades faltantes
* @param {Object} defaultObj - objeto del que mirar las propiedades faltantes
* @returns {Object} - copia de targetObj con las propiedades que le falten de defaultObj
*/
export function completeMissingProperties(targetObj, defaultObj) {
    const completedObj = { ...targetObj };

    const defaultKeys = Object.keys(defaultObj);

    defaultKeys.forEach(key => {
        if (!(key in completedObj)) {
            completedObj[key] = defaultObj[key];
        }
    });

    return completedObj;
}

export function splitByWord(text) {
    // Sustituir los espacios provocados por caracteres especiales por espacios regulares
    const regularSpaces = text.replace(/[\r\n]/g, " ");

    // Separar el texto por espacios
    const splitText = regularSpaces.split(" ").filter(x => x);
    return splitText;
}

/**
* Mueve un punto current hacia un punto target una distancia maxima maxDistanceDelta.
* Si la distancia entre current y target es menor o igual a maxDistanceDelta, 
* la funcion devuelve el punto target directamente
* @param {Object} current - punto actual con propiedades {x, y}
* @param {Object} target - punto destino con propiedades {x, y}
* @param {Number} maxDistanceDelta - distancia maxima que se puede mover desde el punto actual
* @returns {Object} - nuevo punto movido hacia target
*/
export function moveTowards(current, target, maxDistanceDelta) {
    let directionX = target.x - current.x;
    let directionY = target.y - current.y;
    let distance = Math.hypot(directionX, directionY);

    if (distance <= maxDistanceDelta || distance < 0.1) {
        return target;
    }

    let ratio = maxDistanceDelta / distance;
    return {
        x: current.x + directionX * ratio,
        y: current.y + directionY * ratio
    }
}


/**
* Configura un objeto para que sea interactivo y le asigna un cursor personalizado si esta disponible
* @param {Phaser.GameObject} gameObject - objeto que se va a hacer interactivo 
* @param {Object} prevConfig - configuracion a la que agregar el parametro del cursor 
*/
export function setInteractive(gameObject, config = {}) {
    let scene = gameObject.scene;

    if (scene.registry.get("pointerOver") != null) {
        config.cursor = `url(${scene.registry.get("pointerOver")}), pointer`;
    }
    else {
        config.useHandCursor = true;
    }

    gameObject.setInteractive(config);

    // Guarda la llamada original al disableInteractive del objeto
    let defaultDisableInteractive = gameObject.disableInteractive.bind(gameObject);

    // Cambia la funcionalidad del disableInteractive
    gameObject.disableInteractive = () => {
        // console.log("disabled");

        // Llama al disableInteractive original forzando el cambio de cursor al por defecto
        defaultDisableInteractive(true);

        // Restaura el disableInteractive por la llamada original
        gameObject.disableInteractive = defaultDisableInteractive;
    }

    if (gameDebug.enable) {
        scene.input.enableDebug(gameObject, gameDebug.color);
    }
}

/**
* Calcular la diferencia de tiempo en segundos entre el momento actual
* y un tiempo de inicio proporcionado
* @param {Date} startTime - tiempo de inicio
* @returns {number} - diferencia de tiempo en segundos entre el momento actual y un tiempo de inicio
*
**/
export function getDifferenceTimeInS(startTime) {
    let currentTime = new Date();
    let durationInMs = currentTime.getTime() - startTime.getTime();
    return durationInMs / 1000;
}

/**
* Crear una lista de numeros desde "start" hasta "end" incrementando "step" en cada paso
* @param {Number} start - valor inicial de la lista
* @param {Number} end - valor final de la lista
* @param {Number} step - incremento en cada paso
* @returns {Array, Number} - lista de numeros
*/
export function range(start, end, step) {
    let range = [];
    for (let i = start; i < end; i += step) {
        range.push(i);
    }
    // Simpre se incluye "end"
    if (range[range.length - 1] !== end) {
        range.push(end);
    }
    return range;
}