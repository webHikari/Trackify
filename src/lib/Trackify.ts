class Trackify {
    private static isEnabled: boolean = true;
    private static instance: Trackify;

    private constructor() {}

    public static getInstance(): Trackify {
        if (!Trackify.instance) {
            Trackify.instance = new Trackify();
        }
        return Trackify.instance;
    }

    public static enableTracking() {
        Trackify.isEnabled = true;
    }

    public static disableTracking() {
        Trackify.isEnabled = false;
    }

    public static trackEvent(eventName: string, payload: object = {}) {
        if (Trackify.isEnabled) {
            console.log("Event:", eventName, payload);
        }
    }
}

export default Trackify;
