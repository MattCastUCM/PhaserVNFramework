import InteractiveContainer from "./interactiveContainer.js";
import SimpleContainer from "./simpleContainer.js";

export default class ScrollListView extends InteractiveContainer {
    /**
    * Clase para listas deslizables que contienen otros tipos de objetos
    * @extends InteractiveContainer
    * @param {Phaser.Scene} scene - escena en la que se va a crear 
    * @param {number} x - posicion x
    * @param {number} y - posicion y
    * @param {number} width - ancho del area visible
    * @param {number} height - alto del area visible
    * @param {number} horizontalScroll - true si la lista es horizontal, false si es vertical 
    * @param {number} itemSpacing - espacio entre los objetos
    * @param {number} leftMargin - espacio entre el extremo izquierdo del primer elemento y el extremo izquierdo del area visible
    * @param {number} rightMargin - espacio entre el extremo derecho del ultimo elemento y el extremo derecho del area visible
    * @param {number} topMargin - espacio entre el extremo superior del primer elemento y el extremo superior del area visible
    * @param {number} bottomMargin - espacio entre el extremo inferior del ultimo elemento y el extremo inferior del area visible
    * @param {number} dragThreshold - cantidad minima que necesita arrastrarse la lista para que comience a moverse
    * @param {number} scrollSpeed - velocidad a la que se arrastra
    * @param {number} deceleration - cantidad de deceleracion cuando se la lista se esta moviendo y se deja de arrastrar
    * @param {number} velThreshold - velocidad minima que tiene que tener la lista antes de pararse del todo
    */
    constructor(scene, x = 0, y = 0, width, height, horizontalScroll = false, itemSpacing = 0, 
        leftMargin = 0, rightMargin = 0, topMargin = 0, bottomMargin = 0, scrollSpeed = 1, deceleration = 0.99, velThreshold = 0.1) 
    {
        super(scene, x, y);

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
        this.interactiveRect = scene.add.rectangle(0, 0, width, height, 0xffffff, 0.5).setVisible(false);
        super.add(this.interactiveRect, true);

        // Mascara para ocultar todo lo que haya fuera del area indicada
        let maskRect = scene.add.rectangle(x, y, width, height, 0x0000ff, 0.5).setVisible(false);
        this.maskObj = maskRect.createGeometryMask();
        this.setMask(this.maskObj);
        // this.mask.setInvertAlpha(true);

        // Configuracion de los eventos de arrastrar
        this.setInteractive();
        this.off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP);

        // Se tiene que hacer arrastrable desde el input de la escena, 
        // ya que los containers por defecto no son arrastrables
        scene.input.setDraggable(this, true);

        this.dragging = false;
        let lastDrag = 0;
        this.on(Phaser.Input.Events.GAMEOBJECT_DRAG_START, (pointer) => {
            lastDrag = this.horizontalScroll ? pointer.x : pointer.y;
            this.dragging = true;
        });

        this.scrollDir = 0;
        this.on(Phaser.Input.Events.GAMEOBJECT_DRAG, (pointer) => {
            this.scrollDir = this.horizontalScroll ? pointer.x - lastDrag : pointer.y - lastDrag;
            lastDrag = this.horizontalScroll ? pointer.x : pointer.y;
            this.scroll();
        });

        this.on(Phaser.Input.Events.GAMEOBJECT_DRAG_END, (pointer) => {
            this.dragging = false;
            lastDrag = this.horizontalScroll ? pointer.x : pointer.y;
        });


        // Container con los elementos de la listView que van a scrollear
        // independientemente del origen del container, se coloca en la esquina superior izquierda
        this.scroller = new SimpleContainer(scene, this.getLocalBounds().left, this.getLocalBounds().top);
        this.scroller.setOrigin(0, 0);
        this.add(this.scroller);


        // Ultimo objeto introducido en la lista (para calcular la posicion del siguiente)
        this.lastItem = null;

