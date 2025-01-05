import React, { useEffect, useState } from "react";
import Trackify from "../lib/Trackify";
import EventTracker from "../lib/EventTracker";

const TrackifyProvider = ({ children, TR_URL }: { children: React.ReactNode, TR_URL: string }) => {

	console.log(TR_URL);
    const [isTrackifyModalOpen, setIsTrackifyModelOpen] =
        useState<boolean>(false);

    useEffect(() => {
        Trackify.getInstance();

        EventTracker.trackClicks();
        EventTracker.trackMouseMovement();
        EventTracker.trackScroll();

        // console.log data for debugging
        const interval = setInterval(() => {
            const mousemoveEvents = Trackify.getMousemoveEvents();
            console.log("Mouse Move Events:", mousemoveEvents);

            const scrollEvents = Trackify.getScrollEvents();
            console.log("Scroll Events", scrollEvents);

            const clickEvents = Trackify.getClickEvents();
            console.log("Click Events", clickEvents);
        }, 5000);

		Trackify.startPeriodicSending(TR_URL);

        // add hotkey to open statistics
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey && e.key === "o") {
                setIsTrackifyModelOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            {children}
            {isTrackifyModalOpen && <div>123321</div>}
        </>
    );
};

export default TrackifyProvider;
