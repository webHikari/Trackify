import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './AreaChart.css';

// Регистрируем компоненты chart.js
Chart.register(...registerables);

interface AreaChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showValues?: boolean;
  animate?: boolean;
  title?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  color = '#4f46e5',
  height = 300,
  showGrid = false,
  showValues = true,
  animate = true,
  title,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}80`); 
    gradient.addColorStop(1, `${color}10`); 


    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
        });
      } catch (e) {
        return dateString;
      }
    };

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item.label),
        datasets: [
          {
            label: title || 'Значение',
            data: data.map(item => item.value),
            backgroundColor: gradient,
            borderColor: color,
            borderWidth: 2,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4, // Делает линию плавной
            fill: true, // Заливка области под линией
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
              title: (context) => formatDate(context[0].label),
              label: (context) => `Посещений: ${context.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: showGrid,
              color: '#333',
            },
            ticks: {
              color: '#ccc',
              font: {
                size: 12,
              },
              callback: (value, index) => {
                return formatDate(data[index].label);
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: showGrid,
              color: '#333',
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
  }, [data, color, height, showGrid, showValues, animate, title]);

  return (
    <div className="area-chart-container" style={{ height: `${height}px` }}>
      {data.length === 0 ? (
        <div className="no-data-message">Нет данных для отображения</div>
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  );
}; 