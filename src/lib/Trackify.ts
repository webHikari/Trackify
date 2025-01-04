import { IClick, IMouseMove, IScroll } from "../types/events";

class Trackify {
    private static isEnabled: boolean = true;
    private static instance: Trackify;

    // global arrays for storing data
    private static mousemoveEvents: IMouseMove[] = [];
    private static scrollEvents: IScroll[] = [];
    private static clickEvents: IClick[] = [];

    private constructor() {}

    public static getInstance(): Trackify {
        if (Trackify.instance) return Trackify.instance;
        else Trackify.instance = new Trackify();
        return Trackify.instance;
    }

    // turn on-off methods
    public static enableTracking() {
        Trackify.isEnabled = true;
    }

    public static disableTracking() {
        Trackify.isEnabled = false;
    }

    // register event in arrays
    public static trackEvent(eventName: string, payload: object = {}) {
        if (!Trackify.isEnabled) return;

        const timestamp = Date.now();

        const eventHandlers: { [key: string]: (payload: any) => void } = {
            "mouse-move": (payload) => {
                if (!("x" in payload && "y" in payload)) return;
                this.mousemoveEvents.push({ ...payload, timestamp });
            },

            scroll: (payload) => {
                if (!("scrollY" in payload)) return;
                this.scrollEvents.push({ ...payload, timestamp });
            },

            click: (payload) => {
                const missingPayload =
                    "x" in payload && "y" in payload && "element" in payload;

                if (!missingPayload) return;
                this.clickEvents.push({ ...payload, timestamp });
            },
        };

        if (!eventHandlers[eventName]) return;
        eventHandlers[eventName](payload);
    }

    // getters for getting arrays of events
    public static getMousemoveEvents() {
        return this.mousemoveEvents;
    }

    public static getScrollEvents() {
        return this.scrollEvents;
    }

    public static getClickEvents() {
        return this.clickEvents;
    }
}

export default Trackify;
