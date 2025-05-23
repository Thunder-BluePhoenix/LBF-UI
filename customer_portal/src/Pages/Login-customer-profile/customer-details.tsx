import axios from 'axios';
import { useState, useEffect } from 'react';

interface CustomerData {
  customer_type: string;
  lead_name: string;
  customer_group: string;
  opportunity_name: string;
  custom_mail_id: string;
  prospect_name: string;
  mobile_no: string;
  account_manager: string;
  customer_primary_address: string;
  customer_primary_contact: string;
  custom_contact_no: string;
  territory: string;
  customer_name: string;
  
}
const CustomerDetails = () => {
  // State for customer data
  const [customerData, setCustomerData] = useState<CustomerData>({
    customer_name: '',
    territory: '',
    customer_type: 'Company',
    lead_name: '',
    customer_group: '',
    opportunity_name: '',
    prospect_name: '',
    mobile_no: '',
    account_manager: '',
    customer_primary_address: '',
    customer_primary_contact: '',
    custom_mail_id: '',
    custom_contact_no: '',
  });
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('Details');
  const [loginUser, setLoginUser] = useState()
  console.log(loginUser, customerData,"customerData")
  // State for loading status
  const [loading, setLoading] = useState(true);
 


  // Fetch customer data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch logged-in user email
        const { data: userResponse } = await axios.get("/api/method/frappe.auth.get_logged_user")
        const loginUserEmail = userResponse.message
        setLoginUser(loginUserEmail)
        const { data: customerResponse } = await axios.get("/api/resource/Customer", {
          params: {
            fields: JSON.stringify(["*"]),
            filters: JSON.stringify([["Portal User", "user", "=", loginUserEmail]]),
          },
        })

        if (customerResponse.data.length > 0) {
          const customerData = customerResponse.data[0]
          
         
          
          setCustomerData(customerData)
        }
      } catch (error) {
        console.error("Error fetching customer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[14px] font-light text-gray-700">Customer Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="customer_name"
                  value={customerData.customer_name || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                />
              </div>
              <div>
                <label className="block text-[14px] font-light text-gray-700">Territory</label>
                <input 
                  type="text" 
                  name="territory"
                  value={customerData.territory || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                />
              </div>
              <div>
                <label className="block text-[14px] font-light text-gray-700">Customer Type <span className="text-red-500">*</span></label>
                <select 
                  name="customer_type"
                  value={customerData.customer_type || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                >
                  <option value="Company">Company</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
              <div>
                <label className="block text-[14px] font-light text-gray-700">From Lead</label>
                <input 
                  type="text" 
                  name="lead_name"
                  value={customerData.lead_name || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                />
              </div>
              <div>
                <label className="block text-[14px] font-light text-gray-700">Customer Group</label>
                <input 
                  type="text" 
                  name="customer_group"
                  value={customerData.customer_group || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                />
              </div>
              <div>
                <label className="block text-[14px] font-light text-gray-700">From Opportunity</label>
                <input 
                  type="text" 
                  name="opportunity_name"
                  value={customerData.opportunity_name || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                />
              </div>
              <div>
                <label className="block text-[14px] font-light text-gray-700">Mail Id <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  name="email_id"
                  value={customerData.custom_mail_id  || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                />
              </div>
              <div>
                <label className="block text-[14px] font-light text-gray-700">From Prospect</label>
                <input 
                  type="text" 
                  name="prospect_name"
                  value={customerData.prospect_name || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                />
              </div>
              <div>
                <label className="block text-[14px] font-light text-gray-700">Contact No</label>
                <input 
                  type="text" 
                  name="mobile_no"
                  value={customerData.mobile_no || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                />
              </div>
              <div>
                <label className="block text-[14px] font-light text-gray-700">Account Manager</label>
                <input 
                  type="text" 
                  name="account_manager"
                  value={customerData.account_manager || ''} 
                  className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
                />
              </div>
            </div>
          </>
        );
      case 'Address & Contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px]  font-light text-gray-700">Primary Address</label>
              <input 
                type="text" 
                name="customer_primary_address"
                value={customerData.customer_primary_address || ''} 
                
                className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
              />
            </div>
            <div>
              <label className="block text-[14px]  font-light text-gray-700">Primary Contact</label>
              <input 
                type="text" 
                name="customer_primary_contact"
                value={customerData.customer_primary_contact || ''} 
                
                className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
              />
            </div>
            <div>
              <label className="block text-[14px]  font-light text-gray-700">Custom Mail ID</label>
              <input 
                type="email" 
                name="custom_mail_id"
                value={customerData.custom_mail_id || ''} 
                
                className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
              />
            </div>
            <div>
              <label className="block text-[14px]  font-light text-gray-700">Custom Contact No</label>
              <input 
                type="text" 
                name="custom_contact_no"
                value={customerData.custom_contact_no || ''} 
                
                className="mt-1 p-1 block bg-gray-100 font-semibold text-sm w-full rounded-md"
              />
            </div>
          </div>
        );
     
      
     
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading customer data...</div>;
  }
  const tabs = ['Details', 'Address & Contact',];

  return (
    <div className=" min-h-screen p-4">
      <div className="max-w-6xl border border-gray-300 mx-auto bg-white rounded-lg ">
        <div className="border-b bg-gray-50 border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;