import InteractiveContainer from "./interactiveContainer.js";
import SimpleContainer from "./simpleContainer.js";

export default class ScrollListView extends InteractiveContainer {
    /**
    * 
    * @extends InteractiveContainer
    * @param {*} scene 
    * @param {*} x 
    * @param {*} y 
    * @param {*} width 
    * @param {*} height 
    * @param {*} originX 
    * @param {*} originY 
    * @param {*} itemSpacing 
    * @param {*} leftMargin 
    * @param {*} rightMargin 
    * @param {*} topMargin 
    * @param {*} bottomMargin 
    * @param {*} dragThreshold 
    * @param {*} horizontalScroll 
    * @param {*} scrollSpeed 
    * @param {*} deceleration 
    * @param {*} velThreshold 
    */
    constructor(scene, x = 0, y = 0, width, height, originX = 0.5, originY = 0.5, itemSpacing = 0, leftMargin = 0, rightMargin = 0, topMargin = 0, bottomMargin = 0,
        horizontalScroll = false, scrollSpeed = 1, deceleration = 0.99, velThreshold = 0.1) 
    {
        super(scene, x, y);

        this.setOrigin(originX, originY);

        this.width = width;
        this.height = height;
        
        this.itemSpacing = itemSpacing;
        this.leftMargin = leftMargin;
        this.rightMargin = rightMargin;
        this.topMargin = topMargin;
        this.bottomMargin = bottomMargin;

        this.horizontalScroll = horizontalScroll;
        this.scrollSpeed = scrollSpeed;
        this.deceleration = deceleration;
        this.velThreshold = velThreshold;

        
        // Rectangulo para la interaccion con la listView y el calculo correcto del tamano y el origen
        let interactiveRect = scene.add.rectangle(0, 0, width, height, 0x0, 0.5).setOrigin(originX, originY).setVisible(false);
        super.add(interactiveRect, true);
        
        // Mascara para ocultar todo lo que haya fuera del area indicada
        this.maskRect = scene.add.rectangle(x, y, width, height, 0xff, 0.5).setOrigin(originX, originY).setVisible(false);
        let mask = this.maskRect.createGeometryMask();
        this.setMask(mask);
        // mask.setInvertAlpha(true);


        // Configuracion de los eventos de arrastrar
        this.setInteractive();
        this.off("pointerdown");

        // Se tiene que hacer arrastrable desde el input de la escena, 
        // ya que los containers por defecto no son arrastrables
        scene.input.setDraggable(this, true);

        this.dragging = false;
        let lastDrag = 0;
        this.on("dragstart", (pointer) => {
            lastDrag = this.horizontalScroll ? pointer.x : pointer.y;
            this.dragging = true;
        });

        this.scrollDir = 0;
        this.on("drag", (pointer) => {
            this.scrollDir = this.horizontalScroll ? pointer.x - lastDrag : pointer.y - lastDrag;
            lastDrag = this.horizontalScroll ? pointer.x : pointer.y;
            this.scroll();
        });

        this.on("dragend", (pointer) => {
            this.dragging = false;
            lastDrag = this.horizontalScroll ? pointer.x : pointer.y;
        });


        // Container con los elementos de la listView que van a scrollear
        // independientemente del origen del container, se coloca en la esquina superior izquierda
        this.scroller = new SimpleContainer(scene, this.getLocalBounds().left, this.getLocalBounds().top);
        // this.scroller = new InteractiveContainer(scene, this.getLocalBounds().left, this.getLocalBounds().top);
        // let posX = 70;
        // let posY = 70;
        // this.scroller = new InteractiveContainer(scene, posX, posY);
        // this.scroller.setOrigin(0, 0);
        this.add(this.scroller);
        
        // this.add(biggerBg, false);
        
        // Ultimo objeto introducido en la lista (para calcular la posicion del siguiente)
        this.lastItem = null;


        this.test1(scene, width, height);
    }

