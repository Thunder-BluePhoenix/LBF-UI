"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ChangeEvent, type FormEvent, Key, ReactNode, useEffect, useState } from "react"
import axios from "axios"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { MdDelete } from "react-icons/md"
import ItemTable from "./ItemsTable"

const RedeliveryForm = () => {
  //customer state 
  const [customers, setCustomers] = useState<{ name: string }[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [customerName, setCustomerName] = useState<string>("")
  const [customerLoginUser, setCustomerLoginUser] = useState<CustomerLoginUser | null>(null)
  const [loginUser, setLoginUser] = useState<string | null>(null)
  //contact state 
  const [contact, setContact] = useState<string>("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<string>("")
  const [showContactFields, setShowContactFields] = useState(false)
  const [email, setEmail] = useState<string>("")
  //address state
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [showAddressFields, setShowAddressFields] = useState(false)
  const [addressDetails, setAddressDetails] = useState<Address | null>(null)
  //date of posting and date of requredby
  const [dateOfPosting, setDateOfPosting] = useState<string>("")
  const [DateOfDelivery, setDateOfDelivery] = useState<string>("")
  const [DateOfRequredBy, setDateOfRequredBy] = useState<string>("")
  //Transporter state
  const [transporters, setTransporters] = useState<Transporter[]>([])
  const [selectedTransporter, setSelectedTransporter] = useState<string>("")
  const [showTransporterFields, setShowTransporterFields] = useState(false)
  const [transporterDetails, setTransporterDetails] = useState<Transporter | null>(null)
  const [transportersLoaded, setTransportersLoaded] = useState(false)
  //error and validation
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  //items list and item state
  const [itemList, setItemList] = useState<FetchedItem[]>([])
  const [items, setItems] = useState<ItemList[]>([])
  //other state
  const [purpose, setPurpose] = useState<string>("")
  const [service, setService] = useState<string>("")
  const [open, setOpen] = useState<number | null>(null)
  const [resultData, setResultData] = useState("")
  const [dataSubmit, setDataSubmit] = useState<dataSubmit | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [docStatus, setDocStatus] = useState<number | null>(null);
  const [reason, setReason] = useState<any>("")
  const [selectedReason, setSelectedReason] = useState("")
  const [season, setSeason] = useState<any>("")
  const [selectedSeasons, setSelectSeason] = useState("")
  const [condition, setCondition] = useState<any>("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [tyreItems, setTyreItems] = useState<any>("")
  const [updateTyreItems, setUpdateTyreItems] = useState<any>(null)
  const [itemsRedelivery, setItemsRedelivery] = useState<any>(null)
  const [mezzo, setMezzo] = useState<string>("")
  const [LicensePlate, setLicensePlate] = useState<string>("");

  const { id } = useParams<{ id: string }>()
  const resetFormFields = () => {
    setSelectedCustomer("")
    setSelectedReason("")
    setLicensePlate("")
    setTyreItems("")
    setLicensePlate("")
    setItemsRedelivery("")
    setUpdateTyreItems("")
    setSelectSeason("")
    setSelectedCondition("")
    setCustomerName("")
    setSelectedAddress("")
    setAddressDetails(null)
    setShowAddressFields(false)
    setSelectedContact("")
    setContact("")
    setEmail("")
    setMezzo("")
    setService("")
    setShowContactFields(false)
    setDateOfPosting(new Date().toISOString().split("T")[0])
    setDateOfDelivery("")
    setDateOfRequredBy("")
    setPurpose("")
    setSelectedTransporter("")
    setTransporterDetails(null)
    setShowTransporterFields(false)
    setItems([])
    setValidationErrors([])
    setResultData("")
    setDataSubmit(null)
    setDocStatus(null)
  }

  useEffect(() => {
    if (id) {
      setIsEditMode(true)
    }
    else {
      setIsEditMode(false)
      resetFormFields()
    }
  }, [id])
  const navigate = useNavigate()
  const groupBy = customerLoginUser?.customer_group ?? "Default Group";
  const LoginCustomerName = customerLoginUser?.customer_name
  console.log(loginUser, itemsRedelivery, "qqqqqqqqqqqqR")
  useEffect(() => {
    if (transporters && transporters.length > 0) {
      c

  useEffect(() => {
    const fetchRedeliveryItems = async () => {
      // Check if purpose is "Redelivery" and customerLoginUser is an object with a valid name
      if (
        purpose === "Redelivery" &&
        typeof customerLoginUser === 'object' &&
        customerLoginUser !== null &&
        'name' in customerLoginUser &&
        typeof customerLoginUser.name === 'string'
      ) {
        try {
          const itemsForRedelivery = await axios.get(
            `/api/method/lbf_logistica.api.bol.get_unique_tyre_hotel_items?customer=${encodeURIComponent(customerLoginUser.name)}&license_plate=${encodeURIComponent(LicensePlate)}&fields=["item_code","item_name","actual_qty","custom_tyre_type","custom_license_plate"]`
          );
          setItemsRedelivery(itemsForRedelivery.data);
        } catch (error: any) {
          console.error("Error fetching items for redelivery:", error.message || error);
        }
      }
    };

    fetchRedeliveryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purpose, LicensePlate]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setDateOfPosting(today)
  }, [])

  const fetchAddress = async (customerName: string) => {
    try {
      const response = await axios.get(
        `/api/resource/Address?fields=["name","address_title","city","country","address_type","address_line1"]&filters=[["Dynamic Link", "link_name", "=", "${encodeURIComponent(customerName)}"]]`
      )
      const addressData = response.data.data || []
      setAddresses(addressData)

      if (!isEditMode) {
        setSelectedAddress("")
        setShowAddressFields(false)
        setAddressDetails(null)
      }
    } catch (err: any) {
      setError(err.message || "Error fetching address")
    }
  }
  const fetchContactEmail = async (customerName: string) => {
    try {
      const response = await axios.get(
        `/api/method/lbf_logistica.api.bol.get_customer_contacts?customer_name=${encodeURIComponent(customerName)}`
      )
      const contactData = response?.data?.message || []
      setContacts(contactData)

      if (!isEditMode) {
        setSelectedContact("")
        setShowContactFields(false)
        setContact("")
        setEmail("")
      }
    } catch (err: any) {
      setError(err.message || "Error fetching Contact and Email")
    }
  }
  const fetchExistingData = async (resultId: string) => {
    try {
      const response = await axios.get(`/api/resource/Material%20Request%20Instruction%20Log/${resultId}?fields=["*"]`)
      const data = response.data.data
      console.log(data, "fetchexitingdata")
      setResultData(data.name)
      setSelectedCustomer(data.shipping_to)
      setCustomerName(data.shipping_to)
      setDateOfPosting(data.transaction_date)
      setPurpose(data.material_request_type)
      setDateOfDelivery(data.schedule_date)
      setDateOfRequredBy(data.items[0]?.schedule_date || "")
      setService(data.service)
      setSelectedReason(data.reason)
      setSelectedCondition(data.condition)
      setSelectSeason(data.season)
      setUpdateTyreItems(data.th_items)
      setLicensePlate(data.license_plate)
      setMezzo(data.mezzo)
      setDocStatus(data.docstatus)
      await fetchAddress(data.shipping_to)
      setSelectedAddress(data.shipping_address_name)

      if (data.shipping_address_name) {
        const transporterResponse = await axios.get(`/api/resource/Address/${encodeURIComponent(data.shipping_address_name)}`)
        const transporterData = transporterResponse?.data?.data.custom_transporters
        setTransporters(transporterData)
        setTransportersLoaded(true)

        if (data.transporter_name) {
          setSelectedTransporter(data.transporter_name)
          const matchedTransporter = transporterData.find((t: { supplier: any }) => t.supplier === data.transporter_name)
          if (matchedTransporter) {
            setTransporterDetails({
              supplier: data.transporter_name,
              cutoff_start_time: matchedTransporter.cutoff_start_time,
              cutoff_end_time: matchedTransporter.cutoff_end_time,
              name: matchedTransporter.name,
              address: matchedTransporter.address
            })
            setShowTransporterFields(true)
          }
        }
      }

      await fetchContactEmail(data.shipping_to)
      setSelectedContact(data.customer_contact)
      setContact(data.contact)
      setEmail(data.email)
      setShowContactFields(true)

      if (data.items && Array.isArray(data.items)) {
        const fetchedItems = data.items.map((item: any, index: number) => ({
          id: index + 1,
          item_code: item.item_code,
          item_name: item.item_name,
          quantity: item.qty,
          requiredBy: item.schedule_date,
          targetWarehouse: item.warehouse,
          uom: item.uom,
          name: item.name,
          available: item.custom_max_order_qty,
        }))
        setItems(fetchedItems)
      }
    } catch (err: any) {
      setError(err.message || "Error fetching existing data")
    }
  }
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
      OthersItemCode: "",
      OthersItemName: "",
      AspectRatio: "",
      Brand: "",
      Carcass: "",
      diameter: "",
      LoadIndex: "",
      Marks: "",
      Model: "",
      SpeedRating: "",
      tireWidth: "",
      weight: "",
      type: "",

      available: undefined,
      otherItemName: "",
      OtherItemCode: ""
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
            available: selectedItem.actual_qty,
            requiredBy: selectedItem.schedule_date,
          }
          : item,
      ),
    )
    setOpen(null)
 


  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  return (

        <div className="grid grid-cols-3 bg-gray-50 p-4 border border-gray-300 rounded gap-4 mb-6 ">

          <div>
            <label className="block text-sm font-medium">Service<span className="text-red-500">*</span></label>
            <select
              name="purpose"
              value={service}
              onChange={handleChangeService}
              disabled={isDocStatusLocked()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option>Select Service</option>
              <option>Peneus Hub</option>
              <option>Tyre Hotel</option>
            </select>
          </div>
          {service === "Tyre Hotel" && (

   
       
    



        <div className="grid grid-cols-3 bg-gray-50 p-4 border border-gray-300 rounded gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Purpose<span className="text-red-500">*</span></label>
            <select
              name="purpose"
              value={purpose}
              onChange={handleChange}
              disabled={isDocStatusLocked()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option></option>
              <option>Redelivery</option>
              {service === "Tyre Hotel" && (<option>Pick Up</option>)}
            </select>
          </div>


   

    
      







      </form>
    </div>
  )
}

export default RedeliveryForm









// import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaArrowLeft } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { MdDelete } from 'react-icons/md';

// interface ItemList {
//   id: number
//   requiredBy: string
//   quantity: number
//   targetWarehouse: string
//   uom: string
//   name: string
//   item_name: string
//   item_code: string
// }

// interface FetchedItem {
//   item_code: string
//   item_name: string
//   items_quantity: number
//   label: string
//   value: string
// }
// const InventoryTable = () => {
//   const [customers, setCustomers] = useState<{ name: string }[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCustomer, setSelectedCustomer] = useState('');
//   const [selectedItems, setSelectedItems] = useState(new Set<number>());
//   const [selectAll, setSelectAll] = useState(false);
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
//   const [itemList, setItemList] = useState<FetchedItem[]>([])
//   const [open, setOpen] = useState<number | null>(null)
//   const navigator = useNavigate();
//   const [items, setItems] = useState<ItemList[]>([])
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
  
//   const handleItemSelected = (index: number) => {
//     const updatedSelectedItems = new Set(selectedItems);
//     if (updatedSelectedItems.has(index)) {
//       updatedSelectedItems.delete(index);
//     } else {
//       updatedSelectedItems.add(index);
//     }
//     setSelectedItems(updatedSelectedItems);
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedItems(new Set()); // Clear all selections
//     } else {
//       const allItemIds = new Set(items.map((_, index) => index)); // Select all
//       setSelectedItems(allItemIds);
//     }
//     setSelectAll(!selectAll); // Toggle state
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
//         setItemList(itemsResponse.data.message || "none");

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

// const fetchContactEmail = async (customerName: string) => {
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

// //item table code 
// const addRow = () => {
//   const newItem: ItemList = {
//     id: items.length + 1,
//     requiredBy: "",
//     quantity: 0,
//     targetWarehouse: "",
//     uom: "",
//     name: "",
//     item_name: "",
//     item_code: "",
//   }
//   setItems([...items, newItem])
// }

// const removeRow = (index: number) => {
//   const updatedItems = items.filter((_, i) => i !== index)
//   setItems(updatedItems)
// }


// const handleItemSelect = (itemId: number, selectedItem: FetchedItem) => {
//   setItems(
//     items.map((item) =>
//       item.id === itemId
//         ? {
//             ...item,
//             item_code: selectedItem.item_code,
//             item_name: selectedItem.item_name,
//             quantity: selectedItem.items_quantity,
//             // You can add more fields here if they are available in the FetchedItem
//           }
//         : item,
//     ),
//   )
//   setOpen(null)
// }

// const handleInputChange = (itemId: number, field: keyof ItemList, value: string | number) => {
//   setItems(items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)))
// }

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

//         <div className=" mb-6">
//         <table className="w-full text-sm border border-gray-300">
//               <thead>
//                 <tr className="border-b border-gray-300">
//                   <th className="p-2 text-left">
//                     <input 
//                     onClick={handleSelectAll}
//                      type="checkbox"
//                      className="h-4 w-4" />
//                   </th>
//                   <th className="p-2 text-left">No.</th>
//                   <th className="p-2 text-left">Item Code *</th>
//                   <th className="p-2 text-left">Item Name</th>
//                   <th className="p-2 text-left">Required By *</th>
//                   <th className="p-2 text-left">Available Qty</th>
//                   <th className="p-2 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((item, index) => (
//                   <tr key={item.id} className="border-b border-gray-300">
//                     <td className="pl-2">
//                       <input
//                        checked={selectedItems.has(index)}
//                        onChange={() => handleItemSelected(index)}
//                        type="checkbox" className="h-4 w-4" />
//                     </td>
//                     <td className="">{item.id}</td>
//                     <td className="">
//                       <div className="relative">
//                         <div
//                           onClick={() => setOpen(open === item.id ? null : item.id)}
//                           className="w-full text-left px-2 py-2 border border-gray-300 rounded-md"
//                         >
//                           {item.item_code || "Select item..."}
//                         </div>
//                         {open === item.id && (
//                           <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
//                             <input
//                               type="text"
//                               placeholder="Search items..."
//                               className="w-full p-2 border border-gray-300"
//                             />
//                             <ul className="max-h-32 overflow-y-auto z-50">
//                               {itemList.map((code) => (
//                                 <li
//                                   key={code.value}
//                                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                                   onClick={() => handleItemSelect(item.id, code)}
//                                 >
//                                   {code.item_code}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="">
//                       <input
//                         type="text"
//                         value={item.item_name}
//                         readOnly
//                         className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
//                       />
//                     </td>
//                     <td className="">
//                       <input
//                         type="text"
//                         value={item.requiredBy}
//                         onChange={(e) => handleInputChange(item.id, "requiredBy", e.target.value)}
//                         className="w-full p-2 border border-gray-300 rounded-md"
//                       />
//                     </td>
//                     <td className="">
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         onChange={(e) => handleInputChange(item.id, "quantity", Number(e.target.value))}
//                         className="w-full p-2 border border-gray-300 rounded-md"
//                       />
//                     </td>
                  
//                     <td className="">
//                       <span onClick={() => removeRow(index)} className="px-2 py-1  text-red-500 text-xl rounded-md">
//                       <MdDelete />
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//         </div>
//         <div className='flex flex-row justify-between'>
//           <div className='flex flex-row gap-3'>
//             <div
//               onClick={addRow}
//               className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
//               >Add Row</div>
//             <div
//               className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
//             >
//               Add Item
//             </div>

//           </div>

//           <div className='flex flex-row gap-3'>
//             <div
//              onClick={handleRedirectToRedeliveryRequest}
//               className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
//             >Cancel</div>
            
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

// export default InventoryTable;






