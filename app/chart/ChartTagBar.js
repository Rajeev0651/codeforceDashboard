'use client';

import { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

export default function ChartTagBar({ tagFrequency }) {
  const chartRef = useRef(null);

  useEffect(() => {
    import('chartjs-plugin-zoom').then((zoomPlugin) => {
      ChartJS.register(zoomPlugin.default);
    });
  }, []);

  const labels = Object.keys(tagFrequency);
  const counts = Object.values(tagFrequency);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Problem Count by Tag',
        data: counts,
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      legend: {
        position: 'top',
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45,
        },
      },
    },
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div style={{ height: '500px', marginBottom: '40px' }}>
      <h3>Problem Count by Tag (Zoomable)</h3>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleResetZoom}
          style={{
            padding: '8px 16px',
            background: '#f97316',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Reset Zoom
        </button>
      </div>
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
