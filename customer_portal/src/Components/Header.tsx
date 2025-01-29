import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useFrappeAuth } from 'frappe-react-sdk';

const Header = () => {
  const { logout} = useFrappeAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // Renamed Profile to profileOpen for clarity
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null); // Reference to the dropdown
  const buttonRef = useRef<HTMLButtonElement>(null); // Reference to the dropdown button
  const profileRef = useRef<HTMLDivElement>(null); // Reference to the profile dropdown
  const profileButtonRef = useRef<HTMLImageElement>(null); // Reference to the profile button

 const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const logoutHandler = () => {
    logout();
    handleItemClick();
    navigate('/customer_portal/login')
  }
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const handleRedirectToRedeliveryRequest = () => {
    navigate('/redelivery-request');
    setDropdownOpen(false); // Close dropdown after navigation
  };

  const handleNewCustomer = () => {
    navigate('/new-customer');
    setDropdownOpen(false); // Close dropdown after navigation
  };

  const handleItemClick = () => {
    setDropdownOpen(false); // Close dropdown when any item is clicked
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }

      if (
        profileRef.current && !profileRef.current.contains(event.target as Node) &&
        profileButtonRef.current && !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false); // Close profile dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup on unmount
    };
  }, []);

  return (
    <div className=" bg-gray-50  border border-gray-300   ml-20  h-16  w-[95%]  flex  items-center  justify-end  p-4">
      <div className=" flex  items-center  gap-6">
        <div className=" relative  p-[5px]  bg-orange-500  rounded-lg">
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className=" bg-orange-500  text-white  rounded-full  px-[7px]  pb-[1px]">
            +
          </button>
          {dropdownOpen && (
            <div ref={dropdownRef} className=" absolute  flex  flex-col  justify-center  pl-[25px]  top-12  left-0  w-64  bg-white  border border-gray-300 rounded  shadow-lg mt-2 z-10">
              <span className=" py-3  cursor-pointer" onClick={() => { handleRedirectToRedeliveryRequest(); handleItemClick(); }}>Add Redelivery Request</span>
              <span className=" py-3  cursor-pointer" onClick={handleItemClick}>Add Pickup Request</span>
              <span className=" py-3  cursor-pointer" onClick={() => { handleNewCustomer(); handleItemClick(); }}>Add New Customer</span>
              <span className=" py-3  cursor-pointer" onClick={handleItemClick}>Add New Item</span>
            </div>
          )}
        </div>

        <div className=" p-[6px]  border  rounded-lg">
          <span className=" w-5  h-5  text-gray-500"><FaBell /></span>
        </div>

        <div className=" relative">
          <img
            ref={profileButtonRef}
            src="https://www.ucsfhealth.org/-/media/project/ucsf/ucsf-health/doctor/hero/dr-thomas-link-md-0298-1440x784-2x.jpg?h=1568&iar=0&w=2880&rev=cfaeb389e3cf43f5aba2a5b4f6ee0584&hash=2B237020774679BE2E25E849B3C725F0"
            alt="Profile"
            className=" w-10  h-10  rounded-full"
            onClick={toggleProfile}
          />

          {profileOpen && (
            <div ref={profileRef} className=" absolute  flex  flex-col  justify-center  pl-[25px]  top-12  left-0  w-40  bg-white  border  rounded  shadow-lg mt-2 z-10">
              <span className=" py-3  cursor-pointer" onClick={logoutHandler}>Log Out</span>
            </div>
          )}
        </div>

        <div className=" flex  flex-col  text-sm">
          <span className=" font-semibold">Luca Brasi</span>
          <span>Business Owner</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