     test1(scene, width, height) {
        this.itemSpacing = 10
        this.topMargin = this.bottomMargin = this.leftMargin = this.rightMargin = 15;

        // let bgScale = 1;
        // let biggerBg = scene.add.rectangle(0, 0, width * bgScale, height * bgScale, 0xFF0000, 1);
        // this.scroller.add(biggerBg);
        // biggerBg.setInteractive();
        // biggerBg.on("pointerdown", () => { console.log("bg") });
        // this.sendToBack(biggerBg);
        this.scroller.calculateRectangleSize();

        this.horizontalScroll = true;

        let size = 100;
        let rect1 = this.addToEnd(scene.add.rectangle(0, 0, size, size, 0x0000FF, 1), 0);
        let rect2 = this.addToEnd(scene.add.rectangle(0, 0, size, size * 2, 0x0000FF, 1).setOrigin(0, 0), 1);
        let rect3 = this.addToEnd(scene.add.rectangle(0, 100, size, size, 0x0000FF, 1), 0.5);
        let rect4 = this.addToEnd(scene.add.rectangle(0, 0, size, size * 2, 0x0000FF, 1).setOrigin(0, 0), 0);

        this.test1 = rect1;
        this.test2 = rect4;
        // this.once("pointerdown", () => {
        //     let removed = this.removeItem(rect3);

        //     if (this.horizontalScroll) {
        //         this.toRight();
        //     }
        //     else {
        //         this.toBottom();
        //     }
        //     this.once("pointerdown", () => {
        //         this.addToEnd(removed);
        //         if (this.horizontalScroll) {
        //             this.toLeft();
        //         }
        //         else {
        //             this.toTop();
        //         }

        //     });
        // });
    }

   /**
    * Anade un objeto al container. Llama al metodo de su padre con el parametro de recalcular el tamano a false
    */
    add(gameObject) {
        super.add(gameObject, false);
    }

    /**
    * Devuelve la posicion de los laterales en coordenadas locales teniendo en cuenta el origen
    * @returns {Object} - objeto con la posicion local de los laterales izquierdo, derecho, superior e inferior
    */
    getLocalBounds() {
        return {
            left: - this.width * this.origin_x,
            top: - this.height * this.origin_y,
            right: (- this.width * this.origin_x) + this.width,
            bottom: (- this.height * this.origin_y) + this.height
        }
    }
   


    /**
    * Gestiona el scroll de los elementos dependiendo de la direccion en la que se arrastre
    */
    scroll() {
        let scrollerDim = this.horizontalScroll ? this.scroller.displayWidth : this.scroller.displayHeight;
        let dim = this.horizontalScroll ? this.width : this.height;
        let initMargin = this.horizontalScroll ? this.leftMargin : this.topMargin;
        let endMargin = this.horizontalScroll ? this.rightMargin : this.bottomMargin;

        let canMove = scrollerDim > dim - initMargin - endMargin;

        // Si la dimension del scroller correspondiente a la direccion del scroll es superior 
        // a la misma dimension de la zona visible (menos los margenes), se puede scrollear
        if (canMove) {
            let movement = this.scrollSpeed * this.scrollDir;

            let origin = this.horizontalScroll ? this.origin_x : this.origin_y;

            // Limite para scrollear hasta el inicio (lateral izquierdo/superior, sin 
            // incluir el margen porque ya se aplica al anadir objetos al scroller)
            let scrollToInitLimit = this.horizontalScroll ? this.getLocalBounds().left : this.getLocalBounds().top;

            // Limite para scrollear hasta el final (lateral derecho/inferior) 
            let scrollToEndLimit = scrollToInitLimit - scrollerDim + dim - endMargin;

            if (this.horizontalScroll) {
                this.scroller.x += movement;
                this.scroller.x = Phaser.Math.Clamp(this.scroller.x, scrollToEndLimit, scrollToInitLimit);
            }
            else {
                this.scroller.y += movement;
                this.scroller.y = Phaser.Math.Clamp(this.scroller.y, scrollToEndLimit, scrollToInitLimit);
            }
        }
    }

    cull() {
        this.scroller.list.forEach((elem) => {
            let scrollerPos = this.horizontalScroll ? this.scroller.x : this.scroller.y;
            let elemPos = this.horizontalScroll ? elem.x : elem.y;
            let elemDim = this.horizontalScroll ? elem.displayWidth : elem.displayHeight;
            let elemOrigin = this.horizontalScroll ? elem.originX : elem.originY;
            let minDim = this.horizontalScroll ? this.getLocalBounds().left : this.getLocalBounds().top;
            let maxDim = this.horizontalScroll ? this.getLocalBounds().right : this.getLocalBounds().bottom;

            let objStart = elemPos - elemDim * elemOrigin;
            let objEnd = elemPos + elemDim * (1 - elemOrigin);

            let hide = scrollerPos + objEnd < minDim || scrollerPos + objStart > maxDim; 
            elem.setVisible(!hide);
            
            if (!hide) {
                let initExcess = scrollerPos + objStart - minDim;
                let endExcess = maxDim - scrollerPos + objEnd;

                // TODO
            }
        });
    }

