import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ChartComponentProps {
  supplyLiters: number
  demandLiters: number
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  supplyLiters,
  demandLiters
}) => {
  const data = {
    labels: ['Annual Water Supply (Harvested)', 'Annual Water Demand'],
    datasets: [
      {
        label: 'Liters',
        data: [supplyLiters, demandLiters],
        backgroundColor: [
          'rgba(34, 211, 238, 0.6)', // cyan
          'rgba(245, 158, 11, 0.6)'  // orange
        ],
        borderColor: [
          '#22d3ee',
          '#f59e0b'
        ],
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.8)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.8)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Annual Water Supply vs. Demand Comparison',
        color: '#f8fafc',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      }
    }
  }

  return (
    <div className="h-80 w-full p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <Bar data={data} options={options} />
    </div>
  )
}
