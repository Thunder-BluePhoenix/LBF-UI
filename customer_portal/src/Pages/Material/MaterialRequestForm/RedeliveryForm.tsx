import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';


const RedeliveryForm = () => {
    const [customers, setCustomers] = useState<{ name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [address, setAddress] = useState<{
      address_title: string;
      address_line1: string;
      city: string;
      country: string;
    } | null>(null);
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [dateOfPosting, setDateOfPosting] = useState('');
    const [DateOfDelivery, setDateOfDelivery] = useState('');
    const [purpose, setPurpose] = useState('');
    const [transportData, setTransportData] = useState({});
    const [items, setItems] = useState<{
      item_name: React.ReactNode; name: string 
    }[]>([]);
    const [loginUser, setLoginUser] = useState<string | null>(null);
    const [customerLoginUser, setCustomerLoginUser] = useState<{
      customer_name: string;
    } | null>(null);


  
    const groupBy = customerLoginUser?.customer_group ?? "Default Group";

    console.log(transportData,"rrrrrrrrrreeee")
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setPurpose(event.target.value);
    };
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateOfPosting(e.target.value);
    };
    const handleDateOfDelivery = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateOfDelivery(e.target.value);
    };
    console.log(email,contact,"asjfhskjgfak")
    console.log(customerName,"customerName")
    console.log(loginUser,"loginUser")
    // console.log(customerLoginUser,"customerLoginUser")
    // console.log(customers,"customers")
 
  
    // Consolidated useEffect for all API calls
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
  
          // 1. Fetch logged-in user email
          const userResponse = await axios.get('/api/method/frappe.auth.get_logged_user');
          const loginUserEmail = userResponse.data.message;
          setLoginUser(loginUserEmail);
  
          // 2. Fetch customer data using login email
          const customerResponse = await axios.get(`/api/resource/Customer?fields=["*"]&filters=[["Portal User","user", "=", "${encodeURIComponent(loginUserEmail)}"]]`);
          const customerData = customerResponse.data.data[0]; // Assuming we get the first customer
          setCustomerLoginUser(customerData);

          const transporterResponse = await axios.get(`/api/resource/Customer/${encodeURIComponent(customerData?.name)}`);
          const transporterData = transporterResponse?.data?.data?.custom_suppliers;
          
          // Check if transporterData exists and map the first element
         
            if (transporterData && transporterData.length > 0) {
              console.log(transporterData[0].supplier, "transporterData"); // Log the supplier of the first custom supplier
              setTransportData(transporterData[0].supplier); // Set transporter name from transporterData
            } else {
              console.log("No transporter data found.");
              setTransportData(transporterData); // Handle case when there's no transporter data
            }
          
          
  
          // 3. Fetch child customers of the logged-in customer
          const childCustomersResponse = await axios.get(`/api/resource/Customer?fields=["name"]&filters=[["custom_parent_customer", "=", "${encodeURIComponent(customerData.name)}"]]`);
          setCustomers(childCustomersResponse.data.data); // Set child customers
  
          // 4. Fetch items (optional, keeping it in the same flow)
          const itemsResponse = await axios.get('/api/resource/Item');
          setItems(itemsResponse.data.data || []);
  
          // Automatically select the first child customer and fetch its details
          if (childCustomersResponse.data.data.length > 0) {
            const firstCustomer = childCustomersResponse.data.data[0].name;
            setSelectedCustomer(firstCustomer);
            setCustomerName(firstCustomer);
            await fetchAddress(firstCustomer);
            await fetchContactEmail(firstCustomer);
          }
  
          setLoading(false);
        } catch (err: any) {
          setError(err.message || 'Error fetching data');
          setLoading(false);
        }
      };
  
      fetchData();
    }, []); // No dependencies, run once on mount
  
    // Fetch address based on selected customer
    const fetchAddress = async (customerName: string) => {
      try {
        const response = await axios.get(`/api/resource/Address?fields=["name","links.link_name","city","country","address_title","address_type","address_line1"]&filters=[["Dynamic Link", "link_name", "=", "${encodeURIComponent(customerName)}"]]`);
        setAddress(response.data.data[0] || null);
      } catch (err: any) {
        setError(err.message || 'Error fetching address');
      }
    };
  
    // Fhttp://127.0.0.1:8010/api/resource/Contact/?fields=[%22name%22,%22links.link_name%22,%20%22email_id%22,%22email_ids.email_id%22,%22phone_nos.phone%22]&filters=[[%22Dynamic%20Link%22,%20%22link_name%22,%20%22=%22,%20%22anil%22]]

   // /api/resource/Contact/?fields=["name","links.link_name", "email_id","email_ids.email_id","phone_nos.phone"]&filters=[["Dynamic Link", "link_name", "=", "Tushar"]]
   const fetchContactEmail = async (customerName: string) => {
    try {
      const response = await axios.get(`/api/method/lbf_logistica.api.bol.get_customer_contacts?customer_name=${encodeURIComponent(customerName)}`);
      console.log(response, "adddddddddddd");
      
      const contactData = response?.data.message;
      console.log(contactData, "vvvvvvvvvvvvvvvv");
  
      if (contactData && Array.isArray(contactData) && contactData.length > 0) {
        // Assuming you want to fetch the first contact from the array
        const contact = contactData[0]; 
        setContact(contact.email_id);
        setEmail(contact.phone);
      } else {
        setContact('');
        setEmail('');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching contact and email');
    }
  };
  
  
  
    // Handle customer selection
    const handleCustomerSelect = (event: ChangeEvent<HTMLSelectElement>) => {
      const selectedName = event.target.value;
      setSelectedCustomer(selectedName);
      setCustomerName(selectedName);
      if (selectedName) {
        fetchAddress(selectedName);
        fetchContactEmail(selectedName);
      }
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  

  // Render loading state
  if (loading) return <div>Loading...</div>;

  // Render error state
  if (error) return <div>Error: {error}</div>;

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
  
      const csrfToken = 'your-csrf-token'; 
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-Frappe-CSRF-Token': csrfToken } : {})
      }; 
  
      const myData = {
        service: "Peneus Hub",
        schedule_date: dateOfPosting,
        material_request_type: purpose ,
        party_type: groupBy,
        customer: customerLoginUser?.customer_name,
        address_of_customer: address 
        ? `${address.address_title}, ${address.address_line1}, ${address.city}, ${address.country}` : 'Address not available',
        shipping_to: "anil",
        shipping_address_name: "",
        address: "",
        // customer_contact: contact,
        contact_person: "112221212",
        contact: contact,
        transporter_name: transportData,
        transporter_address: "  ",
        items: items.map((item) => ({
          item_code: item.name,
          schedule_date: DateOfDelivery,
          qty: 1.0,  
          warehouse:"",
          stock_uom: "",
          uom: "Box",
          conversion_factor: 1.0,
          description: ""
        })),
      };
  
      try {
        const result = await fetch('/api/method/lbf_logistica.api.bol.save_material_request_instruction_log', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(myData),
        });
        const resultJson = await result.json();
        console.log('Data posted successfully:', resultJson);
      
        // Show success message to the user
        alert('Data posted successfully!');
        console.log(resultJson);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };


    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get('http://127.0.0.1:8010/api/resource/Contact', {
    //       params: {
    //         fields: JSON.stringify(["name", "links.link_name", "email_id", "email_ids.email_id", "phone_nos.phone"]),
    //         filters: JSON.stringify([["Dynamic Link", "link_name", "=", "anil"]])
    //       }
    //       // Add headers if needed, like:
    //       // headers: { Authorization: `Bearer your_token` }
    //     });
    
    //     console.log(response.data,"aaaaaaaaaaaaaaaaaaaaaaaaa");
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };
    
    // fetchData();


  return (
    <div className="max-w-4xl border border-gray-300 my-8 mx-auto bg-white p-6 shadow-md rounded-xl">
      <div className="flex items-center space-x-2 mb-6">
        <span><FaArrowLeft /></span>
        <h2 className="text-2xl font-semibold">Material Request </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <select
              value={selectedCustomer}
              onChange={handleCustomerSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option value="">Select a customer</option>
              {customers.map((customer:any) => (
                <option key={customer.name} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Contact</label>
            <input
              type="text"
              name="contact"
              value={contact}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email ID</label>
            <input
              type="email"
              name="email"
              value={email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Purpose</label>
            <select
            name="purpose"
            value={purpose}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option>Redelivery</option>
              <option>Pick Up</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={
                address
                  ? `${address.address_title}, ${address.address_line1}, ${address.city}, ${address.country}`
                  : ''
              }
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Request By</label>
            <input
              type="text"
              name="request-by"
              value={customerLoginUser?.customer_name || 'Guest'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date of Posting</label>
            <input
          type="date"
          name="dateOfPosting"
          value={dateOfPosting}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
        />
          </div>

          <div>
            <label className="block text-sm font-medium">Date of Delivery</label>
            <input
              type="date"
              name="dateOfDelivery"
              value={DateOfDelivery}
              onChange={handleDateOfDelivery}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full mt-8 mb-6 border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="bg-gray-100 font-bold">
                <td className="flex items-center gap-3 px-2 py-2">
                  <input type="checkbox" className="form-checkbox h-3 w-3" />Item Name
                </td>
                <td className="px-4 py-2">Item Code</td>
                <td className="px-4 py-2">Required Qty</td>
                <td className="px-4 py-2">Picked Qty</td>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="flex items-center gap-3 px-2 py-2">
                    <input type="checkbox" className="form-checkbox h-3 w-3"/>
                    {item.name}
                  </td>
                  <td className="px-4 py-2">{item.item_name || "N/A"}</td>
                  <td className="px-4 py-2">---</td>
                  <td className="px-4 py-2">---</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       <div className='flex flex-row justify-between'>
       <div className='flex flex-row gap-3'>
        <button
        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >Add Row</button>
       <button
          className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          Add Item
        </button>

       </div>

       <div className='flex flex-row gap-3'>
        <button
        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >Cancel</button>
       <button
          type="submit"
          className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-800 transition-colors"
        >
          Submit
        </button>

       </div>
       </div>
      </form>
    </div>
  );
};

export default RedeliveryForm;






