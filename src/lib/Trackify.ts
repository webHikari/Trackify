import { ITimeOnPage } from "../types/events";
import { random_string } from "../utils/random_string";

class Trackify {
    private static isEnabled: boolean = true;
    private static instance: Trackify;
    private static TR_URL: string;

    private static userId: string =
        localStorage.getItem("userId") || random_string(16);

    // global arrays for storing data
    private static timeOnPage: ITimeOnPage = {
        userId: this.userId,
        url: window.location.href,
        startTime: Date.now(),
        endTime: Date.now(),
    };

    private constructor() {
        localStorage.setItem("userId", Trackify.userId);
    }

    public static getInstance(): Trackify {
        if (Trackify.instance) return Trackify.instance;
        else Trackify.instance = new Trackify();
        return Trackify.instance;
    }

    public static setUrl(TR_URL: string) {
        this.TR_URL = TR_URL;
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
        const eventHandlers: { [key: string]: (payload: any) => void } = {
            timeOnPage: async () => {
                console.log(this.timeOnPage);

                if (!this.timeOnPage) {
                    return (this.timeOnPage = {
                        userId: this.userId,
                        url: window.location.href,
                        startTime: Date.now(),
                        endTime: Date.now(),
                    });
                }

                if (this.timeOnPage.url !== window.location.href) {
                    await this.sendTimeToServer();

                    return (this.timeOnPage = {
                        userId: this.userId,
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

    // send data to server
    private static async sendTimeToServer() {
        await fetch(`${this.TR_URL}/time`, {
            method: "POST",
            body: JSON.stringify(this.timeOnPage),
        });
        console.log("time sended");
    }

    public static async getGeoStatistics() {
        const response = await fetch(`${this.TR_URL}/geo-statistics`);
        return response.json();
    }

    public static getUrl(): string {
        return this.TR_URL;
    }
}

export default Trackify;
