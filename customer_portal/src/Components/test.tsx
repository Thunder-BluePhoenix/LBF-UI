"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ChangeEvent, type FormEvent, Key, ReactNode, useEffect, useState } from "react"
import axios from "axios"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { MdDelete } from "react-icons/md"
import ItemTable from "./ItemsTable"

interface ItemList {
  type: any
  weight: any
  tireWidth: any
  SpeedRating: any
  Model: any
  Marks: any
  LoadIndex: any
  diameter: any
  Carcass: any
  Brand: any
  AspectRatio: any
  otherItemName: any
  OtherItemCode: any
  available: ReactNode,
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
  schedule_date: string
  item_code: string
  item_name: string
  items_quantity: number
  label: string
  value: string
  actual_qty: number
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
  name: string
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
  name: any
  address: any
  is_default?: number
}

interface dataSubmit {
  message?: {
    message: string;
    docstatus: number;
  };
}

type RowData = {
  id: number;
  item_code: string;
  item_name: string;
  requiredBy: string;
  quantity: string;
  uom: string;
  uomConversion: string;
  type: string;
  selectedItem: string;
  // Add all the other properties from ItemList to make it compatible
  weight?: any;
  tireWidth?: any;
  SpeedRating?: any;
  Model?: any;
  Marks?: any;
  LoadIndex?: any;
  diameter?: any;
  Carcass?: any;
  Brand?: any;
  AspectRatio?: any;
  otherItemName?: any;
  OtherItemCode?: any;
  available?: ReactNode;
  targetWarehouse?: string;
  name?: string;
};


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



  const { id } = useParams<{ id: string }>()
  const resetFormFields = () => {
    setSelectedCustomer("")
    setCustomerName("")
    setSelectedAddress("")
    setAddressDetails(null)
    setShowAddressFields(false)
    setSelectedContact("")
    setContact("")
    setEmail("")
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

  
  console.log(loginUser, items,tyreItems, "qqqqqqqqqqqqR")

  useEffect(() => {
    if (transporters && transporters.length > 0) {
      const defaultTransporter = transporters.find(item => item.is_default === 1);
      if (defaultTransporter) {
        setSelectedTransporter(defaultTransporter.supplier);
        setTransporterDetails(defaultTransporter);
        setShowTransporterFields(true);
      }
    }
  }, [transporters]);


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
  const handleDataChange = (rows: RowData[]) => {
    // Convert RowData[] to ItemList[] by mapping and adding missing properties
    const convertedItems: ItemList[] = rows.map(row => ({
      id: row.id,
      item_code: row.item_code,
      item_name: row.item_name,
      requiredBy: row.requiredBy,
      quantity: parseInt(row.quantity) || 0,
      uom: row.uom,
      targetWarehouse: row.targetWarehouse || "",
      name: row.name || "",
      type: row.type,
      weight: row.weight || "",
      tireWidth: row.tireWidth || "",
      SpeedRating: row.SpeedRating || "",
      Model: row.Model || "",
      Marks: row.Marks || "",
      LoadIndex: row.LoadIndex || "",
      diameter: row.diameter || "",
      Carcass: row.Carcass || "",
      Brand: row.Brand || "",
      AspectRatio: row.AspectRatio || "",
      otherItemName: row.otherItemName || "",
      OtherItemCode: row.OtherItemCode || "",
      available: row.available || null,
    }));
    
    setItems(convertedItems);
    console.log("Updated Rows from Child:", rows);
  };


  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPurpose(event.target.value)
  }
  const handleChangeService = (event: ChangeEvent<HTMLSelectElement>) => {
    setService(event.target.value)
  }
  const handleChangeCondition = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedcondition = event.target.value
    setSelectedCondition(selectedcondition)
  }
  const handleChangeReason = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedReason = event.target.value
    setSelectedReason(selectedReason)
  }
  const handleChangeSeason = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedSeason = event.target.value
    setSelectSeason(selectedSeason)
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
  const handleDateOfRequredBy = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfRequredBy(e.target.value)
  }


  const handleDateOfDelivery = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfDelivery(e.target.value)
  }

  const handleAddressSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedAddress(selectedValue);

    if (selectedValue) {
      setShowAddressFields(true);
      const selectedAddressData = addresses.find(a => a.name === selectedValue);
      setAddressDetails(selectedAddressData || null);

      try {
        const transporterResponse = await axios.get(`/api/resource/Address/${encodeURIComponent(selectedValue)}`);
        const transporterData = transporterResponse?.data?.data.custom_transporters;
        setTransporters(transporterData);
        setTransportersLoaded(true);

        if (!transporterData || transporterData.length === 0) {
          setShowTransporterFields(false);
          setTransporterDetails(null);
          setSelectedTransporter('');
        }

        if (isEditMode && selectedTransporter) {
          const matchedTransporter = transporterData.find((t: { supplier: string }) => t.supplier === selectedTransporter);
          if (matchedTransporter) {
            setTransporterDetails(matchedTransporter);
            setShowTransporterFields(true);
          } else {
            setShowTransporterFields(false);
          }
        }
      } catch (error) {
        console.error("Error fetching transporter data:", error);
        setTransporters([]);
        setTransportersLoaded(false);
        setShowTransporterFields(false);
      }
    } else {
      setShowAddressFields(false);
      setAddressDetails(null);
      setTransporters([]);
      setShowTransporterFields(false);
    }
  };
  const handleTransporterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedTransporter(selectedValue);

    if (selectedValue && transporters.length > 0) {
      const matchedTransporter = transporters.find(t => t.supplier === selectedValue);
      if (matchedTransporter) {
        setTransporterDetails(matchedTransporter);
        setShowTransporterFields(true);
      } else {
        setTransporterDetails(null);
        setShowTransporterFields(false);
      }
    } else {
      setTransporterDetails(null);
      setShowTransporterFields(false);
    }
  };



  useEffect(() => {
    if (isEditMode && transportersLoaded && selectedTransporter && transporters.length > 0) {
      const matchedTransporter = transporters.find(t => t.supplier === selectedTransporter);
      if (matchedTransporter) {
        setTransporterDetails(matchedTransporter);
        setShowTransporterFields(true);
      }
      else {
        setShowTransporterFields(false);
      }
    }
  }, [isEditMode, transportersLoaded, selectedTransporter, transporters]);



  useEffect(() => {
    if (isEditMode && selectedAddress && addresses.length > 0) {
      const matchingAddress = addresses.find(addr => addr.name === selectedAddress);
      if (matchingAddress) {
        setAddressDetails(matchingAddress);
        setShowAddressFields(true);
      }
    }
  }, [addresses, selectedAddress, isEditMode]);


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
          await fetchExistingData(id)
        } else {
          if (childCustomersResponse.data.data.length > 0) {
            const firstCustomer = childCustomersResponse.data.data[0].name
            setSelectedCustomer(firstCustomer)
            setCustomerName(firstCustomer)
            await fetchAddress(firstCustomer)
            await fetchContactEmail(firstCustomer)
          }
        }

        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Error fetching data")
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

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
      OtherItemCode: "",
      otherItemName: "",
      AspectRatio: "",
      Brand: "",
      Carcass: "",
      diameter: "",
      LoadIndex:"",
      Marks: "",
      Model: "",
      SpeedRating: "",
      tireWidth: "",
      weight: "",
      type: "",


     available: undefined,
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
  }

  useEffect(() => {
    const fetchData = async () => {
      if (service){
      try {
        // Using Promise.all to fetch all the APIs concurrently
        const [reasonRes, seasonRes, conditionRes, itemRes,] = await Promise.all([
          fetch('/api/resource/Reason'),
          fetch('/api/resource/Season'),
          fetch('/api/resource/Condition'),
          fetch('/api/resource/Item'),
        ]);

        // Parsing the response to JSON
        const reason = await reasonRes.json();
        const season = await seasonRes.json();
        const condition = await conditionRes.json();
        const item = await itemRes.json();




        // Setting the state with the fetched data
        setReason(reason);
        setSeason(season);
        setCondition(condition);
        setTyreItems(item);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
  }
    fetchData();
  }, [service]);

  const handleCustomerSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value
    setSelectedCustomer(selectedName)
    setCustomerName(selectedName)
    if (selectedName) {
      await fetchAddress(selectedName)
      await fetchContactEmail(selectedName)
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
      service: service,
      transaction_date: dateOfPosting,
      schedule_date: DateOfDelivery,
      material_request_type: purpose,
      party_type: groupBy,
      season: selectedSeasons,
      condition: selectedCondition,
      reason: selectedReason,
      license_plate: "test",
      mezzo: "texxx",
      customer: customerLoginUser?.customer_name,
      customer_contact: selectedContact,
      // address_of_customer: addressDetails
      //   ? `${addressDetails.address_title}, ${addressDetails.address_line1}, ${addressDetails.city}, ${addressDetails.country}`
      //   : "Address not available",
      shipping_to: customerName,
      shipping_address_name: selectedAddress,
      contact_person: selectedContact,
      contact: contact,
      email: email,
      transporter_name: transporterDetails?.supplier,
      items: items.map((item) => ({
        item_code: item.item_code,
        item_name: item.item_name,
        schedule_date: DateOfRequredBy || item.requiredBy,
        qty: 1,
        stock_uom: "Nos",
        uom: "Nos",
        conversion_factor: 1.0,
        description: "",
        other_item_code: item.OtherItemCode,
        other_item_name: item.otherItemName,
        aspect_ratio_others: item.AspectRatio,
        brandothers: item.Brand,
        carcass_others: item.Carcass,
        diameterinch_others: item.diameter,
        load_index_others: item.LoadIndex,
        marks_others: item.Marks,
        model_others: item.Model,
        speed_rating_others: item.SpeedRating,
        tire_widthmm_others: item.tireWidth,
        weight_others: item.weight,
        type: item.type,
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
    const csrfToken = 'your-csrf-token';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-Frappe-CSRF-Token': csrfToken } : {})
    };

    const siubmitData = {
      name: resultData,
    };

    try {
      const submitResult = await fetch('/api/method/lbf_logistica.api.bol.submit_material_request', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(siubmitData),
      });
      const resultSubmitJson = await submitResult.json();
      setDataSubmit(resultSubmitJson)
      if (resultSubmitJson.message?.docstatus !== undefined) {
        setDocStatus(resultSubmitJson.message.docstatus);
      }


      console.log(resultSubmitJson);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const isDocStatusLocked = () => {
    return docStatus === 1;
  };

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-7xl border border-gray-300 my-8 mx-auto bg-white p-6 shadow-md rounded-xl">
      <p className="mb-4 text-red-500">{dataSubmit?.message?.message}</p>
      <div className="flex items-center space-x-2 mb-6">
        <span onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </span>
        <h2 className="text-xl font-semibold"><span
          className={`${!isDocStatusLocked()
            ? isEditMode
              ? "bg-yellow-500 text-white px-2 py-1 rounded-lg"
              : "bg-green-500 text-white px-2 py-1 rounded-lg"
            : "bg-blue-500 text-white px-2 py-1 rounded-lg"
            }`}
        >
          {!isDocStatusLocked() ? (isEditMode ? "Edit OR Submit" : "Create") : "Submit"}
        </span> Material Request</h2>

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
              disabled={isDocStatusLocked()}
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
              disabled={isDocStatusLocked()}
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
              disabled={isDocStatusLocked()}
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
            <label className="block text-sm font-medium">Service</label>
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
            <>
              <div>
                <label className="block text-sm font-medium">Seasion</label>
                <select
                  name="purpose"
                  value={selectedSeasons}
                  onChange={handleChangeSeason}
                  disabled={isDocStatusLocked()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                >
                  <option>Select Seasion</option>
                  {season?.data?.map((item: any, index: Key) => (<option key={index}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Condition</label>
                <select
                  name="purpose"
                  value={selectedCondition}
                  onChange={handleChangeCondition}
                  disabled={isDocStatusLocked()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                >
                  <option>Select Condition</option>
                  {condition?.data?.map((item: any, index: Key) => (<option key={index}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Reason</label>
                <select
                  name="purpose"
                  value={selectedReason}
                  onChange={handleChangeReason}
                  disabled={isDocStatusLocked()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                >
                  <option>Select Reason</option>
                  {reason?.data?.map((item: any, index: Key) => (<option key={index}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">license plate</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                  placeholder="Enter detail"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Mezzo</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                  placeholder="Enter detail"
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
              disabled={isDocStatusLocked()}
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
              disabled={isDocStatusLocked()}
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
              disabled={isDocStatusLocked()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            />
          </div>


          <div>
            <label className="block text-sm font-medium">Select Transporter</label>
            <select
              name="name"
              value={selectedTransporter}
              onChange={handleTransporterSelect}
              disabled={isDocStatusLocked()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option value="">Select Transporter</option>
              {transporters.map((transporter, index) => (
                <option
                  key={transporter.name || index}
                  value={transporter.supplier || ''}
                >
                  {transporter.supplier || 'Unnamed Transporter'}
                </option>
              ))}
            </select>
          </div>

          {showTransporterFields && (
            <>
              <div>
                <label className="block text-sm font-medium">Supplier</label>
                <input
                  type="text"
                  value={transporterDetails?.supplier || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>
              <div>

                <label className="block text-sm font-medium">Cutoff Start Time</label>
                <input
                  type="text"
                  value={transporterDetails?.cutoff_start_time || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Cutoff End Time</label>
                <input
                  type="text"
                  value={transporterDetails?.cutoff_end_time || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Weekdays Off</label>
                <input
                  type="text"
                  value={transporterDetails?.cutoff_end_time || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
                />
              </div>


            </>
          )}

        </div>
        {service === "Peneus Hub" && (<div className=" mb-6">
          <table className="w-full text-sm border rounded-md border-gray-300">
            <thead>
              <tr className="border-b bg-gray-300 border-gray-300">
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
            onClick={() => !isDocStatusLocked() && setOpen(open === item.id ? null : item.id)}
            className={`w-full text-left px-2 py-2 border-x border-gray-300 ${isDocStatusLocked() ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {item.item_code || "Select item..."}
          </div>
          {open === item.id && !isDocStatusLocked() && (
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
          className="w-full p-2 border-x border-gray-300 "
        />
      </td>
      <td className=" ">
        <input
          type="date"
          value={DateOfRequredBy}
          onChange={handleDateOfRequredBy}
          className="w-full p-2 border-x border-gray-300"
          disabled={isDocStatusLocked()}
        />
      </td>
      <td className=" ">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => {
            const updatedItems = items.map((i) =>
              i.id === item.id ? { ...i, quantity: Number.parseInt(e.target.value, 10) } : i,
            );
            setItems(updatedItems);
          }}
          className="w-full p-2 border-x border-gray-300"
          disabled={isDocStatusLocked()}
        />
      </td>
      <td className="border-r border-gray-300">{item.available}</td>
      <td className="">
        <span
          onClick={() => !isDocStatusLocked() && removeRow(index)}
          className={`py-1 flex items-center justify-center text-black text-xl rounded-md ${isDocStatusLocked() ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <MdDelete />
        </span>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
        )}
        {service === "Tyre Hotel" && (<div className="mb-6">
          <ItemTable
            itemsData={tyreItems}
            updateItemData={updateTyreItems}
            onDataChange={handleDataChange}
       

          />
        </div>
        )}

        <div className="flex flex-row justify-between">
          {service === "Peneus Hub" && (<div className="flex flex-row gap-3">
            {!isDocStatusLocked() && (
              <button
                type="button"
                onClick={addRow}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Add Row
              </button>
            )}

          </div>
          )}

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
            {!isDocStatusLocked() && (
              <button
                type="submit"
                // onClick={handleRedirectToRedeliveryRequest}
                className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-800 transition-colors"
              >
                {isEditMode ? "Update" : "Save"}
              </button>
            )}

            {isEditMode && !isDocStatusLocked() && (
              <button
                className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors "
                onClick={handleFinalSubmit}>
                Submit
              </button>
            )}
          </div>
          {error && <p style={{ color: "red" }}>{error},<br>{dataSubmit?.message?.message}</br></p>}
        </div>
      </form>
    </div>
  )
}

export default RedeliveryForm






import { Key, useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

interface ItemData {
  id: number;
  item_code: string;
  data: Data[];
}

interface Data {
  name: string;
}

interface BrandData {
  data: {
    name: string;
  }[];
}

interface RowData {
  id: number;
  item_code: string;
  item_name: string;
  OtherItemCode: string;
  otherItemName: string;
  requiredBy: string;
  quantity: string;
  uom: string;
  uomConversion: string;
  type: string;
  selectedItem: string;
  Brand: string;
  Marks: string;
  SpeedRating: string;
  Carcass: string;
  Model: string;
  LoadIndex: string;
  AspectRatio: string;
  // Additional fields from the form
  tireWidth?: string;
  diameter?: string;
  weight?: string;
  expenseAccount?: string;
  wipCompositeAsset?: string;
  // Reference to the original API data item if available
  originalItemName?: string;
}

interface UpdateItemData {
  name: string;
  item_code: string;
  item_name: string;
  other_item_code?: string;
  other_item_name?: string;
  schedule_date: string;
  qty: number;
  type: string;
  uom: string;
  conversion_factor: number;
  stock_uom: string;
  // Additional fields specific to tire properties
  tire_widthmm?: string;
  tire_widthmm_others?: string;
  diameterinch?: string;
  diameterinch_others?: string;
  weight?: string;
  weight_others?: string;
  aspect_ratio?: string;
  aspect_ratio_others?: string;
  load_index?: string;
  load_index_others?: string;
  model?: string;
  model_others?: string;
  carcass?: string;
  carcass_others?: string;
  speed_rating?: string;
  speed_rating_others?: string;
  marks?: string;
  marks_others?: string;
  brand?: string;
  brandothers?: string;
}

interface TableComponentProps {
  itemsData: ItemData[];
  updateItemData?: UpdateItemData[];
  onDataChange?: (rows: RowData[]) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({ itemsData, updateItemData, onDataChange }) => {
  const [rows, setRows] = useState<RowData[]>([
    {
      id: 1,
      item_code: "", 
      requiredBy: "", 
      quantity: "", 
      uom: "Nos", 
      uomConversion: "1.00", 
      type: "", 
      selectedItem: "", 
      item_name: "",
      OtherItemCode: "",
      otherItemName: "",
      Brand: "",
      Marks: "",
      SpeedRating: "",
      Carcass: "",
      Model: "",
      LoadIndex: "",
      AspectRatio: "",
    },
  ]);
  
  const [formData, setFormData] = useState({
    item_code: "",
    item_name: "",
    OtherItemCode: "",
    otherItemName: "",
    requiredBy: "",
    type: "",
    tireWidth: "",
    diameter: "",
    weight: "",
    quantity: "",
    uom: "",
    expenseAccount: "",
    wipCompositeAsset: "",
    Brand: "",
    Marks: "",
    SpeedRating: "",
    Carcass: "",
    Model: "",
    LoadIndex: "",
    AspectRatio: "",
  });
  
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  
  // Initialize rows from updateItemData when it's available
  useEffect(() => {
    if (updateItemData && updateItemData.length > 0) {
      const mappedRows = updateItemData.map((item, idx) => {
        const isOthersItem = item.item_code === "Others";
        
        return {
          id: idx + 1,
          item_code: item.item_code,
          item_name: item.item_name,
          originalItemName: item.item_name,
          OtherItemCode: item.other_item_code || "",
          otherItemName: item.other_item_name || "",
          requiredBy: item.schedule_date || "",
          quantity: item.qty?.toString() || "",
          uom: item.uom || "Nos",
          uomConversion: item.conversion_factor?.toString() || "1.00",
          type: item.type || "",
          selectedItem: isOthersItem ? "Others" : item.item_code,
          Brand: isOthersItem ? (item.brandothers || "") : (item.brand || ""),
          Marks: isOthersItem ? (item.marks_others || "") : (item.marks || ""),
          SpeedRating: isOthersItem ? (item.speed_rating_others || "") : (item.speed_rating || ""),
          Carcass: isOthersItem ? (item.carcass_others || "") : (item.carcass || ""),
          Model: isOthersItem ? (item.model_others || "") : (item.model || ""),
          LoadIndex: isOthersItem ? (item.load_index_others || "") : (item.load_index || ""),
          AspectRatio: isOthersItem ? (item.aspect_ratio_others || "") : (item.aspect_ratio || ""),
          tireWidth: isOthersItem ? (item.tire_widthmm_others || "") : (item.tire_widthmm || ""),
          diameter: isOthersItem ? (item.diameterinch_others || "") : (item.diameterinch || ""),
          weight: isOthersItem ? (item.weight_others || "") : (item.weight || ""),
          expenseAccount: item.stock_uom || "",
          wipCompositeAsset: item.conversion_factor?.toString() || "",
        };
      });
      
      setRows(mappedRows);
    }
  }, [updateItemData]);

  // Send updated rows to parent component whenever rows change
  useEffect(() => {
    if (onDataChange) {
      onDataChange(rows);
    }
  }, [rows, onDataChange]);

  useEffect(() => {
    const fetchBrandData = async () => {
      setIsLoadingBrands(true);
      setError(null);
      try {
        const response = await fetch('/api/resource/brand');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setBrandData(data);
      } catch (err) {
        console.error("Failed to fetch brand data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch brands");
      } finally {
        setIsLoadingBrands(false);
      }
    };

    fetchBrandData();
  }, []);

  const addRow = () => {
    const newRows = [
      ...rows,
      {
        id: rows.length + 1,
        item_code: "", 
        requiredBy: "",
        quantity: "",
        uom: "Nos",
        uomConversion: "1.00",
        type: "",
        selectedItem: "",
        item_name: "",
        OtherItemCode: "",
        otherItemName: "",
        Brand: "",
        Marks: "",
        SpeedRating: "",
        Carcass: "",
        Model: "",
        LoadIndex: "",
        AspectRatio: "",
      },
    ];
    setRows(newRows);
  };

  const removeRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const handleItemSelect = (index: number, item: string) => {
    const updatedRows = rows.map((row, i) => {
      if (i === index) {
        return { 
          ...row, 
          item_code: item, 
          selectedItem: item,
          item_name: item 
        };
      }
      return row;
    });
    setRows(updatedRows);
    setShowDropdown(null);
  };

  const handleBrandSelect = (brandName: string) => {
    setFormData(prev => ({
      ...prev,
      Brand: brandName
    }));
    setShowBrandDropdown(false);
  };

  const openDialog = (index: number) => {
    setEditingRowIndex(index);
    
    // Populate the form with the current row data
    const rowData = rows[index];
    setFormData({
      item_code: rowData.item_code || "Others",
      item_name: rowData.item_name || "Others",
      otherItemName: rowData.otherItemName || "",
      OtherItemCode: rowData.OtherItemCode || "",
      requiredBy: rowData.requiredBy || "",
      type: rowData.type || "",
      Brand: rowData.Brand || "",
      Marks: rowData.Marks || "",
      Carcass: rowData.Carcass || "",
      Model: rowData.Model || "",
      AspectRatio: rowData.AspectRatio || "",
      LoadIndex: rowData.LoadIndex || "",
      SpeedRating: rowData.SpeedRating || "",
      tireWidth: rowData.tireWidth || "",
      diameter: rowData.diameter || "",
      weight: rowData.weight || "",
      quantity: rowData.quantity || "",
      uom: rowData.uom || "",
      expenseAccount: rowData.expenseAccount || "",
      wipCompositeAsset: rowData.wipCompositeAsset || ""
    });
    
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    if (editingRowIndex !== null) {
      // Update the row with the form data when closing dialog
      updateRowWithFormData();
    }
    setIsDialogOpen(false);
    setEditingRowIndex(null);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const updateRowWithFormData = () => {
    if (editingRowIndex !== null) {
      // Update the row with form data
      const updatedRows = rows.map((row, index) => {
        if (index === editingRowIndex) {
          return {
            ...row,
            item_code: formData.item_code,
            item_name: formData.item_name,
            otherItemName: formData.otherItemName,
            OtherItemCode: formData.OtherItemCode,
            requiredBy: formData.requiredBy,
            quantity: formData.quantity,
            type: formData.type,
            Brand: formData.Brand,
            Marks: formData.Marks,
            SpeedRating: formData.SpeedRating,
            Carcass: formData.Carcass,
            Model: formData.Model,
            LoadIndex: formData.LoadIndex,
            AspectRatio: formData.AspectRatio,
            // Keep the selectedItem value as "Others"
            selectedItem: "Others",
            // Store additional form fields
            tireWidth: formData.tireWidth,
            diameter: formData.diameter,
            weight: formData.weight,
            expenseAccount: formData.expenseAccount,
            wipCompositeAsset: formData.wipCompositeAsset
          };
        }
        return row;
      });
      
      setRows(updatedRows);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold mb-4">Item TH</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">No.</th>
            <th className="border border-gray-300 p-2">Item Code *</th>
            <th className="border border-gray-300 p-2">Required By *</th>
            <th className="border border-gray-300 p-2">Quantity *</th>
            <th className="border border-gray-300 p-2">Type *</th>
            <th className="border border-gray-300 p-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className="bg-white">
              <td className="border border-gray-300 p-2 text-center">{row.id}</td>
              <td className="border border-gray-300 p-2 relative">
                <input
                  type="text"
                  className="w-full border-gray-300"
                  value={row.item_code}
                  onFocus={() => setShowDropdown(index)}
                  onChange={(e) => handleInputChange(index, "item_code", e.target.value)}
                  placeholder="Item Code"
                />
                {showDropdown === index && (
                  <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 max-h-40 overflow-y-auto z-10">
                    {itemsData?.data?.map((item: { name: string }, i: Key) => (
                      <li
                        key={i}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleItemSelect(index, typeof item.name === "string" ? item.name : String(item.name ?? ""))}
                      >
                        {typeof item.name === "string" || typeof item.name === "number" || typeof item.name === "boolean" ? String(item.name) : "Invalid Name"}
                      </li>
                    ))}
                    <li
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleItemSelect(index, "Others")}
                    >
                      Others
                    </li>
                  </ul>
                )}
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="date"
                  className="w-full border-gray-300"
                  value={row.requiredBy}
                  onChange={(e) => handleInputChange(index, "requiredBy", e.target.value)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  className="w-full border-gray-300"
                  value={row.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  placeholder="Quantity"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <select
                  className="w-full border-gray-300"
                  value={row.type}
                  onChange={(e) => handleInputChange(index, "type", e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="With Rim">With Rim</option>
                  <option value="Without Rim">Without Rim</option>
                </select>
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {row.item_code === "Others" ? (
                  <button
                    type="button"
                    onClick={() => openDialog(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MdEdit />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MdDelete />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="mt-4 p-2 bg-gray-200 text-gray-600 rounded"
        onClick={addRow}
      >
        Add Row
      </button>
      
      {isDialogOpen && (
        <div className="fixed inset-0 py-12 flex items-center justify-center bg-gray-200 bg-opacity-90 z-50">
          <div className="bg-white h-full my-12 overflow-scroll rounded-lg shadow-lg w-full max-w-4xl">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Edit Item Details</h2>
              <button onClick={closeDialog} className="text-red-500">Close</button>
            </div>
            <div className="p-4">
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Code *</label>
                    <input
                      type="text"
                      name="item_code"
                      placeholder="Others"
                      value={formData.item_code}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Name *</label>
                    <input
                      type="text"
                      name="item_name"
                      placeholder="Others"
                      value={formData.item_name}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Other Item Code *</label>
                    <input
                      type="text"
                      name="OtherItemCode"
                      placeholder="Others"
                      value={formData.OtherItemCode}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Other Item Name *</label>
                    <input
                      type="text"
                      name="otherItemName"
                      placeholder="Others"
                      value={formData.otherItemName}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Required By *</label>
                    <input
                      type="date"
                      name="requiredBy"
                      value={formData.requiredBy}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="With Rim">With Rim</option>
                      <option value="Without Rim">Without Rim</option>
                    </select>
                  </div>
                </div>
                <hr className="text-gray-300 my-4"></hr>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Aspect Ratio (Others) *</label>
                    <input
                      type="text"
                      name="AspectRatio"
                      value={formData.AspectRatio}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Load Index (Others) *</label>
                    <input
                      type="text"
                      name="LoadIndex"
                      value={formData.LoadIndex}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model (Others) *</label>
                    <input
                      type="text"
                      name="Model"
                      value={formData.Model}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Carcass (Others) *</label>
                    <input
                      type="text"
                      name="Carcass"
                      value={formData.Carcass}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Speed Rating (Others) *</label>
                    <input
                      type="text"
                      name="SpeedRating"
                      value={formData.SpeedRating}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marks (Others)*</label>
                    <input
                      type="text"
                      name="Marks"
                      value={formData.Marks}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">Brand(Others) *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="Brand"
                        value={formData.Brand}
                        onChange={handleFormInputChange}
                        onFocus={() => setShowBrandDropdown(true)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder={isLoadingBrands ? "Loading brands..." : "Select or type brand"}
                      />
                      {showBrandDropdown && brandData && (
                        <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 max-h-40 overflow-y-auto z-10 rounded-md shadow-lg">
                          {isLoadingBrands ? (
                            <li className="p-2 text-gray-500">Loading brands...</li>
                          ) : error ? (
                            <li className="p-2 text-red-500">Error: {error}</li>
                          ) : (
                            brandData.data.map((brand, i) => (
                              <li
                                key={i}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleBrandSelect(brand.name)}
                              >
                                {brand.name}
                              </li>
                            ))
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tire Width(mm) *</label>
                    <input
                      type="text"
                      name="tireWidth"
                      value={formData.tireWidth}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Diameter(Inch) *</label>
                    <input
                      type="text"
                      name="diameter"
                      value={formData.diameter}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (others) *</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">UOM *</label>
                    <input
                      type="text"
                      name="uom"
                      value={formData.uom}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock UOM</label>
                    <input
                      type="text"
                      name="expenseAccount"
                      value={formData.expenseAccount}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Conversion Factor</label>
                    <input
                      type="text"
                      name="wipCompositeAsset"
                      value={formData.wipCompositeAsset}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;