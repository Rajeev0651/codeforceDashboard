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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useState, useMemo } from 'react';


ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels // ✅ Register the data label plugin
);

export default function ChartIndexTagStackedBar({ tagIndexMatrix }) {
  const chartRef = useRef(null);

  const targetIndexes = ['A', 'B', 'C', 'D', 'E', 'F'];

  const combinedTagIndexMatrix = {};
  for (const tag of Object.keys(tagIndexMatrix)) {
    const originalData = tagIndexMatrix[tag];
    combinedTagIndexMatrix[tag] = {};

    for (const index of Object.keys(originalData)) {
      const base = index.match(/^[A-F]/)?.[0]; // Extract A–F prefix
      if (targetIndexes.includes(base)) {
        combinedTagIndexMatrix[tag][base] =
          (combinedTagIndexMatrix[tag][base] || 0) + originalData[index];
      }
    }
  }

  useEffect(() => {
    import('chartjs-plugin-zoom').then((zoomPlugin) => {
      ChartJS.register(zoomPlugin.default);
    });
  }, []);

  const indexes = Array.from(
    new Set(Object.values(combinedTagIndexMatrix).flatMap((obj) => Object.keys(obj)))
  ).sort();

  const [primaryColumn, setPrimaryColumn] = useState('F');

  const priority = useMemo(() => {
    const all = ['A', 'B', 'C', 'D', 'E', 'F'];
    return [primaryColumn, ...all.filter((c) => c !== primaryColumn)];
  }, [primaryColumn]);


  const tags = useMemo(() => {
    return Object.keys(combinedTagIndexMatrix).sort((tagA, tagB) => {
      for (const col of priority) {
        const valA = combinedTagIndexMatrix[tagA][col] || 0;
        const valB = combinedTagIndexMatrix[tagB][col] || 0;
        if (valA !== valB) {
          return valB - valA; // descending
        }
      }
      return 0;
    });
  }, [combinedTagIndexMatrix, priority]);

  const datasets = tags.map((tag, i) => ({
    label: tag,
    data: indexes.map((index) => combinedTagIndexMatrix[tag][index] || 0),
    backgroundColor: `hsl(${(i * 360) / tags.length}, 70%, 60%)`,
    stack: 'tagStack',
  }));

  const chartData = {
    labels: indexes,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        color: '#000',
        font: { weight: 'bold' },
        anchor: 'center',
        align: 'center',
        formatter: (value) => (value > 0 ? value : ''),
      },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45,
        },
        barPercentage: 1.2,
        categoryPercentage: 0.9,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };
  const cellStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    textAlign: 'left',
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h4>Filtered Tag Counts (Only A to F)</h4>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ marginRight: '10px' }}>Primary Sort Column:</label>
        <select
          value={primaryColumn}
          onChange={(e) => setPrimaryColumn(e.target.value)}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            borderRadius: '4px',
          }}
        >
          {['A', 'B', 'C', 'D', 'E', 'F'].map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f1f1' }}>
            <th style={{ ...cellStyle, width: '120px' }}>Tag</th>
            {['A', 'B', 'C', 'D', 'E', 'F'].map((index) => (
              <th key={index} style={cellStyle}>{index}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => {
            const values = ['A', 'B', 'C', 'D', 'E', 'F'].map(
              (index) => combinedTagIndexMatrix[tag]?.[index] || 0
            );
            const rowMax = Math.max(...values);

            return (
              <tr key={tag}>
                <td style={cellStyle}>{tag}</td>
                {['A', 'B', 'C', 'D', 'E', 'F'].map((index, colIndex) => {
                  const value = values[colIndex];
                  const intensity = rowMax === 0 ? 0 : Math.round((value / rowMax) * 200);
                  const grey = 255 - intensity; // inverse: higher value = darker
                  const bgColor = `rgb(${grey}, ${grey}, ${grey})`;
                  const textColor = grey < 100 ? '#fff' : '#000';

                  return (
                    <td
                      key={`${tag}-${index}`}
                      style={{
                        ...cellStyle,
                        backgroundColor: bgColor,
                        color: textColor,
                      }}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
