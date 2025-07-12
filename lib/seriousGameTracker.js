export default async function createSeriousGameTracker(defaultUri) {
    let seriousGameTracker = new SeriousGameTracker();
    seriousGameTracker.trackerSettings.defaultUri = defaultUri;
    seriousGameTracker.trackerSettings.generateSettingsFromURLParams = true;
    await seriousGameTracker.Login();
    seriousGameTracker.Start();
    return seriousGameTracker;
}