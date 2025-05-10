import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, Percent, ShoppingBag, Users } from 'lucide-react';
import { StaffSidebar } from './StaffSidebar';

function StaffDashboard() {
  const { currentUser } = useContext(AuthContext);
  const stats = [
    { title: 'Total Users', value: '1,238', icon: <BookOpen size={24} />, trend: { value: 12.5, isUpward: true } },
    { title: 'Active Members', value: '842', icon: <Users size={24} />, trend: { value: 8.2, isUpward: true } },
    { title: 'Active Discounts', value: '6', icon: <Percent size={24} />, trend: { value: 2, isUpward: false } },
    { title: 'Monthly Orders', value: '156', icon: <ShoppingBag size={24} />, trend: { value: 18.3, isUpward: true } }
  ];
  return (
    <>
      <div>StaffDashboard</div>
      {/* Stats Grid */}
      < StaffSidebar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
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
              <div className="p-2 bg-blue-50 rounded-lg">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default StaffDashboard