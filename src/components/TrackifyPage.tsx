import React, { useEffect, useState } from "react";
import Trackify from "../lib/Trackify";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const TrackifyPage = () => {
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const processedData = {
        weekdayActivity: statistics.weekdayActivity.map((item) => ({
            weekday: item.weekday,
            visits: parseInt(item.visits),
        })),
        hourlyActivity: statistics.hourlyActivity.map((item) => ({
            hour: item.hour,
            visits: parseInt(item.visits),
        })),
        timeline: statistics.timeline.map((item) => ({
            date: new Date(item.date).toLocaleDateString(),
            visits: parseInt(item.visits),
        })),
        topPages: statistics.topPages.map((item) => ({
            url: item.url,
            visits: parseInt(item.visits),
            avg_time: item.avg_time,
        })),
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
    };

    const weekdayChartData = {
        labels: processedData.weekdayActivity.map(
            (item) => weekDays[item.weekday]
        ),
        datasets: [
            {
                label: "Посещения по дням недели",
                data: processedData.weekdayActivity.map((item) => item.visits),
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    const hourlyChartData = {
        labels: processedData.hourlyActivity.map((item) => `${item.hour}:00`),
        datasets: [
            {
                label: "Посещения по часам",
                data: processedData.hourlyActivity.map((item) => item.visits),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
        ],
    };

    const timelineChartData = {
        labels: processedData.timeline.map((item) => item.date),
        datasets: [
            {
                label: "Посещения по дням",
                data: processedData.timeline.map((item) => item.visits),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const topPagesChartData = {
        labels: processedData.topPages.map((page) => page.url),
        datasets: [
            {
                data: processedData.topPages.map((page) => page.visits),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 0.5)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="statistics-container">
            <div className="charts-grid">
                <div className="chart-container">
                    <h2 className="chart-title">Активность по часам</h2>
                    <Bar options={chartOptions} data={hourlyChartData} />
                </div>

                <div className="chart-container">
                    <h2 className="chart-title">Активность по дням недели</h2>
                    <Bar options={chartOptions} data={weekdayChartData} />
                </div>
            </div>
            <div className="chart-container">
                <h2 className="chart-title">Временная шкала посещений</h2>
                <Bar options={chartOptions} data={timelineChartData} />
            </div>

            <div className="chart-container">
                <h2 className="chart-title">Топ просматриваемых страниц</h2>
                <Pie options={chartOptions} data={topPagesChartData} />
            </div>
        </div>
    );
};

export default TrackifyPage;
