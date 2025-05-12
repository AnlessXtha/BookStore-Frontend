import React, { useEffect, useState } from "react";
import {
  Badge,
  BookOpen,
  Calendar,
  Mail,
  Search,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { createApiClient } from "../../lib/createApiClient";
import { useNavigate } from "react-router-dom";
import { StaffSidebar } from "../Staff/StaffSidebar";

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiClient = createApiClient("https://localhost:7086");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const endpoint = "api/User/all";
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
  console.log(users);

  const viewOrderDetails = (userId, userName) => {
    navigate("/staff/user-order-details", { state: { userId, userName } });
  };

  const getUserStatus = (user) => {
    if (user.lockoutEnabled && user.accessFailedCount >= 3) return "blocked";
    if (user.emailConfirmed) return "active";
    return "inactive";
  };

  const getMemberSince = (user) => {
    return new Date(user.createdAt || Date.now()).toLocaleDateString();
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar />
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              User Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage members and view their order history
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow sm:max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Badge className="h-4 w-4" />
                      Member Details
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users
                  .filter(
                    (user) =>
                      (activeTab === "all" ||
                        getUserStatus(user) === activeTab) &&
                      `${user.firstName} ${user.lastName}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.membershipId || "NA"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {getMemberSince(user)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            viewOrderDetails(user.id, user.userName)
                          }
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Orders
                        </button>
                      </td>
                    </tr>
                  ))}

                {users.length === 0 && !isLoading && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
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