    preUpdate(t, dt) {
        // Si ya no se esta arrastrando y la velocidad del scroll supera el umbral
        if (!this.dragging && Math.abs(this.scrollDir) > this.velThreshold) {
            // Va reduciendo la velocidad del scroll
            this.scrollDir *= Math.pow(this.deceleration, dt);

            // Sigue scrolleando
            this.scroll();
        }
        // Si no, es se sigue arrastrando o la velocidad es menor que el umbral, 
        // por lo que pone la direccion a 0 porque se esta manteniendo pulsado 
        // o porque tiene que detenerse, respectivamente
        else {
            this.scrollDir = 0;
        }

        // Mientras el scroller se mueva, se hace culling de los objetos
        if (this.dragging || Math.abs(this.scrollDir) > this.velThreshold) {
            this.cull();
        }
    }


    /**
    * Anade el objeto indicado en un indice especifico
    * @param {Phaser.GameObject} gameObject - objeto a anadir 
    * @param {Number} index - indice en el que introducir el objeto 
    * @returns {Phaser.GameObject} - objeto anadido
    */
    addByIndex(gameObject, index, align = null) {
        // Si el indice supera el numero de elementos de la lista, anade el objeto al final y no hace nada mas
        if (index > this.scroller.list.length) {
            this.addToEnd(gameObject)
            return;
        }
        // Si no, si el indice es mayor que 0, el ultimo objeto introducido sera el anterior al del indice indicado 
        else if (index > 0) {
            this.lastItem = this.scroller.list[index - 1];
        }
        // Si no, el indice es 0 o menor, por lo que se anadira al principio y no habra objeto anterior
        else {
            index = 0;
            this.lastItem = null;
        }

        // Se guardan los objetos posteriores al indice en el que introducir el objeto
        // (incluyendo el que ahora esta en dicho indice) y se quitan de la lista. Se quitan 
        // de la lista en lugar de desplazarlos para que su indice coincida con su posicion
        let elementsToMove = [];
        for (let i = index; i < this.scroller.list.length; i++) {
            elementsToMove.push(this.scroller.list[i]);
        }
        elementsToMove.forEach(elem => {
            this.scroller.remove(elem);
        });

        // Se anade el objeto indicado al final
        this.addToEnd(gameObject, align);
        
        // Se van anadiendo los objetos posteriores al final uno a uno
        elementsToMove.forEach(elem => {
            this.addToEnd(elem);
        });
        elementsToMove = [];

        return gameObject;
    }

    /**
    * Anade el objeto indicado al final de la lista
    * 
    * Se ignoran (en el eje correspondiente) el origen y la posicion inicial de todos los objetos, 
    * pero no en el eje opuesto para que todos los objetos esten siempre a la misma distancia y 
    * el inicio y el final de la lista coincidan con los laterales correspondientes:
    * 
    *   - En el scroll horizontal se ignora el eje x (pero no el y), el primer objeto empezara con su lateral 
    *   izquierdo en el margen izquierdo, y el lateral derecho del ultimo objeto delimitara el final de la lista 
    * 
    *   - En el scroll vertical se ignora el eje y (pero no el x), el primer objeto empezara con su lateral 
    *   superior en el margen superior, y el lateral inferior del ultimo objeto delimitara el final de la lista 
    * 
    * @param {Phaser.GameObject} gameObject - objeto a anadir
    * @param {Number} - align - alineamiento (y si es scroll horizontal, x si es vertical) en la lista con el que se quiere anadir el objeto. 
    *                           Si no es un numero, se alinea segun el origen del objeto [0, 1] (opcional)
    * @returns {Phaser.GameObject} - objeto anadido
    */
    addToEnd(gameObject, align = null) {
        // Calcula la posicion correspondiente en el eje del scroll
        let margin = this.horizontalScroll ? this.leftMargin : this.topMargin;
        let objectDim = this.horizontalScroll ? gameObject.displayWidth : gameObject.displayHeight;
        let objectOrigin = this.horizontalScroll ? gameObject.originX : gameObject.originY;
        
        
        let pos = 0;
        if (this.lastItem == null) {
            pos = margin + objectDim * objectOrigin;
        }
        else {
            let lastItemPos = this.horizontalScroll ? this.lastItem.x : this.lastItem.y;
            let lastItemDim = this.horizontalScroll ? this.lastItem.displayWidth : this.lastItem.displayHeight;
            let lastItemOrigin = this.horizontalScroll ? this.lastItem.originX : this.lastItem.originY

            pos = (lastItemPos + lastItemDim * (1 - lastItemOrigin)) + this.itemSpacing + (objectDim * objectOrigin);
        }

        // Calcula la posicion correspondiente al alineamiento
        let oppositePos = this.horizontalScroll ? gameObject.y : gameObject.x;
        let oppositeDim = this.horizontalScroll ? this.height : this.width;
        let initialMargin = this.horizontalScroll ? this.topMargin : this.leftMargin;
        let endMargin = this.horizontalScroll ? this.bottomMargin : this.rightMargin;
        let oppositeObjectDim = this.horizontalScroll ? gameObject.displayHeight : gameObject.displayWidth;
        let alignPos = oppositePos;

        if (align != null) {
            let margin = (oppositeDim * align) - oppositeObjectDim * align;
            if (align < 0.5) {
                margin = initialMargin;
            }
            else if (align > 0.5) {
                margin -= endMargin ;
            }
            alignPos = objectDim * objectOrigin + margin
        }

        if (this.horizontalScroll) {
            gameObject.x = pos;
            gameObject.y = alignPos;
        }
        else {
            gameObject.y = pos;
            gameObject.x = alignPos;
        }

        // Se guarda el objeto insertado como ultimo objeto y se anade a la lista
        this.lastItem = gameObject;
        this.scroller.add(gameObject);

        this.cull();
        return gameObject;
    }

