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

export default function ChartIndexBar({ indexFrequency }) {
  const chartRef = useRef(null);

  // ✅ Dynamically import zoom plugin only in browser
  useEffect(() => {
    import('chartjs-plugin-zoom').then((zoomPlugin) => {
      ChartJS.register(zoomPlugin.default);
    });
  }, []);

  const labels = Object.keys(indexFrequency);
  const counts = Object.values(indexFrequency);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Problem Count by Index',
        data: counts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
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
      <h3>Problem Count by Index (Zoomable)</h3>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleResetZoom}
          style={{
            padding: '8px 16px',
            background: '#0070f3',
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
