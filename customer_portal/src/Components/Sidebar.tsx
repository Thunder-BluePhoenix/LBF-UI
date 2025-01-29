import { NavLink } from 'react-router-dom';
import { BsBookmarkPlus, BsTextarea, BsToggleOff } from 'react-icons/bs';
import { FiBell, FiUserPlus, FiUsers } from 'react-icons/fi';
import { RxDashboard } from 'react-icons/rx';

const Sidebar = () => {
  return (
    <div className="bg-gray-50 border border-gray-300  fixed h-screen w-20 flex flex-col items-center py-4">
      <div className='mb-6'>
        <NavLink to="/customer_portal/dashboard">
          <img src="https://cdn.dribbble.com/userupload/10556461/file/original-58141f3190ba71cd1ee27e322a7df6ab.png?format=webp&resize=400x300&vertical=center" alt="Logo" width={50} height={50} />
        </NavLink>
      </div>
      <div className="flex flex-col gap-4 items-center space-y-6 text-gray-400">
        <NavLink 
          to="/customer_portal/dashboard" 
          className={({ isActive }: { isActive: boolean }) => 
            `w-7 h-7 ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
          }>
          <RxDashboard />
        </NavLink>
        <NavLink 
          to="/customer_portal/blo-list" 
          className={({ isActive }: { isActive: boolean }) => 
            `w-7 h-7 ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
          }>
          <BsTextarea />
        </NavLink>
        <NavLink 
          to="/customer_portal/request-list" 
          className={({ isActive }: { isActive: boolean }) => 
            `w-7 h-7 ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
          }>
          <FiUserPlus />
        </NavLink>
        <NavLink 
          to="/customer_portal/user" 
          className={({ isActive }: { isActive: boolean }) => 
            `w-7 h-7 ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
          }>
          <FiUsers />
        </NavLink>
        <NavLink 
          to="/customer_portal/notifications" 
          className={({ isActive }: { isActive: boolean }) => 
            `w-7 h-7 ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
          }>
          <FiBell />
        </NavLink>
        <NavLink 
          to="/customer_portal/bookmarks" 
          className={({ isActive }: { isActive: boolean }) => 
            `w-7 h-7 ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
          }>
          <BsBookmarkPlus />
        </NavLink>
        <NavLink 
          to="/customer_portal/settings" 
          className={({ isActive }: { isActive: boolean }) => 
            `w-7 h-7 ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`
          }>
          <BsToggleOff />
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
