import React, { useState } from 'react';
import { Search, UserPlus, ShieldCheck } from 'lucide-react';
import Sidebar from './Sidebar';

export function StaffManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const staff = [
        {
            id: 1,
            name: "David Miller",
            email: "david@example.com",
            avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
            role: "Admin",
            department: "Management",
            joinDate: "2023-05-15",
            status: "active"
        },
        {
            id: 2,
            name: "Sarah Wilson",
            email: "sarah@example.com",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            role: "Staff",
            department: "Sales",
            joinDate: "2023-08-20",
            status: "active"
        }
    ];

    const tabs = [
        { id: 'all', name: 'All Staff' },
        { id: 'admin', name: 'Administrators' },
        { id: 'staff', name: 'Staff' }
    ];

    const departments = [
        { name: 'Management', count: 3, active: 3 },
        { name: 'Sales', count: 5, active: 4 },
        { name: 'Customer Service', count: 4, active: 4 }
    ];

    const filteredStaff = staff.filter((member) => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || member.role.toLowerCase() === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
            
            <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search staff..."
                                className="w-full md:w-80 pl-10 pr-4 py-2 border rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>

                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                <UserPlus size={20} />
                                Add Staff
                            </button>
                            <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                <ShieldCheck size={20} />
                                Manage Roles
                            </button>
                        </div>
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

                    <div className="lg:col-span-3 overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr className="text-left bg-gray-100 border-b">
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Department</th>
                                    <th className="px-6 py-3">Join Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map((member) => (
                                    <tr key={member.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                            <span className="font-medium">{member.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{member.role}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{member.department}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{new Date(member.joinDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={member.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2 justify-center">
                                            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
                                            <button className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50">Deactivate</button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredStaff.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center text-gray-500 py-10">
                                            No staff members found.
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

