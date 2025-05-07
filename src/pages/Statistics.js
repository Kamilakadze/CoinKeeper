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

const categoryColors = [
  '#f87171', '#60a5fa', '#fbbf24', '#34d399',
  '#a78bfa', '#f472b6', '#fb923c', '#4ade80',
  '#38bdf8', '#c084fc'
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
        start.setDate(now.getDate() - 7); break;
      case 'month':
        start.setMonth(now.getMonth() - 1); break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1); break;
    }
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  }, [dateRange]);

  const filtered = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= new Date(startDate) && d <= new Date(endDate);
  });

  const expenses = filtered.filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const name = t.category_name || categories.find(c => c.id === t.category_id)?.name || 'Other';
        acc[name] = (acc[name] || 0) + t.amount;
        return acc;
      }, {});

  const incomes = filtered.filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc['Income'] = (acc['Income'] || 0) + t.amount;
        return acc;
      }, {});

  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0);
  const totalIncome = Object.values(incomes).reduce((a, b) => a + b, 0);

  return (
      <Layout>
        <div className="space-y-8 max-w-7xl mx-auto">
          {/* Filter */}
          <div className="flex justify-end">
            <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 rounded-lg bg-[#1f1d2b] text-white border border-pink-500"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last year</option>
            </select>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie */}
            <div className="bg-[#1f1b2e] p-6 rounded-2xl shadow-xl text-white">
              <h2 className="text-lg font-semibold text-purple-300 mb-4">Expenses by Category</h2>
              <Pie
                  data={{
                    labels: Object.keys(expenses),
                    datasets: [{
                      data: Object.values(expenses),
                      backgroundColor: categoryColors,
                      borderColor: '#111827',
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    plugins: {
                      legend: {
                        labels: {
                          color: '#ddd',
                          padding: 20
                        }
                      }
                    }
                  }}
              />
            </div>

            {/* Bar */}
            <div className="bg-[#1f1b2e] p-6 rounded-2xl shadow-xl text-white">
              <h2 className="text-lg font-semibold text-purple-300 mb-4">Income by Category</h2>
              <Bar
                  data={{
                    labels: Object.keys(incomes),
                    datasets: [{
                      label: 'Income',
                      data: Object.values(incomes),
                      backgroundColor: '#4ade80',
                    }]
                  }}
                  options={{
                    scales: {
                      y: {
                        ticks: { color: '#ccc' },
                        grid: { color: '#333' }
                      },
                      x: {
                        ticks: { color: '#ccc' },
                        grid: { color: '#333' }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: { color: '#ccc' }
                      }
                    }
                  }}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 bg-[#2a1d2e]/80 text-red-400 text-lg font-semibold shadow-xl">
              <div>Total Expenses</div>
              <div className="text-3xl font-bold">${totalExpense.toFixed(2)}</div>
            </div>
            <div className="rounded-2xl p-6 bg-[#1e2e2a]/80 text-green-400 text-lg font-semibold shadow-xl">
              <div>Total Income</div>
              <div className="text-3xl font-bold">${totalIncome.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </Layout>
  );
};

export default Statistics;
