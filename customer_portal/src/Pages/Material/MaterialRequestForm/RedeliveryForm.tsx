"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react"
import axios from "axios"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { MdDelete } from "react-icons/md"

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

interface Address {
  address_title: string
  address_line1: string
  city: string
  country: string
}

interface CustomerLoginUser {
  customer_name: string
  customer_group: string
}

interface Contact {
  name: string
  phone: string
  email_id: string
}
interface Address {
  name: string  // Added name for the address identifier
  address_title: string
  address_line1: string
  city: string
  country: string
  address_type: string

}

interface Transporter {
  supplier: string
  cutoff_start_time: string
  cutoff_end_time: string
  name: string
}

interface dataSubmit {
  message?: {
    message: string;
  };
}


const RedeliveryForm = () => {
  const [customers, setCustomers] = useState<{ name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [showAddressFields, setShowAddressFields] = useState(false)
  const [addressDetails, setAddressDetails] = useState<Address | null>(null)
  const [contact, setContact] = useState<string>("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<string>("")
  const [showContactFields, setShowContactFields] = useState(false)
  const [email, setEmail] = useState<string>("")
  const [customerName, setCustomerName] = useState<string>("")
  const [dateOfPosting, setDateOfPosting] = useState<string>("")
  const [DateOfDelivery, setDateOfDelivery] = useState<string>("")
  const [purpose, setPurpose] = useState<string>("")
  const [transporters, setTransporters] = useState<Transporter[]>([])
  const [selectedTransporter, setSelectedTransporter] = useState<string>("")
  const [showTransporterFields, setShowTransporterFields] = useState(false)
  const [transporterDetails, setTransporterDetails] = useState<Transporter | null>(null)
  const [itemList, setItemList] = useState<FetchedItem[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const [items, setItems] = useState<ItemList[]>([])
  const [loginUser, setLoginUser] = useState<string | null>(null)
  const [customerLoginUser, setCustomerLoginUser] = useState<CustomerLoginUser | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [resultData, setResultData] = useState("")
  const [dataSubmit, setDataSubmit] = useState<dataSubmit | null>(null);
  const [isEditMode, setIsEditMode] = useState(false)

  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const groupBy = customerLoginUser?.customer_group ?? "Default Group"

  console.log(loginUser, selectedAddress,selectedCustomer,selectedContact, purpose, "qqqqqqqqqqqqR")

  const validateForm = () => {
    const errors: string[] = []


    if (!customerName) {
      errors.push("Customer Name is required.")
    }

    if (!selectedContact) {
      errors.push("Contact selection is required.")
    }

    if (!DateOfDelivery) {
      errors.push("Date of Delivery is required.")
    }

    if (!selectedAddress) {
      errors.push("Address selection is required.")
    }
    if (!selectedTransporter) {
      errors.push("Transporter selection is required.")
    }
    if (!purpose) {
      errors.push("Purpose is required.")
    }
  
  

    setValidationErrors(errors)
    return errors.length === 0
  }
   // Function to show the error popup
  
  // Function to close the popup
  
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPurpose(event.target.value)
  }

  const handleContactSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedContact(selectedValue);
  
    if (selectedValue) {
      setShowContactFields(true);
      const selectedContactData = contacts.find(c => c.name === selectedValue);
      if (selectedContactData) {
        setContact(selectedContactData.phone || "");
        setEmail(selectedContactData.email_id || "");
      }
    } else {
      setShowContactFields(false);
      setContact("");
      setEmail("");
    }
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfPosting(e.target.value)
  }

  const handleDateOfDelivery = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfDelivery(e.target.value)
  }

  const handleAddressSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setSelectedAddress(selectedValue)

    if (selectedValue) {
      setShowAddressFields(true)
      const selectedAddressData = addresses.find(a => a.name === selectedValue)
      if (selectedAddressData) {
        setAddressDetails(selectedAddressData)
      }
    } else {
      setShowAddressFields(false)
      setAddressDetails(null)
    }
  }

  const handleTransporterSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setSelectedTransporter(selectedValue)

    if (selectedValue) {
      setShowTransporterFields(true)
      const selectedTransporterData = transporters.find(t => t.supplier === selectedValue)
      if (selectedTransporterData) {
        setTransporterDetails(selectedTransporterData)
      }
    } else {
      setShowTransporterFields(false)
      setTransporterDetails(null)
    }
  }

 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const userResponse = await axios.get("/api/method/frappe.auth.get_logged_user")
        const loginUserEmail = userResponse.data.message
        setLoginUser(loginUserEmail)

        const customerResponse = await axios.get(
          `/api/resource/Customer?fields=["*"]&filters=[["Portal User","user", "=", "${encodeURIComponent(loginUserEmail)}"]]`
        )
        const customerData = customerResponse.data.data[0]
        setCustomerLoginUser(customerData)

        const transporterResponse = await axios.get(`/api/resource/Customer/${encodeURIComponent(customerData?.name)}`)
        const transporterData = transporterResponse?.data?.data?.custom_suppliers
        console.log(transporterResponse, "kkkkkkkk")

        if (transporterData && transporterData.length > 0) {
          setTransporters(transporterData)
          setSelectedTransporter("")
          setShowTransporterFields(false)
          setTransporterDetails(null)
        } else {
          setTransporters(transporterData)
        }

        const childCustomersResponse = await axios.get(
          `/api/method/lbf_logistica.api.bol.get_customers_with_parent?customer_name=${encodeURIComponent(customerData.name)}`
        )
        setCustomers(childCustomersResponse.data.data)

        const itemsResponse = await axios.get(
          `/api/method/lbf_logistica.api.bol.get_unique_items?customer=${encodeURIComponent(customerData.name)}&fields=["item_code","item_name","actual_qty"]`
        )
        setItemList(itemsResponse.data.message || [])

        if (id) {
          setIsEditMode(true)
         fetchExistingData(id)
        }

        if (childCustomersResponse.data.data.length > 0) {
          const firstCustomer = childCustomersResponse.data.data[0].name
          setSelectedCustomer(firstCustomer)
          setCustomerName(firstCustomer)
          await fetchAddress(firstCustomer)
          await fetchContactEmail(firstCustomer)
        }

        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Error fetching data")
        setLoading(false)
      }
    }

    fetchData()
  }, [id, resultData])

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

      // Reset address selection when customer changes
      setSelectedAddress("")
      setShowAddressFields(false)
      setAddressDetails(null)
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

      setSelectedContact("")
      setShowContactFields(false)
      setContact("")
      setEmail("")
    } catch (err: any) {
      setError(err.message || "Error fetching contact and email")
    }
  }

  const fetchExistingData = async (resultData: string) => {
    try {
      const response = await axios.get(`/api/resource/Material%20Request%20Instruction%20Log/${resultData}?fields=["*"]`)
      const data = response.data.data
      console.log(data, "uapdate data")


      setResultData(data.name)
      setSelectedCustomer(data.customer)
      setDateOfPosting(data.schedule_date)
      setPurpose(data.material_request_type)
      setSelectedAddress(data.address_of_customer)
      setSelectedContact(data.contact_person)
      setContact(data.contact)
      setEmail(data.contact_email)
      setDateOfDelivery(data.delivery_date)
      setTransporterDetails(data.transporter_name)
     


      const fetchedItems = data.items.map((item: any, index: number) => ({
        id: index + 1,
        item_code: item.item_code,
        item_name: item.name,
        quantity: item.qty,
        requiredBy: item.schedule_date,
        targetWarehouse: item.warehouse,
        uom: item.uom,
        name: item.name,
      }))
      setItems(fetchedItems)
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
          }
          : item
      )
    )
    setOpen(null)
  }

  const handleCustomerSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value
    setSelectedCustomer(selectedName)
    setCustomerName(selectedName)
    if (selectedName) {
      fetchAddress(selectedName)
      fetchContactEmail(selectedName)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const csrfToken = "your-csrf-token"
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-Frappe-CSRF-Token": csrfToken } : {}),
    }

    const myData = {
      name: resultData,
      service: "Peneus Hub",
      schedule_date: dateOfPosting,
      material_request_type: purpose,
      party_type: groupBy,
      customer: customerName,
      address_of_customer: addressDetails
        ? `${addressDetails.address_title}, ${addressDetails.address_line1}, ${addressDetails.city}, ${addressDetails.country}`
        : "Address not available",
      shipping_to: customerLoginUser?.customer_name,
      shipping_address_name: "",
      address: "",
      contact_person: selectedContact,
      contact: contact,
      contact_email: email,
      transporter_name: transporterDetails?.supplier,
      transporter_address: "",
      items: items.map((item) => ({
        item_code: item.item_code,
        schedule_date: dateOfPosting,
        qty: item. quantity,
        stock_uom: "Nos",
        uom: "Nos",
        conversion_factor: 1.0,
        description: "",
      })),
    }

    try {
      let result
      if (isEditMode && id) {
        result = await axios.put(`/api/method/lbf_logistica.api.bol.save_material_request_instruction_log/${resultData}?fields=["*"]`, myData, { headers })
      } else {
        result = await axios.post("/api/method/lbf_logistica.api.bol.save_material_request_instruction_log", myData, {
          headers,
        })
      }

      alert(isEditMode ? "Material Request updated successfully!" : "Material Request created successfully!")
      const resultId = isEditMode ? id : result.data.message.name
      setResultData(resultId)
      navigate(`/customer_portal/material-request-form/${resultId}`)
    } catch (err: any) {
      setError(err.message || "Error submitting redelivery request")
    }
  }

  const handleFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // if (!validateForm()) {
    //   return
    // }
    const csrfToken = 'your-csrf-token';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-Frappe-CSRF-Token': csrfToken } : {})
    };

    const siubmitData = {
    name: resultData ,
     };

    try {
      const submitResult = await fetch('/api/method/lbf_logistica.api.bol.submit_material_request', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(siubmitData),
      });
      const resultSubmitJson = await submitResult.json();
      setDataSubmit(resultSubmitJson)
      // Show success message to the user
      
      console.log(resultSubmitJson);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-6xl border border-gray-300 my-8 mx-auto bg-white p-6 shadow-md rounded-xl">
      <p className="mb-4 text-red-500">{dataSubmit?.message?.message}</p>
      <div className="flex items-center space-x-2 mb-6">
        <span onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </span>
        <h2 className="text-2xl font-semibold">{isEditMode ? "Edit" : "Create"} Material Request</h2>
      
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Request By</label>
            <input
              type="text"
              name="request-by"
              value={customerLoginUser?.customer_name || "Guest"}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Party Type</label>
            <input
              type="text"
              name="request-by"
              value={groupBy || "Guest"}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            />
          </div>
        
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <select
              value={selectedCustomer}
              onChange={handleCustomerSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option value="">Select Customer</option>
              {customers.map((customer: any) => (
                <option key={customer.name} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Select Contact</label>
            <select
              value={selectedContact}
              onChange={handleContactSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option value="">Select Contact</option>
              {contacts.map((contact) => (
                <option key={contact.name} value={contact.name}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>

          {showContactFields && (
            <>
              <div>
                <label className="block text-sm font-medium">Contact</label>
                <input
                  type="text"
                  value={contact}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email ID</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>
            </>
          )}




          <div>
            <label className="block text-sm font-medium">Select Address</label>
            <select
              value={selectedAddress}
              onChange={handleAddressSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option value="">Select Address</option>
              {addresses.map((addr) => (
                <option key={addr.name} value={addr.name}>
                  {addr.address_title} - {addr.address_type}
                </option>
              ))}
            </select>
          </div>

          {showAddressFields && addressDetails && (
            <>

              <div>
                <label className="block text-sm font-medium">City & Country</label>
                <input
                  type="text"
                  value={`${addressDetails.address_line1}, ${addressDetails.city}, ${addressDetails.country}`}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>
            </>
          )}


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
        

          <div>
            <label className="block text-sm font-medium">Select Transporter</label>
            <select
              value={selectedTransporter}
              onChange={handleTransporterSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option value="">Select Transporter</option>
              {transporters && Array.isArray(transporters) && transporters.length > 0 ? (
                transporters.map((transporter, index) => (
                  <option
                    key={transporter.name || index}
                    value={transporter.supplier || ''}
                  >
                    {transporter.supplier || 'Unknown Supplier'}
                  </option>
                ))
              ) : (
                <option value="">No transporters available</option>
              )}
            </select>
          </div>

          {showTransporterFields && transporterDetails && (
            <>
              <div>
                <label className="block text-sm font-medium">Cutoff Start Time</label>
                <input
                  type="text"
                  value={transporterDetails.supplier}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Cutoff Start Time</label>
                <input
                  type="text"
                  value={transporterDetails.cutoff_start_time}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Cutoff End Time</label>
                <input
                  type="text"
                  value={transporterDetails.cutoff_end_time}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>
            </>
          )}
</div>


       

        <div className=" mb-6">
          <table className="w-full text-sm border rounded-md border-gray-300">
            <thead>
              <tr className="border-b  border-gray-300">
                <th className="p-2 text-left">No.</th>
                <th className="p-2 text-left">Item Code *</th>
                <th className="p-2 text-left">Item Name</th>
                <th className="p-2 text-left">Required By *</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Available Qty</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b rounded-md border-gray-300">
                  <td className=" p-2 text-left">{item.id}</td>
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
                      value={dateOfPosting}
                      // onChange={handleDateOfRequredBy}
                      className="w-full p-2 border-x border-gray-300 "
                    />
                  </td>
                  <td className=" ">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const updatedItems = items.map((i) =>
                          i.id === item.id ? { ...i, quantity: Number.parseInt(e.target.value, 10) } : i,
                        )
                        setItems(updatedItems)
                      }}
                      className="w-full p-2 border-x border-gray-300 "
                    />
                  </td>
                  <td className="border-r border-gray-300"></td>
                  <td className="">
                    <span
                      onClick={() => removeRow(index)}
                      className=" py-1 flex items-center justify-center text-black  text-xl rounded-md"
                    >
                      <MdDelete />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-3">
            <button
              type="button"
              onClick={addRow}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Add Row
            </button>
            
          </div>

          {validationErrors.length > 0 && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <h2 className="text-xl font-semibold mb-4">Validation Errors</h2>
                <ul className="list-disc pl-5">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-red-600">
                      {error}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setValidationErrors([])}
                  className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        <div className="flex flex-row gap-2">
        <button
            type="submit"
            // onClick={handleRedirectToRedeliveryRequest}
            className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-800 transition-colors"
          >
            {isEditMode ? "Update" : "Save"}
          </button>
          {isEditMode ? 
        <button 
      className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors "
      onClick={handleFinalSubmit}>
        Submit
      </button>
      : ""}
        </div>
          {error && <p style={{ color: "red" }}>{error},<br>{dataSubmit?.message?.message}</br></p>}
       </div>
      </form>
    </div>
  )
}

export default RedeliveryForm

