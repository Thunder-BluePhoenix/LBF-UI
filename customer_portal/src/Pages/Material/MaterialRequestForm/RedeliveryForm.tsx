/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

interface ItemList {
  id: number
  requiredBy: string
  quantity: number
  targetWarehouse: string
  uom: string
  name: string
  item_name: string
  item_code: string
}

interface FetchedItem {
  item_code: string
  item_name: string
  items_quantity: number
  label: string
  value: string
}
const RedeliveryForm = () => {
  const [customers, setCustomers] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set<number>());
  const [selectAll, setSelectAll] = useState(false);
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
  const [DateOfRequredBy, setDateOfRequredBy] = useState('');
  const [itemQuantity, setItemQuantity] = useState<number>(0); 
  const [purpose, setPurpose] = useState('');
  const [transportData, setTransportData] = useState({});
  const [itemList, setItemList] = useState<FetchedItem[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const navigator = useNavigate();
  const [items, setItems] = useState<ItemList[]>([])
  const [loginUser, setLoginUser] = useState<string | null>(null);
  const [customerLoginUser, setCustomerLoginUser] = useState<{
    customer_name: string;
    customer_group: string;
  } | null>(null);

  const groupBy = customerLoginUser?.customer_group ?? "Default Group";

  // console.log(transportData,"rrrrrrrrrreeee")
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPurpose(event.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfPosting(e.target.value);
  };
  const handleDateOfDelivery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfDelivery(e.target.value);
  };

  const handleDateOfRequredBy = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfRequredBy(e.target.value);
  };
  const handleDateOfRequiredBy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const requiredByDate = Number(e.target.value); // Convert to a number
    setItemQuantity(requiredByDate); // Set the state with a number
  };
  console.log(itemQuantity,'uuuuuuuuuu')

  const handleItemSelected = (index: number) => {
    const updatedSelectedItems = new Set(selectedItems);
    if (updatedSelectedItems.has(index)) {
      updatedSelectedItems.delete(index);
    } else {
      updatedSelectedItems.add(index);
    }
    setSelectedItems(updatedSelectedItems);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set()); // Clear all selections
    } else {
      const allItemIds = new Set(items.map((_, index) => index)); // Select all
      setSelectedItems(allItemIds);
    }
    setSelectAll(!selectAll); // Toggle state
  };

  console.log(email, contact, "")
  console.log(customerName, "")
  console.log(loginUser, "")



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
        const childCustomersResponse = await axios.get(`/api/method/lbf_logistica.api.bol.get_customers_with_parent?customer_name=${encodeURIComponent(customerData.name)}`);
        setCustomers(childCustomersResponse.data.data); // Set child customers

        // 4. Fetch items (optional, keeping it in the same flow)
        const itemsResponse = await axios.get(`/api/method/lbf_logistica.api.bol.get_unique_items?customer=${encodeURIComponent(customerData.name)}&fields=["item_code","item_name","items_quantity"]`);
        console.log(itemsResponse, "itemresponse ")
        setItemList(itemsResponse.data.message || "none");

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

