'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartClient({ data }) {
  const chartData = {
    labels: data.map((p) => p.name),
    datasets: [
      {
        label: 'Solved Count',
        data: data.map((p) => p.solvedCount),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
