import Trackify from "./Trackify";
import { throttle } from "../utils/throttle";

class EventTracker {

    // throttle, RAF and RAF flag for optimizing
    static lastMouseEvent: MouseEvent | null = null;
    static isRAFRunning = false;

    static throttledMouseRAF = throttle((e: MouseEvent) => {
        this.lastMouseEvent = e;

        if (this.isRAFRunning) return;

        this.isRAFRunning = true;
        requestAnimationFrame(() => {
            if (!this.lastMouseEvent) return;

            Trackify.trackEvent("mouse-move", {
                x: this.lastMouseEvent.clientX,
                y: this.lastMouseEvent.clientY,
            });

            this.isRAFRunning = false;
        });
    }, 900);

    // only throttle for scroll
    static throttledScroll = throttle(() => {
        Trackify.trackEvent("scroll", { scrollY: window.scrollY });
    }, 900);

    // trackers
    static trackMouseMovement() {
        document.addEventListener("mousemove", this.throttledMouseRAF);
    }

    static trackScroll() {
        window.addEventListener("scroll", this.throttledScroll);
    }

    static trackClicks() {
        document.addEventListener("click", (e) => {
            Trackify.trackEvent("click", {
                x: e.clientX,
                y: e.clientY,
				// next time :)
                // element: e.target,
            });
        });
    }

	static trackTimeOnPage() {
		setInterval(() => {
			Trackify.trackEvent("timeOnPage")	
		}, 10000)
	}

    // just init
    static init() {
        this.trackMouseMovement();
        this.trackScroll();
        this.trackClicks();
    }
}

export default EventTracker;
