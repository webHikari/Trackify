import Trackify from "./Trackify";
import { throttle } from "../utils/throttle";

class EventTracker {
    static trackTimeOnPage() {
        setInterval(() => {
            Trackify.trackEvent("timeOnPage");
        }, 10000);
    }
}

export default EventTracker;
