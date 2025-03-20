import axios from 'axios';
import { useState, useEffect } from 'react';

interface CustomerData {
  image: string | undefined;
  tax_id: string;
  tax_category: string;
  default_currency: string;
  default_bank_account: string;
  payment_terms: string;
  default_sales_partner: string;
  default_commission_rate: number;
  language: string;
  is_frozen: number;
  disabled: number;
  so_required: number;
  dn_required: number;
  modified_by: string | number | readonly string[] | undefined;
  tax_withholding_category: string;
  customer_name?: string;
  territory?: string;
  customer_type?: 'Company' | 'Individual';
  lead_name?: string;
  customer_group?: string;
  opportunity_name?: string;
  email_id?: string;
  prospect_name?: string;
  mobile_no?: string;
  account_manager?: string;
  custom_is_parent?: number;
  parent_customer?: string | null;
  customer_primary_address?: string;
  customer_primary_contact?: string;
  custom_mail_id?: string;
  custom_contact_no?: string;
}
const CustomerDetails = () => {
  // State for customer data
  const [customerData, setCustomerData] = useState<CustomerData>({
    tax_id: '',
    tax_category: '',
    default_currency: '',
    default_bank_account: '',
    payment_terms: '',
    default_sales_partner: '',
    default_commission_rate: 0,
    language: '',
    is_frozen: 0,
    disabled: 0,
    so_required: 0,
    dn_required: 0,
    modified_by: '',
    tax_withholding_category: '',
    customer_name: '',
    territory: '',
    customer_type: 'Company',
    lead_name: '',
    customer_group: '',
    opportunity_name: '',
    email_id: '',
    prospect_name: '',
    mobile_no: '',
    account_manager: '',
    custom_is_parent: 0,
    parent_customer: null,
    customer_primary_address: '',
    customer_primary_contact: '',
    custom_mail_id: '',
    custom_contact_no: '',
    image: "",
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

        // Fetch customer details
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

  // Format date function
  // const formatDate = (dateString) => {
  //   if (!dateString) return 'N/A';
  //   const date = new Date(dateString);
  //   return date.toLocaleString();
  // };

  // Handle changes to customer data


  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* <div className="flex items-center justify-center">
                {customerData.image ? (
                  <img 
                    src={customerData.image} 
                    alt="Customer profile" 
                    className="object-cover rounded-lg shadow-md max-h-64 w-full"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div> */}
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


  // List of tabs
  const tabs = ['Details', 'Address & Contact',];

  return (
    <div className=" min-h-screen p-4">
      <div className="max-w-6xl border border-gray-300 mx-auto bg-white rounded-lg ">
        {/* Customer Header */}
       
     
        
        {/* Tabs */}
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
        
        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;