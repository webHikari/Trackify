import React, { useEffect, useState } from "react";
import Trackify from "../../../lib/Trackify";
import { Sidebar } from "../Sidebar";
import { Home } from "./Home";
import { Activity } from "./Activity";
import { Pages } from "./Pages";
import "./Dashboard.css";

interface Statistics {
	eventsByHour: {
		clicks: Array<{ hour: string; count: number }>;
		scrolls: Array<{ hour: string; count: number }>;
		mousemoves: Array<{ hour: string; count: number }>;
	};
	pageStatistics: Array<{
		url: string;
		avg_time: number;
		visits: number;
	}>;
	activityByDayOfWeek: Array<{
		day: string;
		visits: number;
	}>;
	weekdayActivity: Array<{
		weekday: number;
		visits: string;
	}>;
	hourlyActivity: Array<{
		hour: number;
		visits: string;
	}>;
	timeline: Array<{
		date: string;
		visits: string;
	}>;
	topPages: Array<{
		url: string;
		visits: string;
		avg_time: number;
	}>;
}

export const Dashboard = () => {
	const [statistics, setStatistics] = useState<Statistics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<string>("home");

	useEffect(() => {
		fetchStatistics();
	}, []);

	const fetchStatistics = async () => {
		try {
			const URL = Trackify.getUrl();
			if (!URL) {
				setTimeout(() => {
					const newURL = Trackify.getUrl();
					if (!newURL) {
						setError("URL не найден");
					} else {
						setError(null);
						fetchStatistics();
					}
				}, 100);
				return;
			}

			const response = await fetch(`${URL}/statistics`);
			if (!response.ok) {
				throw new Error("Ошибка при получении статистики");
			}

			const data = await response.json();
			if (data.status === 200) {
				setStatistics(data.statistics);
			} else {
				throw new Error("Некорректный формат данных");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Произошла ошибка");
		} finally {
			setLoading(false);
		}
	};

	const renderContent = () => {
		if (loading) return <div className="loading-state">Загрузка...</div>;
		if (error) return <div className="error-state">Ошибка: {error}</div>;
		if (!statistics) return <div className="no-data-state">Нет данных</div>;

		switch (activeTab) {
			case "home":
				return <Home />;
			case "dashboard":
				return (
					<div className="dashboard-overview">
						<h1>Dashboard</h1>
						<div className="stats-summary">
							<div className="stat-card">
								<h3>Total visits</h3>
								<p className="stat-value">
									{statistics.timeline?.reduce(
										(sum, item) => sum + parseInt(item.visits), 
										0
									) || 0}
								</p>
							</div>
							<div className="stat-card">
								<h3>Unique pages</h3>
								<p className="stat-value">{statistics.pageStatistics?.length || 0}</p>
							</div>
							<div className="stat-card">
								<h3>Avg time</h3>
								<p className="stat-value">
									{statistics.pageStatistics?.length ? 
										Math.floor(
											statistics.pageStatistics.reduce(
												(sum, page) => sum + page.avg_time, 
												0
											) / statistics.pageStatistics.length
										) : 0} sec
								</p>
							</div>
						</div>
					</div>
				);
			case "activity":
				return <Activity statistics={statistics} />;
			case "pages":
				return <Pages statistics={statistics} />;
			default:
				return <Home />;
		}
	};

	return (
		<div className="trackify-dashboard">
			<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
			<div className="content-area">
				{renderContent()}
			</div>
		</div>
	);
}