        // this.test1();
    }

    test1(color = 0x0000FF) {
        this.itemSpacing = 10
        this.topMargin = this.bottomMargin = this.leftMargin = this.rightMargin = 15;

        // let bgScale = 1;
        // let biggerBg = this.scene.add.rectangle(0, 0, this.width * bgScale, this.height * bgScale, 0xFF0000, 0.5);
        // this.scroller.add(biggerBg);
        // biggerBg.setInteractive();
        // biggerBg.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => { console.log("bg") });
        // this.sendToBack(biggerBg);
        // this.scroller.calculateRectangleSize();

        this.horizontalScroll = true;

        let size = 100;
        let rect1 = this.addToEnd(this.scene.add.rectangle(0, 0, size, size, color, 1), 0);
        let rect2 = this.addToEnd(this.scene.add.rectangle(0, 0, size, size * 2, color, 1).setOrigin(0, 0), 1);
        let rect3 = this.addToEnd(this.scene.add.rectangle(0, 100, size, size, color, 1), 0.5);
        let rect4 = this.addToEnd(this.scene.add.rectangle(0, 0, size, size * 2, color, 1).setOrigin(0, 0), 0);
        
        this.scene.setInteractive(rect1);
        rect1.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            console.log("rec1")
        });

        this.scene.setInteractive(rect2);
        rect2.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            console.log("rec2")
        });

        this.scene.setInteractive(rect3);
        rect3.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            console.log("rec3")
        });

        this.scene.setInteractive(rect4);
        rect4.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            console.log("rec4")
        });

        // this.once(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        //     let removed = this.removeItem(rect3);

        //     if (this.horizontalScroll) {
        //         this.toRight();
        //     }
        //     else {
        //         this.toBottom();
        //     }
        //     this.once(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        //         this.addToEnd(removed);
        //         if (this.horizontalScroll) {
        //             this.toLeft();
        //         }
        //         else {
        //             this.toTop();
        //         }

        //     });
        // });

        this.toLeft();
        this.cull();
    }

    setOrigin(x, y, recalculateSize = false) {
        // Se recoloca el scroller para que no haya problemas al cambiar el offset de los hijos
        //
        // Si no se hace esto y el scroller es mas grande que el area visible, para calcular el
        // offset que se tienen que mover los hijos, se utilizara la bounding box total de todo
        // el container, incluyendo las dimensiones del scroller.
        //
        // Por ejemplo, si se quiere centrar el container a la derecha y el scroller esta en el
        // limite izquierdo, lo que quedara en el punto xy no sera el lateral derecho de la zona
        // visible, sino el lateral derecho de todo el scroller, incluidas las zonas invisibles,
        // por lo que los elementos quedaran mas a la izquierda de lo que tendrian que estar
        if (this.scroller != null) {
            // Se elimina la posicion original del scroller
            super.removeOriginalPosition(this.scroller.originalPosition);

            // Se coloca el scroller en un extremo u otro dependiendo del origen que se le vaya a asignar
            this.scroller.x = - this.scroller.displayWidth / 2;
            if (x < 0.5) {
                this.toLeft();
            }
            else if (x > 0.5) {
                this.toRight();
            }
            this.scroller.y = - this.scroller.displayHeight / 2;
            if (y < 0.5) {
                this.toTop();
            }
            else if (y > 0.5) {
                this.toBottom();
            }

            // Se vuelve a guardar la posicion original del scroller
            super.saveOriginalPosition(this.scroller);

            this.cull();
        }
        super.setOrigin(x, y, recalculateSize);

        // Se recoloca el area de interaccion
        if (this.input != null) {
            this.input.hitArea = {
                width: this.interactiveRect.width,
                height: this.interactiveRect.height,
                x: this.interactiveRect.x,
                y: this.interactiveRect.y
            }
        }

    }

    /**
     * Anade un objeto al container. Llama al metodo de su padre con el parametro de recalcular el tamano a false
     * @returns {Phaser.GameObjects.GameObject} - objeto anadido
     */
    add(gameObject) {
        return super.add(gameObject, false);
    }

    /**
    * Devuelve la posicion de los laterales en coordenadas locales teniendo en cuenta el origen
    * @returns {object} - objeto con la posicion local de los laterales izquierdo, derecho, superior e inferior
    */
    getLocalBounds() {
        return {
            left: - this.width * this.originX,
            top: - this.height * this.originY,
            right: (- this.width * this.originX) + this.width,
            bottom: (- this.height * this.originY) + this.height
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

            let origin = this.horizontalScroll ? this.originX : this.originY;

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

            // Se ajustan las colisiones de los objetos que son visibles pero estan cortados 
            if (!hide && elem.input != null) {
                let initExcess = scrollerPos + objStart - minDim;
                let endExcess = maxDim - (scrollerPos + objEnd);
                
                if (initExcess < 0 || endExcess < 0) {
                    let excess = Math.min(initExcess, endExcess);

                    let x = 0;
                    let y = 0;
                    if (initExcess < endExcess) {
                        x = this.horizontalScroll ? -excess : 0;
                        y = this.horizontalScroll ?  0 : -excess;
                    }
                    let w = this.horizontalScroll ? elem.width + excess : elem.width;
                    let h = this.horizontalScroll ? elem.height : elem.height + excess;

                    elem.input.hitArea = {
                        width: w,
                        height: h,
                        x: x,
                        y: y
                    }
                 }
                else if (elem.input.hitArea.width != elem.width || elem.input.hitArea.height != elem.height || elem.input.hitArea.x != elem.x || elem.input.hitArea.y != elem.y) {
                    elem.input.hitArea = {
                        width: elem.width,
                        height: elem.height,
                        x: 0,
                        y: 0
                    }
                }
            }
        });
    }

    preUpdate(t, dt) {
        this.maskObj.geometryMask.setPosition(this.x + this.width * (0.5 - this.originX), this.y + this.height * (0.5 - this.originY));

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
    * @param {Phaser.GameObjects.GameObject} gameObject - objeto a anadir 
    * @param {number} index - indice en el que introducir el objeto 
    * @returns {Phaser.GameObjects.GameObject} - objeto anadido
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
    * Anade el objeto indicado al final de la lista (derecha/abajo)
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
    * @param {Phaser.GameObjects.GameObject} gameObject - objeto a anadir
    * @param {number} align - alineamiento (y si es scroll horizontal, x si es vertical) con el que se quiere anadir el objeto en la lista [0, 1] (opcional) Si no es un numero, se alinea segun el origen del objeto
    * @returns {Phaser.GameObjects.GameObject} - objeto anadido
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
                margin -= endMargin;
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
    * Anade el objeto indicado al principio de la lista (izquierda/arriba)
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
    * @param {Phaser.GameObjects.GameObject} gameObject - objeto a anadir
    * @param {number} align - alineamiento (y si es scroll horizontal, x si es vertical) con el que se quiere anadir el objeto en la lista [0, 1] (opcional) Si no es un numero, se alinea segun el origen del objeto
    * @returns {Phaser.GameObjects.GameObject} - objeto anadido
    */
    addToBeginning(gameObject, align = null) {
        return this.addByIndex(gameObject, -1, align);
    }


    /**
    * Elimina el objeto de la lista en el indice especificado (los indices van de izquierda -> derecha / arriba -> abajo)
    * @param {number} index - indice del objeto en la lista a eliminar 
    * @returns {Phaser.GameObjects.GameObject} - objeto eliminado
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
    * Elimina el ultimo elemento de la lista (derecha/abajo)
    * @returns {Phaser.GameObjects.GameObject} - objeto eliminado
    */
    removeLast() {
        return this.removeByIndex(this.scroller.list.length - 1);
    }

    /**
    * Elimina el primer elemento de la lista (izquierda/arriba)
    * @returns {Phaser.GameObjects.GameObject} - objeto eliminado
    */
    removeFirst() {
        return this.removeByIndex(0);
    }

    /**
    * Elimina el objeto especificado de la lista
    * @param {Phaser.GameObjects.GameObject} gameObject - objeto a eliminar
    * @returns {Phaser.GameObjects.GameObject} - objeto eliminado
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