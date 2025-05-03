import React from 'react';
import { BookOpen, Users, Percent, ShoppingBag } from 'lucide-react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export function AdminDashboard () {
  const stats = [
    { title: 'Total Books', value: '1,238', icon: <BookOpen size={24} />, trend: { value: 12.5, isUpward: true } },
    { title: 'Active Members', value: '842', icon: <Users size={24} />, trend: { value: 8.2, isUpward: true } },
    { title: 'Active Discounts', value: '6', icon: <Percent size={24} />, trend: { value: 2, isUpward: false } },
    { title: 'Monthly Orders', value: '156', icon: <ShoppingBag size={24} />, trend: { value: 18.3, isUpward: true } }
  ];

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [12500, 19200, 16800, 29000, 26000, 30200],
      borderColor: 'rgb(37, 99, 235)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const genreData = {
    labels: ['Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Biography', 'Self-Help'],
    datasets: [{
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ]
    }]
  };

  const userRegistrations = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Users',
      data: [28, 48, 40, 19, 86, 27],
      backgroundColor: 'rgba(139, 92, 246, 0.8)'
    }]
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${stat.trend.isUpward ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend.isUpward ? '+' : '-'}{Math.abs(stat.trend.value)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
          <div className="h-64">
            <Line data={salesData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Popular Genres</h2>
          <div className="h-64">
            <Doughnut data={genreData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">New User Registrations</h2>
          <div className="h-64">
            <Bar data={userRegistrations} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-right py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">ORD-001</td>
                  <td className="py-3 px-4">John Doe</td>
                  <td className="py-3 px-4 text-right">$156.00</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">ORD-002</td>
                  <td className="py-3 px-4">Jane Smith</td>
                  <td className="py-3 px-4 text-right">$243.50</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">ORD-003</td>
                  <td className="py-3 px-4">Bob Johnson</td>
                  <td className="py-3 px-4 text-right">$98.75</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

