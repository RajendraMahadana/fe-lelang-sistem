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
  Package
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users, badge: '12' },
  { name: 'Asset', href: '/admin/asset', icon: Package, badge: '3' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 overflow-hidden  h-20 flex-shrink-0">
          {!isCollapsed && (
            <div className={`flex items-center transition-all duration-300 ${isCollapsed ? '' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                <div className="whitespace-nowrap">
                  <h1 className="text-xl font-bold text-gray-900">AppName</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex text-white font-medium items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors flex-shrink-0"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200 h-18 flex-shrink-0">
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? '' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            <div className={`transition-all duration-300   min-w-0 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <div className="whitespace-nowrap">
                <p className="text-sm font-semibold text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john@example.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

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
                
                {/* {item.badge && (
                  <>
                    
                    <span className={`
                      transition-all duration-300 px-2 py-1 text-xs font-semibold rounded-full
                      ${isActive 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                      }
                      ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}
                    `}>
                      {item.badge}
                    </span>
                    
                   
                    <span className={`
                      absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full transition-all duration-300
                      ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                    `} />
                  </>
                )} */}
              </Link>
            )
          })}
        </nav>

      </div>

      {/* Main content spacer - only on desktop */}
      {/* <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`} /> */}

          
     
    </>
  )
}