import Singleton from "../utils/singleton.js";

export default class BaseTrackerManager extends Singleton {
    /**
    * Wrapper del tracker basado en el estandar xApi.
    * Centraliza la gestion y el envio de eventos desde cualquier parte
    */
    constructor() {
        super("TrackerManager");

        this.seriousGameTracker = null;
        this.gameTitle = null;
    }

    /**
    * Inicializa el tracker con una instancia del tracker y con el titulo del juego
    * @param {SeriousGameTracker} seriousGameTracker 
    * @param {String} gameTitle 
    */
    init(seriousGameTracker, gameTitle) {
        this.seriousGameTracker = seriousGameTracker;
        this.gameTitle = gameTitle;
    }

    sendInitializeDialog(name, dialog) {
        this.seriousGameTracker.Completable(`${name.trim()} ${dialog.trim()}`, this.seriousGameTracker.COMPLETABLETYPE.STORYNODE)
            .Initialized()
            .Send();
    }

    sendCompleteDialog(name, dialog) {
        this.seriousGameTracker.Completable(`${name.trim()} ${dialog.trim()}`, this.seriousGameTracker.COMPLETABLETYPE.STORYNODE)
            .Completed(true, true, 1)
            .Send();
    }

    sendSelectChoice(id, response) {
        this.seriousGameTracker.Alternative(id, this.seriousGameTracker.ALTERNATIVETYPE.DIALOG)
            .Selected(response)
            .Send();
    }

    sendInitializeScene(sceneKey) {
        this.seriousGameTracker.Accessible(sceneKey, this.seriousGameTracker.ACCESSIBLETYPE.SCREEN)
            .Accessed()
            .Send();

        this.seriousGameTracker.Completable(sceneKey, this.seriousGameTracker.COMPLETABLETYPE.COMPLETABLE)
            .Initialized()
            .Send();
    }

    sendCompleteScene(sceneKey) {
        this.seriousGameTracker.Completable(sceneKey, this.seriousGameTracker.COMPLETABLETYPE.COMPLETABLE)
            .Completed(true, true, 1)
            .Send();
    }

    sendAccessCutscene(sceneKey) {
        this.seriousGameTracker.Accessible(sceneKey, this.seriousGameTracker.ACCESSIBLETYPE.SCREEN)
            .Accessed()
            .Send();
    }

    sendInteractGameObject(id, npc = false, extensions = {}) {
        let type = this.seriousGameTracker.GAMEOBJECTTYPE.ITEM;
        if (npc) {
            type = this.seriousGameTracker.GAMEOBJECTTYPE.NPC;
        }
        this.seriousGameTracker.GameObject(id, type)
            .Interacted()
            .WithResultExtensions(extensions)
            .Send();
    }

    sendSelectMenuOption(id, response, extensions = {}) {
        this.seriousGameTracker.Alternative(id, this.seriousGameTracker.ALTERNATIVETYPE.MENU)
            .Selected(response)
            .WithResultExtensions(extensions)
            .Send();
    }

    sendSelectLanguage(language) {
        this.sendSelectMenuOption("language", language);
    }

    async sendInitializeGame() {
        await this.seriousGameTracker.Completable(this.gameTitle, this.seriousGameTracker.COMPLETABLETYPE.GAME)
            .Initialized()
            .Send();
        await this.seriousGameTracker.Flush();
    }

    async sendProgressGame(progress, extensions = {}) {
        await this.seriousGameTracker.Completable(this.gameTitle, this.seriousGameTracker.COMPLETABLETYPE.GAME)
            .Progressed(progress)
            .WithResultExtensions(extensions)
            .Send();
        await this.seriousGameTracker.Flush();
    }

    async sendCompleteGame(completion) {
        await this.Completed(this.gameTitle, this.seriousGameTracker.COMPLETABLETYPE.GAME, completion, true, 1)
            .Send();
        await this.seriousGameTracker.Flush({ withBackup: true });
    }
}