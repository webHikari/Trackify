import React, { useEffect, useState } from "react";
import Trackify from "../lib/Trackify";
import { Dashboard } from "./partials/Dashboard"
import "./TrackifyPage.css";

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

const TrackifyPage = () => {
	const [statistics, setStatistics] = useState<Statistics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [counter, setCounter] = useState<number>(0)

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

	if (loading) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка: {error}</div>;
	if (!statistics) return <div>Нет данных</div>;

	return (
		<div className="statistics-container">
			<div className="charts-grid">
				<div className="chart-container">
					<h2 className="chart-title">Активность по часам</h2>
				</div>
				<button onClick={() => setCounter((prev) => prev + 1)}>{counter}</button>
				<div className="chart-container">
					<h2 className="chart-title">Активность по дням недели</h2>
				</div>
			</div>
			<div className="chart-container">
				<h2 className="chart-title">Временная шкала посещений</h2>
			</div>

			<div className="chart-container">
				<h2 className="chart-title">Топ просматриваемых страниц</h2>
			</div>
			<Dashboard />
		</div>
	);
};

export default TrackifyPage;
