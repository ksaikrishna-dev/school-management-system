import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUsers, FaUserGraduate, FaExclamationCircle, 
  FaClipboardList, FaFileSignature, FaImage, FaUserShield, FaSignOutAlt, FaBars, FaTimes, FaGraduationCap
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt, roles: ['Admin', 'Staff', 'Student'] },
  { path: '/staff', label: 'Staff', icon: FaUsers, roles: ['Admin', 'Staff', 'Student'] },
  { path: '/students', label: 'Students', icon: FaUserGraduate, roles: ['Admin', 'Staff', 'Student'] },
  { path: '/attendance', label: 'Attendance', icon: FaClipboardList, roles: ['Admin', 'Staff'] },
  { path: '/complaints', label: 'Complaints', icon: FaExclamationCircle, roles: ['Admin', 'Staff', 'Student'] },
  { path: '/registration', label: 'Registration', icon: FaFileSignature, roles: ['Admin', 'Staff', 'Student'] },
  { path: '/reports', label: 'Reports', icon: FaClipboardList, roles: ['Admin', 'Staff'] },
  { path: '/gallery', label: 'Gallery', icon: FaImage, roles: ['Admin', 'Staff', 'Student'] },
  { path: '/admin', label: 'Admin', icon: FaUserShield, roles: ['Admin'] },
];

export const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                <FaGraduationCap size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">EduManage</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1 flex-1 justify-center px-4 overflow-x-auto custom-scrollbar">
              {filteredNavItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative whitespace-nowrap",
                    isActive 
                      ? "text-white bg-white/10" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={clsx("text-base transition-colors", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                      <span>{label}</span>
                      {isActive && (
                        <motion.div 
                          layoutId="topbar-active-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Profile & Actions */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden md:flex items-center gap-3 border-r border-slate-700 pr-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 shadow-sm">
                  {user.name.charAt(0)}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-slate-900 border-b border-slate-800 sticky top-16 z-40 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-4 space-y-1 sm:px-6">
              {filteredNavItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => clsx(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors",
                    isActive 
                      ? "bg-indigo-500/20 text-indigo-300" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="text-lg" />
                  {label}
                </NavLink>
              ))}
              <div className="pt-4 mt-2 border-t border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2 mb-2 md:hidden">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors md:hidden text-left"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="text-base font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
