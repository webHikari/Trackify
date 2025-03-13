import React from "react";
import { AreaChart } from "../charts/AreaChart";

interface PagesProps {
  statistics: {
    pageStatistics: Array<{
      url: string;
      avg_time: number;
      visits: number;
    }>;
    topPages: Array<{
      url: string;
      visits: string;
      avg_time: number;
    }>;
    timeline: Array<{
      date: string;
      visits: string;
    }>;
  };
}

export const Pages: React.FC<PagesProps> = ({ statistics }) => {
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.floor(seconds)} sec`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins} min ${secs > 0 ? `${secs} sec` : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours} h ${mins > 0 ? `${mins} min` : ''}`;
    }
  };

  const timelineData = statistics.timeline.map(item => ({
    label: item.date,
    value: parseInt(item.visits)
  }));

  return (
    <div className="pages-container">
      <h1>All pages statistics</h1>
      
      <div className="chart-container">
        <h2 className="chart-title">Visits by day</h2>
        <AreaChart 
          data={timelineData} 
          color="#10b981"
          height={300}
          showGrid={true}
          title="Visits by day"
        />
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Top pages</h2>
        <div className="top-pages-table">
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Visits</th>
                <th>Avg time</th>
              </tr>
            </thead>
            <tbody>
              {statistics.topPages.map((page, index) => (
                <tr key={index}>
                  <td>{page.url}</td>
                  <td>{page.visits}</td>
                  <td>{formatTime(page.avg_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 