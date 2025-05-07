import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import {
  FiHome,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

const Layout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Statistics', href: '/stats', icon: FiPieChart },
    { name: 'Settings', href: '/settings', icon: FiSettings }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
          <button
              onClick={toggleSidebar}
              className="text-white hover:text-purple-300 focus:outline-none"
          >
            {isSidebarOpen ? (
                <FiX className="h-6 w-6" />
            ) : (
                <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div
              className={`${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-[#1f1b2e] shadow-2xl transition-transform duration-300 ease-in-out`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center h-16 border-b border-[#29243d]">
                <h1 className="text-2xl font-bold text-indigo-400">CoinKeeper</h1>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                      <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
                              isActive
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                                  : 'text-purple-300 hover:bg-[#29243d]'
                          }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-[#29243d]">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-[#29243d] transition-all"
                >
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Overlay */}
          {isSidebarOpen && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
              />
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
  );
};

export default Layout;
