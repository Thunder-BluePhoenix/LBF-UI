import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BsTextareaResize } from "react-icons/bs";
import { FiBell, FiUserPlus, FiUsers } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import logo from "../assets/Mask group (1).png";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`fixed h-screen flex flex-col items-center bg-gray-50 border-r border-gray-300 ${
        isHovered ? "w-64" : "w-20"
      } transition-all duration-300 z-50`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-start w-full py-4 ml-4">
        <NavLink to="/customer_portal/home" end>
          <img
            src={logo}
            alt="Company Logo"
            className="h-12 w-12"
          />
        </NavLink>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex flex-col gap-4 justify-center w-[90%] text-gray-400">
        {/* Dashboard Link */}
        <NavLink
          to="/customer_portal/home"
          end
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center justify-start gap-4 px-2 py-2 rounded-md ${
              isActive
                ? "text-white bg-orange-500"
                : "hover:text-white hover:bg-orange-500"
            }`
          }
        >
          <RxDashboard size={24} />
          {isHovered && <span>Dashboard</span>}
        </NavLink>

        {/* BOL-Lists Link */}
        <NavLink
          to="/customer_portal/bill-of-landing-list"
          end
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center justify-start gap-4 px-2 py-2 rounded-md ${
              isActive
                ? "text-white bg-orange-500"
                : "hover:text-white hover:bg-orange-500"
            }`
          }
        >
          <BsTextareaResize size={24} />
          {isHovered && <span>BOL-Lists</span>}
        </NavLink>

        {/* Material Link */}
        <NavLink
          to="/customer_portal/material-request-list"
          end
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center justify-start gap-4 px-2 py-2 rounded-md ${
              isActive
                ? "text-white bg-orange-500"
                : "hover:text-white hover:bg-orange-500"
            }`
          }
        >
          <FiUserPlus size={24} />
          {isHovered && <span>Material-Requested</span>}
        </NavLink>

        {/* Customer Link */}
        <NavLink
          to="/customer_portal/customer-table"
          end
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center justify-start gap-4 px-2 py-2 rounded-md ${
              isActive
                ? "text-white bg-orange-500"
                : "hover:text-white hover:bg-orange-500"
            }`
          }
        >
          <FiUsers size={24} />
          {isHovered && <span>Customer</span>}
        </NavLink>

        {/* Notification Link */}
        <NavLink
          to="/customer_portal/notificationpage"
          end
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center justify-start gap-4 px-2 py-2 rounded-md ${
              isActive
                ? "text-white bg-orange-500"
                : "hover:text-white hover:bg-orange-500"
            }`
          }
        >
          <FiBell size={24} />
          {isHovered && <span>Notification</span>}
        </NavLink>
        <NavLink
          to="/customer_portal/InvoiceListView"
          end
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center justify-start gap-4 px-2 py-2 rounded-md ${
              isActive
                ? "text-white bg-orange-500"
                : "hover:text-white hover:bg-orange-500"
            }`
          }
        >
          <LiaFileInvoiceSolid size={24} />
          {isHovered && <span>Invoice</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
