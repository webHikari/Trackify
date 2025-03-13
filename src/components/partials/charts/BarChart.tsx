import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './BarChart.css';

// 1. register chart.js components
Chart.register(...registerables);

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  color?: string;
  height?: number;
  barThickness?: number;
  showGrid?: boolean;
  showValues?: boolean;
  animate?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  color = '#4f46e5',
  height = 300,
  barThickness = 30,
  showGrid = false,
  showValues = true,
  animate = true,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // 2. destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // 3. create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, `${color}80`); // 4. add transparency

    // 5. create chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.label),
        datasets: [
          {
            data: data.map(item => item.value),
            backgroundColor: gradient,
            borderColor: color,
            borderWidth: 1,
            borderRadius: 4,
            barThickness: barThickness,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: animate ? {
          duration: 1000,
          easing: 'easeOutQuart',
        } : false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#1e1e1e',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#333',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `Value: ${context.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: '#333',
              // drawBorder: false,
              drawOnChartArea: true,
              drawTicks: false,
            },
            ticks: {
              color: '#ccc',
              font: {
                size: 12,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: '#333',
              // drawBorder: false,
              drawOnChartArea: true,
              drawTicks: false,
            },
            ticks: {
              color: '#ccc',
              font: {
                size: 12,
              },
              callback: (value) => (showValues ? value : ''),
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, color, height, barThickness, showGrid, showValues, animate]);

  return (
    <div className="bar-chart-container" style={{ height: `${height}px` }}>
      {data.length === 0 ? (
        <div className="no-data-message">No data to display</div>
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  );
};
