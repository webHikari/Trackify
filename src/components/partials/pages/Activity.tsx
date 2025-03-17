import React from "react";
import { BarChart } from "../charts/BarChart";

interface ActivityProps {
  statistics: {
    eventsByHour: {
      clicks: Array<{ hour: string; count: number }>;
      scrolls: Array<{ hour: string; count: number }>;
      mousemoves: Array<{ hour: string; count: number }>;
    };
    hourlyActivity: Array<{
      hour: number;
      visits: string;
    }>;
    weekdayActivity: Array<{
      weekday: number;
      visits: string;
    }>;
    activityByDayOfWeek: Array<{
      day: string;
      visits: number;
    }>;
  };
}

export const Activity: React.FC<ActivityProps> = ({ statistics }) => {
  // 1. prepare data for hourly activity chart
  const hourlyData = statistics.hourlyActivity?.map(item => ({
    label: `${item.hour}:00`,
    value: parseInt(item.visits)
  })) || [];

  // 2. prepare weekday names for localization
  const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // 3. check which data array is available and use it
  const weekdayData = statistics.activityByDayOfWeek ? 
    statistics.activityByDayOfWeek.map(item => ({
      label: item.day,
      value: item.visits
    })) : 
    statistics.weekdayActivity?.map(item => ({
      label: weekdayNames[item.weekday - 1], // convert numeric index to day name
      value: parseInt(item.visits)
    })) || [];

  // 4. verify data is not empty
  console.log("hourly data:", hourlyData);
  console.log("weekday data:", weekdayData);

  // 5. Ensure all days of the week are represented
  const ensureAllDays = () => {
    // Check if we're using weekdayActivity data
    if (!statistics.activityByDayOfWeek && statistics.weekdayActivity) {
      // Create a map of existing days
      const existingDays = new Map(
        weekdayData.map(item => [item.label, item.value])
      );
      
      // Create a complete dataset with all days
      return weekdayNames.map(day => ({
        label: day,
        value: existingDays.get(day) || 0
      }));
    }
    
    return weekdayData;
  };

  // Get complete weekday data
  const completeWeekdayData = ensureAllDays();

  return (
    <div className="activity-container">
      <h1>User Activity</h1>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h2 className="chart-title">Hourly Activity</h2>
          <BarChart 
            data={hourlyData} 
            color="#4f46e5"
            height={250}
            barThickness={12}
          />
        </div>
        
        <div className="chart-container">
          <h2 className="chart-title">Weekly Activity</h2>
          <BarChart 
            data={completeWeekdayData} 
            color="#10b981"
            height={250}
            barThickness={20}
          />
        </div>
      </div>
      
      <div className="chart-container">
        <h2 className="chart-title">User Events</h2>
        <div className="events-summary">
          <div className="event-card">
            <h3>Clicks</h3>
            <p>Total: {statistics.eventsByHour?.clicks?.reduce((sum, item) => sum + item.count, 0) || 0}</p>
          </div>
          <div className="event-card">
            <h3>Scrolls</h3>
            <p>Total: {statistics.eventsByHour?.scrolls?.reduce((sum, item) => sum + item.count, 0) || 0}</p>
          </div>
          <div className="event-card">
            <h3>Mouse Movements</h3>
            <p>Total: {statistics.eventsByHour?.mousemoves?.reduce((sum, item) => sum + item.count, 0) || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 