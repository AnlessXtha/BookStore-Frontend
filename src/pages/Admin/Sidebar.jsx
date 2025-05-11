import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Users,
    UserCog,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    LogOut,
    BookIcon
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const Sidebar = ({ collapsed, onCollapse }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Books', icon: <BookOpen size={20} />, path: '/admin/books' },
        { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { name: 'Staff', icon: <UserCog size={20} />, path: '/admin/staff' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`${collapsed ? 'w-20' : 'w-64'} fixed left-0 top-0 h-screen bg-blue-900 text-white transition-all duration-300 z-50`}>
            <div className="flex items-center justify-between p-4 border-b border-blue-800">
                <div className="flex items-center gap-3">
                    <BookIcon size={28} className="text-amber-400" />
                    {!collapsed && <h1 className="text-xl font-semibold">cover2cover</h1>}
                </div>
                <button
                    onClick={() => onCollapse(!collapsed)}
                    className="p-1 rounded-full hover:bg-blue-800 transition-colors"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="py-4">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                                    location.pathname === item.path
                                        ? 'bg-blue-800 text-white border-l-4 border-amber-400'
                                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="absolute bottom-0 w-full border-t border-blue-800">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-4 w-full text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Log Out</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;