    /**
    * Anade el objeto indicado al principio de la lista
    * @param {Phaser.GameObject} gameObject - objeto a anadir
    * @returns {Phaser.GameObject} - objeto anadido
    */
    addToBeginning(gameObject, align = null) {
        return this.addByIndex(gameObject, -1, align);
    }


    /**
    * Elimina el objeto de la lista en el indice especificado
    * @param {Number} index - indice del objeto en la lista a eliminar 
    * @returns {Phaser.GameObject} - objeto eliminado
    */
    removeByIndex(index) {
        // Si el indice no esta en la lista, no se hace nada
        if (index < 0 || index >= this.scroller.list.length) {
            return null;
        }

        // Se guardan los objetos a partir del indice en el que introducir el objeto (incluido el que se va a eliminar)
        let elementsToMove = [];
        for (let i = index; i < this.scroller.list.length; i++) {
            elementsToMove.push(this.scroller.list[i]);
        }

        // Se eliminan los objetos guardados
        elementsToMove.forEach(elem => {
            this.scroller.remove(elem);
        });

        // Se elimina el objeto a eliminar de los objetos guardados
        let removedElem = elementsToMove.shift();

        // Se guarda el ultimo objeto sin modificar de la lista
        this.lastItem = this.scroller.list.length == 0 ? null : this.scroller.list[index - 1];

        // Se anade de nuevo el resto de los objetos guardados
        elementsToMove.forEach(elem => {
            this.addToEnd(elem);
        });
        elementsToMove = [];

        return removedElem;
    }

    /**
    * Elimina el ultimo elemento de la lista
    * @returns {Phaser.GameObject} - objeto eliminado
    */
    removeLast() {
        return this.removeByIndex(this.scroller.list.length - 1);
    }

    /**
    * Elimina el primer elemento de la lista
    * @returns {Phaser.GameObject} - objeto eliminado
    */
    removeFirst() {
        return this.removeByIndex(0);
    }

    /**
    * Elimina el objeto especificado de la lista
    * @param {Phaser.GameObject} gameObject - objeto a eliminar
    * @returns {Phaser.GameObject} - objeto eliminado
    */
    removeItem(gameObject) {
        return this.removeByIndex(this.scroller.list.indexOf(gameObject));
    }


    /**
    * Detiene el scroll de golpe
    */
    stopScroll() {
        this.scrollDir = 0;
    }

    /**
    * Navega directamente hasta la parte superior
    */
    toTop() {
        if (!this.horizontalScroll) {
            this.stopScroll();
            this.scroller.y = this.getLocalBounds().top;
        }
    }

    /**
    * Navega directamente hasta la parte inferior
    */
    toBottom() {
        if (!this.horizontalScroll) {
            this.stopScroll();
            this.toTop();
            this.scroller.y += - this.scroller.displayHeight + this.height - this.bottomMargin; 
        }
    }

    /**
    * Navega directamente hasta la izquierda
    */
    toLeft() {
        if (this.horizontalScroll) {
            this.stopScroll();
            this.scroller.x = this.getLocalBounds().left;
        }
    }

    /**
    * Navega directamente hasta la derecha
    */
    toRight() {
        if (this.horizontalScroll) {
            this.stopScroll();
            this.toLeft();
            this.scroller.x += - this.scroller.displayWidth + this.width - this.rightMargin; 
        }
    }
}