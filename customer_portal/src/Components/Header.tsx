import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

import { useFrappeAuth } from 'frappe-react-sdk';
import axios from 'axios';

const Header = () => {
  const { logout } = useFrappeAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Guest');
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [partyType, setPartyType] = useState('N/A');
  const navigate = useNavigate();

  console.log(loading, loginUser);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLImageElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleProfile = () => setProfileOpen((prev) => !prev);

  const logoutHandler = async () => {
    try {
      await logout();
      navigate('/customer_portal/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleRedirect = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch logged-in user email
        const { data: userResponse } = await axios.get('/api/method/frappe.auth.get_logged_user');
        const loginUserEmail = userResponse.message;
        setLoginUser(loginUserEmail);

        // Fetch customer details
        const { data: customerResponse } = await axios.get(
          '/api/resource/Customer',
          {
            params: {
              fields: JSON.stringify(['*']),
              filters: JSON.stringify([['Portal User', 'user', '=', loginUserEmail]]),
            },
          }
        );

        if (customerResponse.data.length > 0) {
          const customerData = customerResponse.data[0];
          setCustomerName(customerData.customer_name);
          setPartyType(customerData.customer_group);
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract the first letter of the customer name
  const firstLetter = customerName.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-50 fixed border z-1 border-gray-300 ml-20 h-16 w-[95%] flex items-center justify-end p-4">
      <div className="flex items-center gap-6 pr-6">
        <div className="relative p-2 bg-orange-500 rounded-lg">
          <button ref={buttonRef} onClick={toggleDropdown} className="bg-orange-500 text-white rounded-full px-3 pb-1">
            +
          </button>
          {dropdownOpen && (
            <div ref={dropdownRef} className="absolute flex flex-col top-12 left-0 w-64 bg-white border border-gray-300 rounded shadow-lg mt-2 z-10">
              <span className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleRedirect('/customer_portal/material-request-form')}>
                Add Redelivery Request
              </span>
              <span className="py-3 px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleRedirect('/customer_portal/newcustomer')}>
                Add New Customer
              </span>
              <span className="py-3 px-4 cursor-pointer hover:bg-gray-100">
                Add New Item
              </span>
            </div>
          )}
        </div>

        <div className="p-2 border border-gray-300 rounded-lg">
          <span className="w-5 h-5 text-gray-500">
            <FaBell />
          </span>
        </div>

        <div className="relative">
      
      
            <div
              ref={profileButtonRef}
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold cursor-pointer"
              onClick={toggleProfile}
            >
              {firstLetter}
            </div>
         

          {profileOpen && (
            <div ref={profileRef} className="absolute flex flex-col top-12 left-0 w-40 bg-white border border-gray-300 rounded shadow-lg mt-2 z-10">
              <div className="px-4 py-3 border-b border-gray-300">
                <p className="text-sm font-medium">My Account</p>
              </div>
              <div className="py-1">
                <button className="px-4 py-2 text-sm hover:bg-slate-700 w-full text-left">
                  Profile
                </button>
              </div>
              <div className="py-1 border-t border-gray-300">
                <button onClick={logoutHandler} className="px-4 py-2 text-sm hover:bg-slate-700 w-full text-left">
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col text-sm">
          <span className="font-semibold">{customerName}</span>
          <span>{partyType}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
