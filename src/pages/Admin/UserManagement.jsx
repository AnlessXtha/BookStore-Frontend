import React, { useState } from 'react';
import { Search, Plus, UserPlus } from 'lucide-react';
import Sidebar from './Sidebar';

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      memberSince: "2024-01-15",
      orders: 12,
      status: "active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      memberSince: "2024-02-20",
      orders: 8,
      status: "inactive"
    }
  ];

  const tabs = [
    { id: 'all', name: 'All Members' },
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
    { id: 'blocked', name: 'Blocked' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full md:w-80 pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
      
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <UserPlus size={20} />
              Add Member
            </button>
          </div>
      
          <div className="border-b">
            <div className="flex gap-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab.id 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
      
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-left border-b">
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Member Since</th>
                  <th className="px-6 py-3">Orders</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(user =>
                    (activeTab === 'all' || user.status === activeTab) &&
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        <span className="font-medium">{user.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                          ${user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{new Date(user.memberSince).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">{user.orders}</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
                        <button className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50">Block</button>
                      </td>
                    </tr>
                ))}
      
                {users.filter(user =>
                  (activeTab === 'all' || user.status === activeTab) &&
                  user.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-10">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

