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
	useEffect(() => {
		Trackify.setUrl(TR_URL);

		EventTracker.trackTimeOnPage();

		const origAddEventListener = EventTarget.prototype.addEventListener;
		EventTarget.prototype.addEventListener = function(
			type,
			listener,
			options,
		) {
			if (type === "message") {
				console.trace("message listener added");
			}
			return origAddEventListener.call(this, type, listener, options);
		};

		console.log("TrackifyProvider mounted");

		return () => { };
	}, [TR_URL]); // Добавляем зависимость TR_URL

	return <>{children}</>;
};

export default TrackifyProvider;
