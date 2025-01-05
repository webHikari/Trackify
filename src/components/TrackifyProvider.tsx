import React, { useEffect } from "react";
import Trackify from "../lib/Trackify";
import EventTracker from "../lib/EventTracker";

const TrackifyProvider = ({
    children,
    TR_URL,
}: {
    children: React.ReactNode;
    TR_URL: string;
}) => {
    console.log(TR_URL);

    useEffect(() => {
        Trackify.getInstance();
        Trackify.setUrl(TR_URL);

        EventTracker.trackClicks();
        EventTracker.trackMouseMovement();
        EventTracker.trackScroll();
        EventTracker.trackTimeOnPage();

        // console.log data for debugging
        const interval = setInterval(() => {
            const mousemoveEvents = Trackify.getMousemoveEvents();
            console.log("Mouse Move Events:", mousemoveEvents);

            const scrollEvents = Trackify.getScrollEvents();
            console.log("Scroll Events", scrollEvents);

            const clickEvents = Trackify.getClickEvents();
            console.log("Click Events", clickEvents);
        }, 50000);

        Trackify.startPeriodicSending();
        return () => {
            clearInterval(interval);
        };
    }, []);

    return <>{children}</>;
};

export default TrackifyProvider;