const fetchContactEmail = async (customerName: string) => {
    try {
      const response = await axios.get(`/api/method/lbf_logistica.api.bol.get_customer_contacts?customer_name=${encodeURIComponent(customerName)}`);


      const contactData = response?.data.message;


      if (contactData && Array.isArray(contactData) && contactData.length > 0) {
        // Assuming you want to fetch the first contact from the array
        const contact = contactData[0];
        setContact(contact.phone);
        setEmail(contact.email_id);
      } else {
        setContact('');
        setEmail('');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching contact and email');
    }
  };

//item table code 
const addRow = () => {
  const newItem: ItemList = {
    id: items.length + 1,
    requiredBy: "",
    quantity: 0,
    targetWarehouse: "",
    uom: "",
    name: "",
    item_name: "",
    item_code: "",
  }
  setItems([...items, newItem])
}

const removeRow = (index: number) => {
  const updatedItems = items.filter((_, i) => i !== index)
  setItems(updatedItems)
}


const handleItemSelect = (itemId: number, selectedItem: FetchedItem) => {
  setItems(
    items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            item_code: selectedItem.item_code,
            item_name: selectedItem.item_name,
            quantity: selectedItem.items_quantity,
            // You can add more fields here if they are available in the FetchedItem
          }
        : item,
    ),
  )
  setOpen(null)
}

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

    const selectedItemsData = items.filter((_, index) => selectedItems.has(index));

    const csrfToken = 'your-csrf-token';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-Frappe-CSRF-Token': csrfToken } : {})
    };

    const myData = {
      service: "Peneus Hub",
      schedule_date: dateOfPosting,
      material_request_type: purpose,
      party_type: groupBy,
      customer: customerLoginUser?.customer_name,
      address_of_customer: address
        ? `${address.address_title}, ${address.address_line1}, ${address.city}, ${address.country}` : 'Address not available',
      shipping_to: customerLoginUser?.customer_name,
      shipping_address_name: "",
      address: "",
      // customer_contact: contact,
      contact_person: "",
      contact: contact,
      transporter_name: transportData,
      transporter_address: "  ",
      items: selectedItemsData.map((item) => ({
        item_code: item.item_code,
        schedule_date: DateOfRequredBy,
        qty: itemQuantity,
        warehouse: "",
        stock_uom: "",
        uom: "Box",
        conversion_factor: 3.0,
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

  const handleRedirectToRedeliveryRequest = () => {
    navigator('/customer_portal/material-request-list');
  };


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
              @typescript-eslint/no-explicit-any
              {customers.map((customer: any) => (
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
              <option></option>
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
            <label className="block text-sm font-medium">Party Type</label>
            <input
              type="text"
              name="request-by"
              value={groupBy || 'Guest'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Transporter Name</label>
            <input
              type="text"
              name="request-by"
              value={ typeof transportData === 'string' || typeof transportData === 'number' ? transportData : ''}
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

        <div className=" mb-6">
        <table className="w-full text-sm border rounded-md border-gray-300">
              <thead>
                <tr className="border-b  border-gray-300">
                  <th className="p-2 text-left">
                    <input 
                    onClick={handleSelectAll}
                     type="checkbox"
                     className="h-4 w-4" />
                  </th>
                  <th className="p-2 text-left">No.</th>
                  <th className="p-2 text-left">Item Code *</th>
                  <th className="p-2 text-left">Item Name</th>
                  <th className="p-2 text-left">Required By *</th>
                  <th className="p-2 text-left">Available Qty</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b rounded-md border-gray-300">
                    <td className=" pl-2">
                      <input
                       checked={selectedItems.has(index)}
                       onChange={() => handleItemSelected(index)}
                       type="checkbox" className="h-4 w-4" />
                    </td>
                    <td className=" ">{item.id}</td>
                    <td className=" ">
                      <div className="relative">
                        <div
                          onClick={() => setOpen(open === item.id ? null : item.id)}
                          className="w-full text-left px-2 py-2 border-x border-gray-300 "
                        >
                          {item.item_code || "Select item..."}
                        </div>
                        {open === item.id && (
                          <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                            <input
                              type="text"
                              placeholder="Search items..."
                              className="w-full p-2 border border-gray-300"
                            />
                            <ul className="max-h-32 overflow-y-auto z-50">
                              {itemList.map((code) => (
                                <li
                                  key={code.value}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleItemSelect(item.id, code)}
                                >
                                  {code.item_code}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className=" ">
                      <input
                        type="text"
                        value={item.item_name}
                        readOnly
                        className="w-full p-2 border-x border-gray-300 bg-gray-100"
                      />
                    </td>
                    <td className=" ">
                      <input
                        type="date"
                        value={DateOfRequredBy}
                        onChange={handleDateOfRequredBy}
                        className="w-full p-2 border-x border-gray-300 "
                      />
                    </td>
                    <td className=" ">
                      <input
                        type="number"
                        value={itemQuantity}
                        onChange={handleDateOfRequiredBy}
                        className="w-full p-2 border-x border-gray-300 "
                      />
                    </td>
                  
                    <td className="">
                      <span onClick={() => removeRow(index)} className=" py-1 flex items-center justify-center text-black  text-xl rounded-md">
                      <MdDelete />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-row gap-3'>
            <div
              onClick={addRow}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >Add Row</div>
            <div
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Add Item
            </div>

          </div>

          <div className='flex flex-row gap-3'>
            <div
             onClick={handleRedirectToRedeliveryRequest}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >Cancel</div>
            
            <button
              type="submit"
              onClick={handleRedirectToRedeliveryRequest}
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








































// import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaArrowLeft } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';


// const RedeliveryForm = () => {
//   const [customers, setCustomers] = useState<{ name: string }[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCustomer, setSelectedCustomer] = useState('');
//   const [selectedItems, setSelectedItems] = useState(new Set<number>());
//   const [address, setAddress] = useState<{
//     address_title: string;
//     address_line1: string;
//     city: string;
//     country: string;
//   } | null>(null);
//   const [contact, setContact] = useState('');
//   const [email, setEmail] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const [dateOfPosting, setDateOfPosting] = useState('');
//   const [DateOfDelivery, setDateOfDelivery] = useState('');
//   const [purpose, setPurpose] = useState('');
//   const [transportData, setTransportData] = useState({});
//   const navigator = useNavigate();
//   const [items, setItems] = useState<{
//     item_code: string;
//     item_name: React.ReactNode; name: string
//   }[]>([]);
//   const [loginUser, setLoginUser] = useState<string | null>(null);
//   const [customerLoginUser, setCustomerLoginUser] = useState<{
//     customer_name: string;
//     customer_group: string;
//   } | null>(null);



//   const groupBy = customerLoginUser?.customer_group ?? "Default Group";

//   // console.log(transportData,"rrrrrrrrrreeee")
//   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setPurpose(event.target.value);
//   };

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setDateOfPosting(e.target.value);
//   };
//   const handleDateOfDelivery = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setDateOfDelivery(e.target.value);
//   };
//   const handleItemSelect = (index: number) => {
//     const updatedSelectedItems = new Set(selectedItems);
//     if (updatedSelectedItems.has(index)) {
//       updatedSelectedItems.delete(index);
//     } else {
//       updatedSelectedItems.add(index);
//     }
//     setSelectedItems(updatedSelectedItems);
//   };

//   console.log(email, contact, "")
//   console.log(customerName, "")
//   console.log(loginUser, "")



//   // Consolidated useEffect for all API calls
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // 1. Fetch logged-in user email
//         const userResponse = await axios.get('/api/method/frappe.auth.get_logged_user');
//         const loginUserEmail = userResponse.data.message;
//         setLoginUser(loginUserEmail);

//         // 2. Fetch customer data using login email
//         const customerResponse = await axios.get(`/api/resource/Customer?fields=["*"]&filters=[["Portal User","user", "=", "${encodeURIComponent(loginUserEmail)}"]]`);
//         const customerData = customerResponse.data.data[0]; // Assuming we get the first customer
//         setCustomerLoginUser(customerData);

//         const transporterResponse = await axios.get(`/api/resource/Customer/${encodeURIComponent(customerData?.name)}`);
//         const transporterData = transporterResponse?.data?.data?.custom_suppliers;

//         // Check if transporterData exists and map the first element

//         if (transporterData && transporterData.length > 0) {
//           console.log(transporterData[0].supplier, "transporterData"); // Log the supplier of the first custom supplier
//           setTransportData(transporterData[0].supplier); // Set transporter name from transporterData
//         } else {
//           console.log("No transporter data found.");
//           setTransportData(transporterData); // Handle case when there's no transporter data
//         }



//         // 3. Fetch child customers of the logged-in customer
//         const childCustomersResponse = await axios.get(`/api/resource/Customer?fields=["name"]&filters=[["custom_parent_customer", "=", "${encodeURIComponent(customerData.name)}"]]`);
//         setCustomers(childCustomersResponse.data.data); // Set child customers

//         // 4. Fetch items (optional, keeping it in the same flow)
//         const itemsResponse = await axios.get(`/api/method/lbf_logistica.api.bol.get_unique_items?customer=${encodeURIComponent(customerData.name)}&fields=["item_code","item_name","items_quantity"]`);
//         console.log(itemsResponse, "itemresponse ")
//         setItems(itemsResponse.data.message || "none");

//         // Automatically select the first child customer and fetch its details
//         if (childCustomersResponse.data.data.length > 0) {
//           const firstCustomer = childCustomersResponse.data.data[0].name;
//           setSelectedCustomer(firstCustomer);
//           setCustomerName(firstCustomer);
//           await fetchAddress(firstCustomer);
//           await fetchContactEmail(firstCustomer);
//         }

//         setLoading(false);
//       } catch (err: any) {
//         setError(err.message || 'Error fetching data');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []); // No dependencies, run once on mount

//   // Fetch address based on selected customer
//   const fetchAddress = async (customerName: string) => {
//     try {
//       const response = await axios.get(`/api/resource/Address?fields=["name","links.link_name","city","country","address_title","address_type","address_line1"]&filters=[["Dynamic Link", "link_name", "=", "${encodeURIComponent(customerName)}"]]`);
//       setAddress(response.data.data[0] || null);
//     } catch (err: any) {
//       setError(err.message || 'Error fetching address');
//     }
//   };

//   // Fhttp://127.0.0.1:8010/api/resource/Contact/?fields=[%22name%22,%22links.link_name%22,%20%22email_id%22,%22email_ids.email_id%22,%22phone_nos.phone%22]&filters=[[%22Dynamic%20Link%22,%20%22link_name%22,%20%22=%22,%20%22anil%22]]

//   // /api/resource/Contact/?fields=["name","links.link_name", "email_id","email_ids.email_id","phone_nos.phone"]&filters=[["Dynamic Link", "link_name", "=", "Tushar"]]
//   const fetchContactEmail = async (customerName: string) => {
//     try {
//       const response = await axios.get(`/api/method/lbf_logistica.api.bol.get_customer_contacts?customer_name=${encodeURIComponent(customerName)}`);


//       const contactData = response?.data.message;


//       if (contactData && Array.isArray(contactData) && contactData.length > 0) {
//         // Assuming you want to fetch the first contact from the array
//         const contact = contactData[0];
//         setContact(contact.email_id);
//         setEmail(contact.phone);
//       } else {
//         setContact('');
//         setEmail('');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Error fetching contact and email');
//     }
//   };



//   // Handle customer selection
//   const handleCustomerSelect = (event: ChangeEvent<HTMLSelectElement>) => {
//     const selectedName = event.target.value;
//     setSelectedCustomer(selectedName);
//     setCustomerName(selectedName);
//     if (selectedName) {
//       fetchAddress(selectedName);
//       fetchContactEmail(selectedName);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;


//   // Render loading state
//   if (loading) return <div>Loading...</div>;

//   // Render error state
//   if (error) return <div>Error: {error}</div>;

//   // Handle form submission
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     const selectedItemsData = items.filter((_, index) => selectedItems.has(index));

//     const csrfToken = 'your-csrf-token';
//     const headers: Record<string, string> = {
//       'Content-Type': 'application/json',
//       ...(csrfToken ? { 'X-Frappe-CSRF-Token': csrfToken } : {})
//     };

//     const myData = {
//       service: "Peneus Hub",
//       schedule_date: dateOfPosting,
//       material_request_type: purpose,
//       party_type: groupBy,
//       customer: customerLoginUser?.customer_name,
//       address_of_customer: address
//         ? `${address.address_title}, ${address.address_line1}, ${address.city}, ${address.country}` : 'Address not available',
//       shipping_to: customerLoginUser?.customer_name,
//       shipping_address_name: "",
//       address: "",
//       // customer_contact: contact,
//       contact_person: "",
//       contact: contact,
//       transporter_name: transportData,
//       transporter_address: "  ",
//       items: selectedItemsData.map((item) => ({
//         item_code: item.name,
//         schedule_date: DateOfDelivery,
//         qty: 1.0,
//         warehouse: "",
//         stock_uom: "",
//         uom: "Box",
//         conversion_factor: 1.0,
//         description: ""
//       })),
//     };

//     try {
//       const result = await fetch('/api/method/lbf_logistica.api.bol.save_material_request_instruction_log', {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(myData),
//       });
//       const resultJson = await result.json();
//       console.log('Data posted successfully:', resultJson);

//       // Show success message to the user
//       alert('Data posted successfully!');
//       console.log(resultJson);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };


//   // const fetchData = async () => {
//   //   try {
//   //     const response = await axios.get('http://127.0.0.1:8010/api/resource/Contact', {
//   //       params: {
//   //         fields: JSON.stringify(["name", "links.link_name", "email_id", "email_ids.email_id", "phone_nos.phone"]),
//   //         filters: JSON.stringify([["Dynamic Link", "link_name", "=", "anil"]])
//   //       }
//   //       // Add headers if needed, like:
//   //       // headers: { Authorization: `Bearer your_token` }
//   //     });

//   //     console.log(response.data,"aaaaaaaaaaaaaaaaaaaaaaaaa");
//   //   } catch (error) {
//   //     console.error('Error fetching data:', error);
//   //   }
//   // };

//   // fetchData();

//   const handleRedirectToRedeliveryRequest = () => {
//     navigator('/customer_portal/material-request-list');
//   };


//   return (
//     <div className="max-w-4xl border border-gray-300 my-8 mx-auto bg-white p-6 shadow-md rounded-xl">
//       <div className="flex items-center space-x-2 mb-6">
//         <span><FaArrowLeft /></span>
//         <h2 className="text-2xl font-semibold">Material Request </h2>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium">Customer Name</label>
//             <select
//               value={selectedCustomer}
//               onChange={handleCustomerSelect}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
//             >
//               <option value="">Select a customer</option>
//               @typescript-eslint/no-explicit-any
//               {customers.map((customer: any) => (
//                 <option key={customer.name} value={customer.name}>
//                   {customer.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Contact</label>
//             <input
//               type="text"
//               name="contact"
//               value={contact}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Email ID</label>
//             <input
//               type="email"
//               name="email"
//               value={email}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Purpose</label>
//             <select
//               name="purpose"
//               value={purpose}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
//             >
//               <option></option>
//               <option>Redelivery</option>
//               <option>Pick Up</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={
//                 address
//                   ? `${address.address_title}, ${address.address_line1}, ${address.city}, ${address.country}`
//                   : ''
//               }
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Request By</label>
//             <input
//               type="text"
//               name="request-by"
//               value={customerLoginUser?.customer_name || 'Guest'}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Date of Posting</label>
//             <input
//               type="date"
//               name="dateOfPosting"
//               value={dateOfPosting}
//               onChange={handleDateChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Date of Delivery</label>
//             <input
//               type="date"
//               name="dateOfDelivery"
//               value={DateOfDelivery}
//               onChange={handleDateOfDelivery}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto mb-6">
//           <table className="min-w-full mt-8 mb-6 border border-gray-300 divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr className="bg-gray-100 font-bold">
//                 <td className="flex items-center gap-3 px-2 py-2">
//                   <input type="checkbox" className="form-checkbox h-3 w-3" />Item Name
//                 </td>
//                 <td className="px-4 py-2">Item Code</td>
//                 <td className="px-4 py-2">Required Qty</td>
//                 <td className="px-4 py-2">Available Qty</td>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">
//               {items.map((item, index) => (
//                 <tr key={index}>
//                   <td className="flex items-center gap-3 px-2 py-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedItems.has(index)}
//                       onChange={() => handleItemSelect(index)}
//                       className="form-checkbox h-3 w-3" />
//                     {item.item_name}
//                   </td>
//                   <td className="px-4 py-2">{item.item_code  || "N/A"}</td>
//                   <td className="px-4 py-2">---</td>
//                   <td className="px-4 py-2">---</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className='flex flex-row justify-between'>
//           <div className='flex flex-row gap-3'>
//             <button
//               className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
//             >Add Row</button>
//             <button
//               className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
//             >
//               Add Item
//             </button>

//           </div>

//           <div className='flex flex-row gap-3'>
//             <button
//               className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
//             >Cancel</button>
//             <button
//               type="submit"
//               onClick={handleRedirectToRedeliveryRequest}
//               className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-800 transition-colors"
//             >
//               Submit
//             </button>

//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RedeliveryForm;