import React, { useState } from "react";
import { BookOpen, Users, Percent, ShoppingBag } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import Sidebar from "./Sidebar";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats = [
    { title: "Total Books", value: "1,238", icon: <BookOpen size={24} /> },
    { title: "Total Users", value: "842", icon: <Users size={24} /> },
    { title: "Active Discounts", value: "6", icon: <Percent size={24} /> },
    { title: "Monthly Orders", value: "156", icon: <ShoppingBag size={24} /> },
  ];

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12500, 19200, 16800, 29000, 26000, 30200],
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const genreData = {
    labels: [
      "Fiction",
      "Science Fiction",
      "Mystery",
      "Romance",
      "Biography",
      "Self-Help",
    ],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
      },
    ],
  };

  const userRegistrations = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Users",
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: "rgba(139, 92, 246, 0.8)",
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="p-4 md:p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Overview */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
              <div className="h-64">
                <Line
                  data={salesData}
                  options={{ maintainAspectRatio: false, responsive: true }}
                />
              </div>
            </div>

            {/* Genre Overview */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Popular Genres</h2>
              <div className="h-64">
                <Doughnut
                  data={genreData}
                  options={{ maintainAspectRatio: false, responsive: true }}
                />
              </div>
            </div>
          </div>

          {/* Users + Orders Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New Users */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                New User Registrations
              </h2>
              <div className="h-64">
                <Bar
                  data={userRegistrations}
                  options={{ maintainAspectRatio: false, responsive: true }}
                />
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-right py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
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
      </div>
    </div>
  );
}
