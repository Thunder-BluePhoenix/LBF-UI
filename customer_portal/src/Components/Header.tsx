import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useFrappeAuth } from 'frappe-react-sdk';

const Header = () => {
  const { logout } = useFrappeAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [customerName, setCustomerName] = useState(''); // State for storing customer name
  const [partyType, setPartyType] = useState(''); // State for storing party type
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLImageElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Logout handler
  const logoutHandler = () => {
    logout();
    handleItemClick();
    navigate('/customer_portal/login');
  };

  // Toggle profile dropdown
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  // Handle redelivery request navigation
  const handleRedirectToRedeliveryRequest = () => {
    navigate('/customer_portal/redelivery-request');
    setDropdownOpen(false); // Close dropdown after navigation
  };

  // Handle new customer navigation
  const handleNewCustomer = () => {
    navigate('/customer_portal/new-customer');
    setDropdownOpen(false); // Close dropdown after navigation
  };

  const handleItemClick = () => {
    setDropdownOpen(false); // Close dropdown when any item is clicked
  };

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8010/api/method/lbf_logistica.api.bol.get_bill_of_landing', {
          method: 'GET',
        });
        const data = await response.json();

        // Assuming the API returns an array of objects under "message"
        if (data.message && data.message.length > 0) {
          const customerData = data.message[0];
          setCustomerName(customerData.customer); // Update customer name from the API data
          setPartyType(customerData.party_type);  // Update party type from the API data
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        profileRef.current && !profileRef.current.contains(event.target as Node) &&
        profileButtonRef.current && !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-50 border border-gray-300 ml-20 h-16 w-[95%] flex items-center justify-end p-4">
      <div className="flex items-center gap-6 pr-6">
        <div className="relative p-[5px] bg-orange-500 rounded-lg">
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="bg-orange-500 text-white rounded-full px-[7px] pb-[1px]">
            +
          </button>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute flex flex-col justify-center pl-[25px] top-12 left-0 w-64 bg-white border border-gray-300 rounded shadow-lg mt-2 z-10">
              <span className="py-3 cursor-pointer" onClick={handleRedirectToRedeliveryRequest}>
                Add Redelivery Request
              </span>
              <span className="py-3 cursor-pointer" onClick={handleItemClick}>
                Add Pickup Request
              </span>
              <span className="py-3 cursor-pointer" onClick={handleNewCustomer}>
                Add New Customer
              </span>
              <span className="py-3 cursor-pointer" onClick={handleItemClick}>
                Add New Item
              </span>
            </div>
          )}
        </div>

        <div className="p-[6px] border rounded-lg">
          <span className="w-5 h-5 text-gray-500">
            <FaBell />
          </span>
        </div>

        <div className="relative">
          <img
            ref={profileButtonRef}
            src="https://www.ucsfhealth.org/-/media/project/ucsf/ucsf-health/doctor/hero/dr-thomas-link-md-0298-1440x784-2x.jpg?h=1568&iar=0&w=2880&rev=cfaeb389e3cf43f5aba2a5b4f6ee0584&hash=2B237020774679BE2E25E849B3C725F0"
            alt="Profile"
            className="w-10 h-10 rounded-full"
            onClick={toggleProfile}
          />

          {profileOpen && (
            <div
              ref={profileRef}
              className="absolute flex flex-col justify-center pl-[25px] top-12 left-0 w-40 bg-white border rounded shadow-lg mt-2 z-10">
              <span className="py-3 cursor-pointer" onClick={logoutHandler}>
                Log Out
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col text-sm">
          <span className="font-semibold">{customerName}</span> {/* Display customer name from API */}
          <span>{partyType}</span> {/* Display based on party_type */}
        </div>
      </div>
    </div>
  );
};

export default Header;
