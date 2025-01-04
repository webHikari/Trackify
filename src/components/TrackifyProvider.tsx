import React, { useEffect } from "react";
import Trackify from "../lib/Trackify";
import EventTracker from "../lib/EventTracker";

const TrackifyProvider = ({ children }: { children: React.ReactNode }) => {
	useEffect(() => {
		Trackify.getInstance();

		EventTracker.trackClicks();
		EventTracker.trackMouseMovement();
		EventTracker.trackScroll();

		const interval = setInterval(() => {
			const mousemoveEvents = Trackify.getMousemoveEvents();
			console.log("Mouse Move Events:", mousemoveEvents);

			const scrollEvents = Trackify.getScrollEvents();
			console.log("Scroll Events", scrollEvents);

			const clickEvents = Trackify.getClickEvents();
			console.log("Click Events", clickEvents);
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return <>{children}</>;
};

export default TrackifyProvider;
