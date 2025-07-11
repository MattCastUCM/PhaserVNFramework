import Blackboard from "../utils/blackboard.js";
import SceneManager from "../managers/sceneManager.js";
import LocalizationManager from "../managers/localizationManager.js";
import EventDispatcher from "../managers/eventDispatcher.js";
import { setInteractive } from "../utils/misc.js";
import BaseTrackerManager from "../managers/baseTrackerManager.js";

export default class BaseScene extends Phaser.Scene {
    /**
    * Escena base para las escenas del juego. Guarda parametros como las dimensiones del canvas o los managers
    * @extends Phaser.Scene
    * @param {String} name - id de la escena
    * @param {String} atlasName - nombre del atlas que se utiliza en esta escena (opcional)
    */
    constructor(name, atlasName = "") {
        super({ key: name });

        this.atlasName = atlasName;
    }

    init(params) {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;
    }

    create(params) {
        this.blackboard = new Blackboard();

        this.sceneManager = SceneManager.getInstance();
        this.localizationManager = LocalizationManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();
        this.trackerManager = BaseTrackerManager.getInstance();

        this.localizationManager.subscribeBlackboard(this.blackboard);

        // Funciones adicionales a las que se llamara al crear y reactivar la escena
        this.events.once("create", () => {
            this.onCreate(params);
        }, this);
        this.events.on("wake", (scene, params) => {
            this.onWake(params);
        }, this);
    }


    /**
    * Se llama al terminar de crear la escena. Se encarga de llamar initialSetup
    * @param {Object} params - objeto con los parametros que pasarle a initialSetup 
    */
    onCreate(params) {
        this.initialSetup(params);
    }

    /**
    * Se llama al despertar la escena. Se encarga de llamar initialSetup
    * @param {Object} params - objeto con los parametros que pasarle a initialSetup 
    */
    onWake(params) {
        this.initialSetup(params);
    }

    /**
    * Limpia los eventos del dispatcher
    */
    shutdown() {
        this.localizationManager.unsubscribeBlackboard(this.blackboard);

        if (this.dispatcher != null) {
            this.dispatcher.removeByObject(this);
        }
    }

    /**
    * Se encarga de configurar la escena con los parametros iniciales y
    * @param {Object} params - parametros que se le pasan a la configuracion inicial 
    */
    initialSetup(params) { }

    setInteractive(gameObject, config = {}) {
        setInteractive(gameObject, config);
    }
}