import { IClick, IMouseMove, IScroll, ITimeOnPage } from "../types/events";
import { random_string } from "../utils/random_string";

class Trackify {
    private static isEnabled: boolean = true;
    private static instance: Trackify;
	private static TR_URL: string;

    // global arrays for storing data
    private static mousemoveEvents: IMouseMove[] = [];
    private static scrollEvents: IScroll[] = [];
    private static clickEvents: IClick[] = [];
    private static timeOnPage: ITimeOnPage = {
        userId: random_string(16),
        url: window.location.href,
        startTime: Date.now(),
        endTime: Date.now(),
    };

    private constructor() {}

    public static getInstance(): Trackify {
        if (Trackify.instance) return Trackify.instance;
        else Trackify.instance = new Trackify();
        return Trackify.instance;
    }

	public static setUrl(TR_URL: string) {
		this.TR_URL = TR_URL	
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
                    "x" in payload &&
                    "y" in payload; /* && "element" in payload */

                if (!missingPayload) return;
                this.clickEvents.push({ ...payload, timestamp });
            },

            timeOnPage: async () => {
                console.log(this.timeOnPage);

                if (!this.timeOnPage) {
                    return (this.timeOnPage = {
                        userId: random_string(16),
                        url: window.location.href,
                        startTime: Date.now(),
                        endTime: Date.now(),
                    });
                }

                if (this.timeOnPage.url !== window.location.href) {
                    await this.sendTimeToServer();

                    return (this.timeOnPage = {
                        userId: random_string(16),
                        url: window.location.href,
                        startTime: Date.now(),
                        endTime: Date.now(),
                    });
                }

                await this.sendTimeToServer();
                this.timeOnPage = {
                    userId: this.timeOnPage.userId,
                    url: this.timeOnPage.url,
                    startTime: this.timeOnPage.startTime,
                    endTime: Date.now(),
                };
            },
        };

        if (!eventHandlers[eventName]) return;
        eventHandlers[eventName](payload);
    }

    // send data to Trackify-Server
    private static async sendEventsToServer() {

        const payload = {
            mousemoveEvents: [...this.mousemoveEvents],
            scrollEvents: [...this.scrollEvents],
            clickEvents: [...this.clickEvents],
        };

        try {
            const response = await fetch(this.TR_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                this.mousemoveEvents = [];
                this.scrollEvents = [];
                this.clickEvents = [];
            } else {
                console.error("Failed to send events:", response.statusText);
            }
        } catch (error) {
            console.error("Error sending events:", error);
        }
    }

    private static async sendTimeToServer() {
        console.log("time sended");
    }

    // start periodic event sending
    public static startPeriodicSending() {
        setInterval(() => {
            this.sendEventsToServer();
        }, 9000);
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
