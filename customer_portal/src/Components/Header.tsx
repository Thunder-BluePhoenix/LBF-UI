import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaBell, FaPlus, FaUser, FaSignOutAlt, FaTruck, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { useFrappeAuth } from "frappe-react-sdk"
import axios from "axios"
import logo from "../assets/Mask group (1).png"
import { MdAddShoppingCart } from "react-icons/md"
import { AiOutlineUserAdd } from "react-icons/ai"
import { CiDeliveryTruck } from "react-icons/ci"

// Define TypeScript interfaces
interface CustomerData {
  customer_name: string;
  image?: string;
  customer_group: string;
}

const Header = () => {
  const { logout } = useFrappeAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [customerName, setCustomerName] = useState("Guest")
  const [profileImg, setProfileImg] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [loginUser, setLoginUser] = useState("")
  const [partyType, setPartyType] = useState("N/A")
  const [isExpanded, setIsExpanded] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const navigate = useNavigate()

  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const profileButtonRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const notificationButtonRef = useRef<HTMLDivElement>(null)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const toggleDropdown = () => setDropdownOpen((prev) => !prev)
  const toggleProfile = () => {
    setProfileOpen((prevState) => !prevState)
  }
  const toggleNotification = () => setNotificationOpen((prev) => !prev)

  const logoutHandler = async () => {
    try {
      await logout()
      navigate("/customer_portal/login")
    } catch (error) {
      console.error("Logout failed:", loading, error)
    }
  }

  // Fixed handleRedirect function with path parameter to handle all navigation cases
  const handleRedirect = (path: string) => {
    navigate(path)
    setDropdownOpen(false)
    setProfileOpen(false)
  }

  // Separate function for Tyre Hotel Redelivery with specific query params
  const handleTyreHotelRedelivery = () => {
    const purpose = "Redelivery";
    const service = "Tyre Hotel";
    const modalMaterialListForTh = true;

    const queryParams = new URLSearchParams({
      purpose,
      service,
      "modal-material-list-for-th": modalMaterialListForTh.toString(),
    }).toString();

    navigate(`/customer_portal/material-request-form?${queryParams}`);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch logged-in user email
        const { data: userResponse } = await axios.get("/api/method/frappe.auth.get_logged_user")
        const loginUserEmail = userResponse.message
        setLoginUser(loginUserEmail)

        // Fetch customer details
        const { data: customerResponse } = await axios.get("/api/resource/Customer", {
          params: {
            fields: JSON.stringify(["*"]),
            filters: JSON.stringify([["Portal User", "user", "=", loginUserEmail]]),
          },
        })

        if (customerResponse.data.length > 0) {
          const customerData = customerResponse.data[0] as CustomerData
          setCustomerName(customerData.customer_name)
          setProfileImg(customerData.image)
          setPartyType(customerData.customer_group)
          // For demo purposes, set a random notification count
          setNotificationCount(Math.floor(Math.random() * 5))
        }
      } catch (error) {
        console.error("Error fetching customer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false)
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Extract the first letter of the customer name
  const firstLetter = customerName.charAt(0).toUpperCase()

  return (
    <header className="fixed top-0 right-0 left-20 h-16 bg-white border-b border-gray-200  z-40 flex items-center justify-between px-6">
      {/* Left side - Page title */}
      <div className="flex items-center">
        <img src={logo || "/placeholder.svg"} alt="Company Logo" className="h-8 w-10" />
      </div>

      {/* Right side - Actions and profile */}
      <div className="flex items-center gap-4">
        {/* Add button with dropdown */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="flex items-center cursor-pointer justify-center w-9 h-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
            aria-label="Add new item"
          >
            <FaPlus />
          </button>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-85 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 overflow-hidden"
            >
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-sm text-gray-700">Create New</h3>
              </div>

              <div className="py-1">
                <button
                  onClick={toggleExpand}
                  className="flex items-center w-full px-4 py-2 gap-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <MdAddShoppingCart />
                    Add Request
                  </div>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isExpanded && (
                  <div className="transition-all duration-300 ease-in-out">
                    <button
                      onClick={() =>
                        handleRedirect("/customer_portal/material-request-form?purpose=Redelivery&service=Peneus Hub")
                      }
                      className="flex items-center w-full px-8 py-2 gap-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CiDeliveryTruck />
                      Request For Redelivery - Peneus Hub
                    </button>
                    <button
                      onClick={() =>
                        handleRedirect("/customer_portal/material-request-form?purpose=Pick Up&service=Tyre Hotel")
                      }
                      className="flex items-center w-full px-8 py-2 gap-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CiDeliveryTruck />
                      Request For Pickup - Tyre Hotel
                    </button>
                    <button
                      onClick={handleTyreHotelRedelivery}
                      className="flex items-center w-full px-8 py-2 gap-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CiDeliveryTruck />
                      Request For Redelivery - Tyre Hotel
                    </button>

                  </div>
                )}

                <button
                  onClick={() => handleRedirect("/customer_portal/newcustomer")}
                  className="flex items-center w-full px-4 py-2 gap-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <AiOutlineUserAdd />
                  Add New Customer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div className="relative">
          <div
            ref={notificationButtonRef}
            onClick={toggleNotification}
            className="flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full cursor-pointer transition-colors"
          >
            <FaBell />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                {notificationCount}
              </span>
            )}
          </div>

          {notificationOpen && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
            >
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-sm text-gray-700">Notifications</h3>
                <button className="text-xs text-orange-500 hover:text-orange-600">Mark all as read</button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notificationCount > 0 ? (
                  Array(notificationCount)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="flex gap-2 items-start">
                          <div className="flex-shrink-0 bg-orange-100 rounded-full p-2 mr-3">
                            <FaTruck />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">New delivery request</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Your delivery request #{1000 + i} has been processed
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {i + 1} hour{i !== 0 ? "s" : ""} ago
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <p>No new notifications</p>
                  </div>
                )}
              </div>

              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
                <button
                  onClick={() => handleRedirect("/customer_portal/notificationpage")}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <div className="flex items-center gap-3 ">
            <div
              onClick={toggleProfile}
              ref={profileButtonRef}
              className="w-9 h-9 rounded-full bg-orange-100 cursor-pointer flex items-center justify-center text-orange-600 font-bold"
            >
              {profileImg ? (
                <img
                  src={profileImg || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                firstLetter
              )}
            </div>

            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium text-gray-800 line-clamp-1">{customerName}</span>
              <span className="text-xs text-gray-500 line-clamp-1">{partyType}</span>
            </div>
          </div>

          {profileOpen && (
            <div
              ref={profileRef}
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-800">{customerName}</p>
                <p className="text-xs text-gray-500 mt-1">{loginUser}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => handleRedirect("/customer_portal/Login-customerdetails")}
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaUser />
                  Profile
                </button>
              </div>

              <div className="py-1 border-t border-gray-200">
                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
       
      </div>
    </header>
  )
}

export default Header