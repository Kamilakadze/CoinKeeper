import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Массив цветов для категорий
const categoryColors = [
  '#FF6384', // Розовый
  '#36A2EB', // Синий
  '#FFCE56', // Желтый
  '#4BC0C0', // Бирюзовый
  '#9966FF', // Фиолетовый
  '#FF9F40', // Оранжевый
  '#2ECC71', // Зеленый
  '#E74C3C', // Красный
  '#3498DB', // Голубой
  '#F1C40F', // Золотой
  '#9B59B6', // Пурпурный
  '#1ABC9C', // Изумрудный
  '#E67E22', // Морковный
  '#34495E', // Темно-синий
  '#7F8C8D', // Серый
];

const Statistics = () => {
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { transactions } = useSelector((state) => state.transactions);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    const now = new Date();
    let start = new Date();
    
    switch (dateRange) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  }, [dateRange]);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
  });

  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const categoryName = transaction.category_name || 
        categories.find(c => c.id === transaction.category_id)?.name || 
        'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
      return acc;
    }, {});

  const incomeByCategory = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, transaction) => {
      acc['Income'] = (acc['Income'] || 0) + transaction.amount;
      return acc;
    }, {});

  const pieChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: categoryColors.slice(0, Object.keys(expensesByCategory).length),
        borderColor: Array(Object.keys(expensesByCategory).length).fill('#FFFFFF'),
        borderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(incomeByCategory),
    datasets: [
      {
        label: 'Income',
        data: Object.values(incomeByCategory),
        backgroundColor: '#4CAF50',
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label} - $${data.datasets[0].data[i].toFixed(2)}`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              }));
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: 'Expenses by Category',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value * 100) / total).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income by Category',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`
        }
      }
    },
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Statistics</h2>
            <div className="w-full sm:w-auto space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full sm:w-auto input"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>

              {dateRange === 'custom' && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-4">
              <div className="aspect-w-1 aspect-h-1">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>
            <div className="card p-4">
              <div className="aspect-w-1 aspect-h-1">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700">
                  ${Object.values(expensesByCategory).reduce((a, b) => a + b, 0).toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total Income</p>
                <p className="text-2xl font-bold text-green-700">
                  ${Object.values(incomeByCategory).reduce((a, b) => a + b, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Statistics; 