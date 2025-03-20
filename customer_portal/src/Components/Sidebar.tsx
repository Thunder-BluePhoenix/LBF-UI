"use client"

import { useState, useRef, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { BsTextareaResize } from "react-icons/bs"
import { FiBell, FiHome, FiUserPlus, FiUsers } from "react-icons/fi"
import { RxDashboard } from "react-icons/rx"
import { LiaFileInvoiceSolid } from "react-icons/lia"
import logo from "../assets/Mask group (1).png"

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const collapseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation() // Get current location

  // Handle mouse enter event
  const handleMouseEnter = () => {
    setIsHovering(true)

    // Clear any pending collapse timeout
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current)
      collapseTimeoutRef.current = null
    }

    // Set a timeout to expand the sidebar to prevent accidental triggers
    if (!isExpanded) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(true)
      }, 0)
    }
  }

  // Handle mouse leave event
  const handleMouseLeave = () => {
    setIsHovering(false)

    // Clear any pending expand timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    // Set a timeout to collapse the sidebar with a delay
    collapseTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 0)
  }

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current)
      }
    }
  }, [])

  // Define navigation items with their child routes
  const navItems = [
    {
      path: "/customer_portal/home",
      icon: <RxDashboard />,
      label: "Dashboard",
      childPaths: [],
    },
    {
      path: "/customer_portal/bill-of-landing-list",
      icon: <BsTextareaResize />,
      label: "BOL",
      childPaths: ["/customer_portal/bill-of-landing-ditails","/customer_portal/quality-inspection-data","/customer_portal/serial-batch-no"],
    },
    {
      path: "/customer_portal/material-request-list",
      icon: <FiUserPlus />,
      label: "Material",
      childPaths: ["/customer_portal/material-request-form","/customer_portal/material-request-details"],
    },
    {
      path: "/customer_portal/customer-table",
      icon: <FiUsers />,
      label: "Customer",
      childPaths: ["/customer_portal/newcustomer", "/customer_portal/newcustomer/","/customer_portal/Login-customerdetails"], // Add child paths
    },
    {
      path: "/customer_portal/notificationpage",
      icon: <FiBell />,
      label: "Notification",
      childPaths: [],
    },
    {
      path: "/customer_portal/InvoiceListView",
      icon: <LiaFileInvoiceSolid />,
      label: "Invoice",
      childPaths: [],
    },
  ]

  return (
    <aside
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-500 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      } z-50`}
    >
      {/* Logo and home link */}
      <div className="flex items-center border border-gray-200 justify-between p-[15px]">
        <NavLink to="/customer_portal/home" className="flex items-center gap-3">
          <div className="px-3">
            <FiHome />
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <img src={logo || "/placeholder.svg"} alt="Company Logo" className="h-8 w-10" />
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-3 space-y-1.5">
        {navItems.map((item) => {
          // Check if current path matches this item's path or any of its child paths
          const currentPath = location.pathname
          const isExactMatch = currentPath === item.path
          const isChildMatch = item.childPaths.some((childPath) => {
            // Check for exact match or if it's a path with an ID parameter
            if (currentPath === childPath) return true

            // Check if the current path starts with the child path and has an ID parameter
            if (childPath.endsWith("/") && currentPath.startsWith(childPath)) return true

            // Check for paths with ID parameters (e.g., /customer_portal/newcustomer/123)
            const childPathBase = childPath.endsWith("/") ? childPath : childPath + "/"
            return currentPath.startsWith(childPathBase)
          })

          // Determine if this item should be shown as active
          const isActive = isExactMatch || isChildMatch

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive: linkActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative ${
                  isActive || linkActive
                    ? "bg-orange-50 text-orange-600 font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-orange-500 before:rounded-r-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                {item.label}
              </div>

              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div
                  className={`absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity duration-200 whitespace-nowrap z-50 ${
                    isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  {item.label}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className={`flex items-center gap-3 ${isExpanded ? "" : "justify-center"}`}>
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
            U
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <p className="text-sm font-medium text-gray-700 truncate">User Name</p>
            <p className="text-xs text-gray-500 truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

