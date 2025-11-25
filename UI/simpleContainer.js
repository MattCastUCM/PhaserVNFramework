export default class SimpleContainer extends Phaser.GameObjects.Container {
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

        this.CANVAS_WIDTH = scene.sys.game.canvas.width
        this.CANVAS_HEIGHT = scene.sys.game.canvas.height;

        // Origen modificable (las propiedades originX y originY de los containers no se pueden 
        // sobreescribir y por defecto son (0.5, 0.5) aunque su origen real sea (0,0) )
        this.origin_x = 0;
        this.origin_y = 0;

        // Offset aplicado a los hijos al cambiar el origen
        this.offsetX = 0;
        this.offsetY = 0;

        scene.add.existing(this);

        // Rectangulo que se coloca en la esquina superior izquierda del container para marcar su posicion
        this.posMark = scene.add.rectangle(0, 0, 0, 0, 0x0, 1).setVisible(false);
    }

    /**
    * Calcula y establece las dimensiones (en coordenadas globales) del container en base a todos sus hijos
    */
    calculateRectangleSize() {
        super.add(this.posMark);
        
        // Esta en coordenadas globales
        let dims = this.getBounds();
        this.setSize(dims.width, dims.height);

        super.remove(this.posMark);
    }

    /**
    * Devolver todos los hijos que hay en el container, incluyendo los hijos de cualquier container hijo
    * @returns {Array, Phaser.GameObject}
    */
    getAllChildren() {
        let allChildren = [];
        // Se usa una pila para procesar los container.
        // Se comienza con el container actual
        let containerStack = [this];

        while (containerStack.length > 0) {
            // Se extrae el container mas reciente para procesar sus hijos
            let container = containerStack.pop();
            container.list.forEach(child => {
                // Si el hijo es un container, se mete en la pila
                if (child instanceof Phaser.GameObjects.Container) {
                    containerStack.push(child);
                }
                else {
                    // Si no, se anade a la lista de hijos
                    allChildren.push(child);
                }
            })
        }

        return allChildren;
    }

    /**
    * Convertir un punto de coordenadas globales (mundo) a coordenadas locales del container
    * @param {Number} worldX - posicion x en el espacio global
    * @param {Number} worldY - posicion y en el espacio global
    * @returns {{x: Number, y: Number}} - posiciones x, y en el espacio local
    */
    worldToLocal(worldX, worldY) {
        // Se obtiene la matriz de transformaciones global (mundo) del container
        let matrix = this.getWorldTransformMatrix();

        // La matriz de mundo convierte local -> global,
        // asi que su inversa global -> local
        let localPoint = matrix.applyInverse(worldX, worldY);
        return localPoint;
    }

    /**
    * Guarda la posicion inicial del objeto indicado antes de aplicarle el offset
    * @param {Phaser.GameObject} gameObject - objeto a introducir
    */
    saveInitialPosition(gameObject) {
        if (gameObject != null && gameObject.originalPosition == null) {
            gameObject.originalPosition = {
                x: gameObject.x,
                y: gameObject.y
            }
        }
    }

    /**
    * Reinicia la posicion del objeto a la que tenia antes de meterlo al container
    * @param {Phaser.GameObject} gameObject - objeto cuya posicion reiniciar
    */
    resetPosition(gameObject) {
        if (gameObject != null && gameObject.originalPosition != null) {
            gameObject.setPosition(gameObject.originalPosition.x, gameObject.originalPosition.y);
        }
    }

    /**
    * Cambiar el origen del container 
    * Para ello, se desplazan todos los elementos en el espacio local del container para que su bounding box
    * completa (incluyendo las distancias entre la esquina superior izquierda del container y las posiciones 
    * locales de los elementos) tenga su origen (originX, originY) en la posicion (x, y) global del container
    * @param {Number} originX - origen en x [0, 1] (opcional)
    * @param {Number} originY - origen en y [0, 1] (opcional)
    * @param {Boolean} recalculateSize - true si se quiere volver a calcular el tamano del container, false en caso contrario (opcional)
    */
    setOrigin(originX = 0.5, originY = originX, recalculateSize = true) {
        // Se guarda 
        this.origin_x = originX;
        this.origin_y = originY;

        // Se guardan las posiciones de los hijos que no la tuvieran guardada
        // y se reinician para calcular correctamente el origen
        this.list.forEach(child => {
            this.saveInitialPosition(child);
            this.resetPosition(child);
        });

        // Se anade la marca de posicion para tenerla en cuenta para la bounding box
        super.add(this.posMark);

        // Se obtiene la bounding box, que esta en coordenadas globales
        let bounds = this.getBounds();

        // Se elimina la marca de posicion para que no se mueva con el resto de elementos
        super.remove(this.posMark);

        // Se convierte la esquina superior izquierda a coordenadas locales
        let topLeft = this.worldToLocal(bounds.x, bounds.y);
        let width = bounds.width;
        let height = bounds.height;

        // Se calcula el offset, que depende del origen definido
        this.offsetX = topLeft.x + width * originX;
        this.offsetY = topLeft.y + height * originY;
        
        // Se aplica el offset a todos los hijos para ajustar su posicion relativa
        this.list.forEach(child => {
            child.x -= this.offsetX;
            child.y -= this.offsetY;
        });

        if (recalculateSize) {
            this.calculateRectangleSize();
        }
    }

    /**
    * Anade el objeto indicado al container y le aplica el offset respectivo al origen establecido
    * @param {Phaser.GameObject} gameObject - objeto a anadir
    * @param {Boolean} recalculateSize - true si se quiere volver a calcular el tamano del container, false en caso contrario (opcional)
    */
    add(gameObject, recalculateSize = true) {
        super.add(gameObject);

        this.saveInitialPosition(gameObject);
        
        gameObject.x += this.offsetX;
        gameObject.y += this.offsetY;
        
        this.setOrigin(this.origin_x, this.origin_y, recalculateSize);
        
        if (recalculateSize) {
            this.calculateRectangleSize();
        }
    }

    /**
    * Elimina el objeto indicado del container y lo coloca en su posicion original
    * @param {Phaser.GameObject} gameObject - objeto a anadir
    */
    remove(gameObject, recalculateSize = true) {
        if (this.list.includes(gameObject)) {
            super.remove(gameObject);

            if (gameObject.originalPosition != null) {
                gameObject.setPosition(gameObject.originalPosition.x, gameObject.originalPosition.y);
                gameObject.originalPosition = null;
            }

            this.setOrigin(this.origin_x, this.origin_y, recalculateSize);
            
            if (recalculateSize) {
                this.calculateRectangleSize();
            }
        }
    }
}