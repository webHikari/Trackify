import React, { useState } from "react";
import { Dashboard } from "./partials/pages/Dashboard";
import "./TrackifyPage.css";
import { Sidebar } from "./partials/Sidebar";

const TrackifyPage = () => {
	const [activeTab, setActiveTab] = useState<string>("home");
	return (
		<div className="trackify__AppContainer">
			<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
			<Dashboard />
		</div>
	);
};

export default TrackifyPage;
