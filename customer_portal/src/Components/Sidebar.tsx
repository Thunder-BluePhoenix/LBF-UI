import { useState, useRef, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { BsTextareaResize } from "react-icons/bs"
import { FiBell, FiHome, FiUserPlus, FiUsers } from "react-icons/fi"
import { RxDashboard } from "react-icons/rx"
import logo from "../assets/Mask group (1).png"

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const sidebarRef = useRef<HTMLElement | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const collapseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()
  const handleMouseEnter = () => {
    setIsHovering(true)

    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current)
      collapseTimeoutRef.current = null
    }

    if (!isExpanded) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(true)
      }, 0)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    collapseTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 0)
  }

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
      childPaths: ["/customer_portal/bill-of-landing-ditails", "/customer_portal/quality-inspection-data", "/customer_portal/serial-batch-no"],
    },
    {
      path: "/customer_portal/material-request-list",
      icon: <FiUserPlus />,
      label: "Material",
      childPaths: ["/customer_portal/material-request-form", "/customer_portal/material-request-details"],
    },
    {
      path: "/customer_portal/customer-table",
      icon: <FiUsers />,
      label: "Customer",
      childPaths: ["/customer_portal/newcustomer", "/customer_portal/newcustomer/", "/customer_portal/Login-customerdetails"], // Add child paths
    },
    {
      path: "/customer_portal/notificationpage",
      icon: <FiBell />,
      label: "Notification",
      childPaths: [],
    },
  ]

  return (
    <aside
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-500 ease-in-out ${isExpanded ? "w-64" : "w-20"
        } z-50`}
    >
      <div className="flex items-center border border-gray-200 justify-between p-[15px]">
        <NavLink to="/customer_portal/home" className="flex items-center gap-3">
          <div className="px-3">
            <FiHome />
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
              }`}
          >
            <img src={logo || "/placeholder.svg"} alt="Company Logo" className="h-8 w-10" />
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 py-2 px-3 space-y-1.5">
        {navItems.map((item) => {
          const currentPath = location.pathname
          const isExactMatch = currentPath === item.path
          const isChildMatch = item.childPaths.some((childPath) => {
            if (currentPath === childPath) return true
            if (childPath.endsWith("/") && currentPath.startsWith(childPath)) return true
            const childPathBase = childPath.endsWith("/") ? childPath : childPath + "/"
            return currentPath.startsWith(childPathBase)
          })

          const isActive = isExactMatch || isChildMatch

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive: linkActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative ${isActive || linkActive
                  ? "bg-orange-50 text-orange-600 font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-orange-500 before:rounded-r-md"
                  : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
                  }`}
              >
                {item.label}
              </div>

              {!isExpanded && (
                <div
                  className={`absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity duration-200 whitespace-nowrap z-50 ${isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                >
                  {item.label}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar

