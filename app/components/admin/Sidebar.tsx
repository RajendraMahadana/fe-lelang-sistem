'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Package,
  ChevronDown,
  ChevronUp,
  Circle
} from 'lucide-react'
import UserInfo from '../UserInfo'
import { AnimatePresence, motion } from 'framer-motion'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users, badge: '12' },
  { name: 'Asset', href: '',icon: Package, badge: '3',
    children: [
      { name: 'Data Asset', href: '/admin/asset', icon: Circle },
      { name: 'Category', href: '/admin/asset/category', icon: Circle },
    ]
  },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
  const toggleCollapse = () => setIsCollapsed(!isCollapsed)
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

  const toggleSubmenu = (name: string) => {
  setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }))
}

  return (
  <>
    {/* Mobile menu button */}
    <button
      onClick={toggleMobile}
      className="fixed top-4 left-4 z-50 p-2 bg-white shadow-lg rounded-lg lg:hidden"
    >
      {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
    </button>

    {/* Mobile backdrop */}
    {isMobileOpen && (
      <div
        className="fixed inset-0 bg-transparent bg-opacity-50 z-40 lg:hidden"
        onClick={toggleMobile}
      />
    )}

    {/* Sidebar */}
    <div
      className={`
        fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out  
        ${isCollapsed ? 'w-20' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:translate-x-0
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 overflow-hidden h-20 flex-shrink-0">
        {!isCollapsed && (
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? '' : 'space-x-3'}`}>
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <div className="whitespace-nowrap">
                <h1 className="text-xl font-bold text-gray-900">Lelangin</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            // Reset semua dropdown ketika toggle collapse
            setOpenSubmenus({});
            toggleCollapse();
          }}
          className="hidden lg:flex text-white font-medium items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors flex-shrink-0"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-200 h-18 flex-shrink-0">
        <div className={`flex items-center transition-all duration-300 ${isCollapsed ? '' : 'space-x-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>
          <div className={`transition-all duration-300 min-w-0 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <div className="whitespace-nowrap">
              <UserInfo />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.children) {
            return (
              <div key={item.name} className="transition-all duration-300 ease-in-out group">
                <button
                  onClick={() => {
                    // Hanya toggle submenu jika sidebar tidak collapsed
                    if (!isCollapsed) {
                      toggleSubmenu(item.name);
                    }
                  }}
                  className={`flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg group overflow-hidden
                    ${isCollapsed ? '' : 'justify-between'}
                    ${openSubmenus[item.name] && !isCollapsed ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <Icon className="w-5 h-5 text-gray-500" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <span>
                      {openSubmenus[item.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  )}
                </button>

                <AnimatePresence mode="wait">
                  {openSubmenus[item.name] && !isCollapsed && (
                    <motion.div
                      key={`submenu-${item.name}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ 
                        duration: 0.2,
                        ease: "easeInOut"
                      }}
                      className="ml-6 mt-1 space-y-1 overflow-hidden"
                    >
                      {item.children.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href!}
                          className={`flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-200 overflow-hidden 
                            ${pathname === sub.href ? 'text-sky-300' : 'text-gray-700'}
                          `}
                        >
                          <sub.icon className="w-4 h-4 mr-2" />
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-150 group relative overflow-hidden
                ${isActive 
                  ? 'bg-gray-800 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
                ${isCollapsed ? '' : 'justify-between'}
              `}
            >
              <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  </>
);
}