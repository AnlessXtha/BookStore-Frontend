import React, { useEffect, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { createApiClient } from '../../lib/createApiClient';
import { useNavigate } from 'react-router-dom';

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiClient = createApiClient("https://localhost:7086");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const endpoint = 'api/User/all';
      const response = await apiClient.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  console.log(users)

  const tabs = [
    { id: 'all', name: 'All Members' },
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
  ];

  const viewOrderDetails = (userId, userName) => {
    navigate('/staff/user-order-details', { state: { userId , userName} });
  };

  const getUserStatus = (user) => {
    if (user.lockoutEnabled && user.accessFailedCount >= 3) return 'blocked';
    if (user.emailConfirmed) return 'active';
    return 'inactive';
  };

  const getMemberSince = (user) => {
    return new Date(user.createdAt || Date.now()).toLocaleDateString();
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
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
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Member Since</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(user =>
                (activeTab === 'all' || getUserStatus(user) === activeTab) &&
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(user => {
                const status = getUserStatus(user);
                return (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{getMemberSince(user)}</td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button
                        onClick={() => viewOrderDetails(user.id, user.userName)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}

            {users.length === 0 && !isLoading && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-10">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}