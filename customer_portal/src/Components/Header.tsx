
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useFrappeAuth } from 'frappe-react-sdk';
import { useDataContext } from '../Context/DataProvider';


const Header = () => {
  const { logout } = useFrappeAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [customerName, setCustomerName] = useState(''); 
  const [partyType, setPartyType] = useState(''); 
  const navigate = useNavigate();
  const { apiData } = useDataContext();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLImageElement>(null);

  const order = {
    customer: 'Anil',
    party_type: 'Commercial',
  };

  const itemsToDisplay = apiData?.items?.length ? apiData.items[0] : order;

  // Toggle dropdown
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Logout handler
  const logoutHandler = async () => {
    await logout();
    console.log(logout,"log out")
    navigate('/customer_portal/login');
  };

  // Toggle profile dropdown
  const toggleProfile = () => setProfileOpen(!profileOpen);

  // Handle navigation actions
  const handleRedirect = (path: string) => {
    navigate(path);
    setDropdownOpen(false); // Close dropdown after navigation
  };

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/method/lbf_logistica.api.bol.get_bill_of_landing');
        const data = await response.json();

        if (data.message && data.message.length > 0) {
          setCustomerName(itemsToDisplay.customer || ''); // Safe fallback
          setPartyType(itemsToDisplay.party_type || ''); // Safe fallback
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [customerName, itemsToDisplay.customer, itemsToDisplay.party_type]);

  // Close dropdowns if clicked outside
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);





  

  return (
    <div className="bg-gray-50 border border-gray-300 ml-20 h-16 w-[95%] flex items-center justify-end p-4">
      <div className="flex items-center gap-6 pr-6">
        <div className="relative p-2 bg-orange-500 rounded-lg">
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="bg-orange-500 text-white rounded-full px-3 pb-1"
          >
            +
          </button>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute flex flex-col top-12 left-0 w-64 bg-white border border-gray-300 rounded shadow-lg mt-2 z-10"
            >
              <span
                className="py-3 px-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleRedirect('/customer_portal/material-request-form')}
              >
                Add Redelivery Request
              </span>
              <span
                className="py-3 px-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleRedirect('/customer_portal/new-customer')}
              >
                Add New Customer
              </span>
              <span
                className="py-3 px-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleRedirect('/customer_portal/new-item')}
              >
                Add New Item
              </span>
            </div>
          )}
        </div>

        <div className="p-2 border rounded-lg">
          <span className="w-5 h-5 text-gray-500">
            <FaBell />
          </span>
        </div>

        <div className="relative">
          <img
            ref={profileButtonRef}
            src="https://www.ucsfhealth.org/-/media/project/ucsf/ucsf-health/doctor/hero/dr-thomas-link-md-0298-1440x784-2x.jpg?h=1568&iar=0&w=2880&rev=cfaeb389e3cf43f5aba2a5b4f6ee0584&hash=2B237020774679BE2E25E849B3C725F0"
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={toggleProfile}
          />

          {profileOpen && (
            <div
              ref={profileRef}
              className="absolute flex flex-col top-12 left-0 w-40 bg-white border rounded shadow-lg mt-2 z-10"
            >
              <span
                className="py-3 px-4 cursor-pointer hover:bg-gray-100"
                onClick={logoutHandler}
              >
                Log Out
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col text-sm">
          <span className="font-semibold">{customerName || 'Guest'}</span>
          <span>{partyType || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
