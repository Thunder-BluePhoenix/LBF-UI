/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import TableComponent from "./components/ItemsTableForTH"
import { CustomerSection } from "./components/customer-section"
import { ContactSection } from "./components/contact-section"
import { AddressTransporterSection } from "./components/address-transporter-section"
import { ServiceSection } from "./components/service-section"
import { PurposeDateSection } from "./components/purpose-date-section"
import type {
  ItemList,
  FetchedItem,
  Address,
  Contact,
  CustomerLoginUser,
  Transporter,
  RowData,
} from "./types/redelivery-form"
import MaterialRequestHeader from "./components/topbarOfForm"
import ItemTable from "./components/itemsTableForPH"
import { useDataContext } from "../../Context/DataProvider"
import ModalMaterialListForTH from "./components/modalMaterialListForTH"

interface dataSubmit {
  message?: {
    message: string
    docstatus: number
  }
}
const RedeliveryForm = () => {
  //customer state
  const [customers, setCustomers] = useState<[]>([])
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
  const [docStatus, setDocStatus] = useState<number | null>(null)
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
  const [LicensePlate, setLicensePlate] = useState<string>("")
  const { selectedItemId, licensePlateFilter } = useDataContext()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const purposeParam = searchParams.get("purpose")
  const serviceParam = searchParams.get("service")

  const isModalMaterialListForTh = searchParams.get("modal-material-list-for-th") === "true"

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
    if (!serviceParam) {
      setService("")
    } else {
      setService(serviceParam)
    }
    setShowContactFields(false)
    setDateOfPosting(new Date().toISOString().split("T")[0])
    setDateOfDelivery("")
    setDateOfRequredBy("")
    if (!purposeParam) {
      setPurpose("")
    } else {
      setPurpose(purposeParam)
    }
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
    } else {
      setIsEditMode(false)
      resetFormFields()
    }
    
  }, [id, purposeParam, serviceParam])
  const navigate = useNavigate()
  const groupBy = customerLoginUser?.customer_group ?? "Default Group"
  const LoginCustomerName = customerLoginUser?.customer_name
  console.log(loginUser, licensePlateFilter, selectedItemId, "login user")
  useEffect(() => {
    if (transporters && transporters.length > 0) {
      const defaultTransporter = transporters.find((item) => item.is_default === 1)
      if (defaultTransporter) {
        setSelectedTransporter(defaultTransporter.supplier)
        setTransporterDetails(defaultTransporter)
        setShowTransporterFields(true)
      }
    }
  }, [transporters])
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
    setItems(rows as unknown as ItemList[]) // Use type assertion to bypass the type error
  }
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
    
    setSelectedContact(selectedValue); // Update selected contact
    
    // No need to update phone/email here, let useEffect handle it
  };
  
  useEffect(() => {
    if (selectedContact) {
      const selectedContactData = contacts.find((c) => c.name === selectedContact);
      
      if (selectedContactData) {
        setContact(selectedContactData.phone || "");
        setEmail(selectedContactData.email_id || "");
      } else {
        setContact("");
        setEmail("");
      }
    } else {
      setContact("");
      setEmail("");
    }
    
    setShowContactFields(!!selectedContact); // Ensure it's a boolean
  }, [selectedContact]);
  

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfPosting(e.target.value)
  }
  const handleMezzoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMezzo(e.target.value)
  }
  const handleLicensePlateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLicensePlate(value) // Save to localStorage
  }
  useEffect(() => {
    // Set the license plate to the context filter value when it changes
    if (licensePlateFilter) {
      setLicensePlate(licensePlateFilter);
    }
  }, [licensePlateFilter]);

  useEffect(() => {}, [])
  
  const handleDateOfRequredBy = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfRequredBy(e.target.value)
  }

  const handleDateOfDelivery = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfDelivery(e.target.value)
  }

  const handleAddressSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setSelectedAddress(selectedValue)
  }

  useEffect(() => {
    if (!selectedAddress) {
      setShowAddressFields(false);
      setAddressDetails(null);
      setTransporters([]);
      setShowTransporterFields(false);
      return;
    }
  
    setShowAddressFields(true);
    
    const selectedAddressData = addresses.find((a) => a.name === selectedAddress);
    setAddressDetails(selectedAddressData || null);
  
    const fetchTransporters = async () => {
      try {
        const transporterResponse = await axios.get(`/api/resource/Address/${encodeURIComponent(selectedAddress)}`);
        const transporterData = transporterResponse?.data?.data.custom_transporters || [];
  
        setTransporters(transporterData);
        setTransportersLoaded(true);
  
        if (transporterData.length === 0) {
          setShowTransporterFields(false);
          setTransporterDetails(null);
          if (!isEditMode) setSelectedTransporter("");
          return;
        }
  
        if (isEditMode && selectedTransporter) {
          const matchedTransporter = transporterData.find((t: { supplier: string }) => t.supplier === selectedTransporter);
          
          if (matchedTransporter) {
            setTransporterDetails(matchedTransporter);
            setShowTransporterFields(true);
          } else {
            setTransporterDetails(null);
            setShowTransporterFields(false);
          }
        }
      } catch (error) {
        console.error("Error fetching transporter data:", error);
        setTransporters([]);
        setTransportersLoaded(false);
        setShowTransporterFields(false);
      }
    };
  
    fetchTransporters();
  }, [selectedAddress, isEditMode, selectedTransporter, addresses]);
  
  const handleTransporterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setSelectedTransporter(selectedValue)

    if (selectedValue && transporters.length > 0) {
      const matchedTransporter = transporters.find((t) => t.supplier === selectedValue)
      if (matchedTransporter) {
        setTransporterDetails(matchedTransporter)
        setShowTransporterFields(true)
      } else {
        setTransporterDetails(null)
        setShowTransporterFields(false)
      }
    } else {
      setTransporterDetails(null)
      setShowTransporterFields(false)
    }
  }

  useEffect(() => {
    if (isEditMode && transportersLoaded && selectedTransporter && transporters.length > 0) {
      const matchedTransporter = transporters.find((t) => t.supplier === selectedTransporter)
      if (matchedTransporter) {
        setTransporterDetails(matchedTransporter)
        setShowTransporterFields(true)
      } else {
        setShowTransporterFields(false)
      }
    }
  }, [isEditMode, transportersLoaded, selectedTransporter, transporters])

  useEffect(() => {
    if (isEditMode && selectedAddress && addresses.length > 0) {
      const matchingAddress = addresses.find((addr) => addr.name === selectedAddress)
      if (matchingAddress) {
        setAddressDetails(matchingAddress)
        setShowAddressFields(true)
      }
    }
  }, [addresses, selectedAddress, isEditMode])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Step 1: Fetch the logged-in user's email
        const userResponse = await axios.get("/api/method/frappe.auth.get_logged_user")
        const loginUserEmail = userResponse.data.message
        setLoginUser(loginUserEmail)
        // Step 2: Fetch the customer data based on the logged-in user's email
        const customerResponse = await axios.get(
          `/api/resource/Customer?fields=["*"]&filters=[["Portal User","user", "=", "${encodeURIComponent(loginUserEmail)}"]]`,
        )
        if (customerResponse.data.data && customerResponse.data.data.length > 0) {
          const customerData = customerResponse.data.data[0]
          setCustomerLoginUser(customerData)
          // Step 3: Fetch child customers associated with this customer
          const childCustomersResponse = await axios.get(
            `/api/method/lbf_logistica.api.bol.fetch_child_customers?customer=${encodeURIComponent(customerData.name)}`,
          )
          const data = childCustomersResponse.data
          if (data.message && Array.isArray(data.message)) {
            // Process customers to identify the display name for each
            const processedCustomers = data.message.map(
              (customer: { custom_details_for_parent_customer: any[]; customer_name: any }) => {
                // Find if there's an entry in custom_details_for_parent_customer where parent_customer matches the login user's customer name
                const matchingChildDetail = customer.custom_details_for_parent_customer.find(
                  (detail) =>
                    detail.parent_customer === customerData.name ||
                    detail.parent_customer === customerData.customer_name,
                )
                if (matchingChildDetail) {
                  return {
                    ...customer,
                    displayName: matchingChildDetail.child_customer_name,
                  }
                }
                // Otherwise use the regular customer_name
                return {
                  ...customer,
                  displayName: customer.customer_name,
                }
              },
            )
            setCustomers(processedCustomers)

            if (processedCustomers.length > 0) {
              const firstCustomer = processedCustomers[0].name
              setSelectedCustomer(firstCustomer)
              setCustomerName(firstCustomer)
              await fetchAddress(firstCustomer)
              await fetchContactEmail(firstCustomer)
            }
          } else {
            setCustomers([])
            console.warn("No child customers found or invalid data format")
          }
          // Step 5: Fetch unique items based on the customer
          const itemsResponse = await axios.get(
            `/api/method/lbf_logistica.api.bol.get_unique_items?customer=${encodeURIComponent(customerData.name)}&fields=["item_code","item_name","actual_qty"]`,
          )
          setItemList(itemsResponse.data.message || [])

          // Step 6: Check if it's in edit mode, fetch existing data if `id` is available
          if (id) {
            setIsEditMode(true)
            await fetchExistingData(id)
          }
        } else {
          console.warn("No customer data found for user:", loginUserEmail)
          setCustomers([])
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
    const fetchRedeliveryItems = async () => {
      if (
        purpose === "Redelivery" &&
        typeof customerLoginUser === "object" &&
        customerLoginUser !== null &&
        "name" in customerLoginUser &&
        typeof customerLoginUser.name === "string"
      ) {
        try {
          const itemsForRedelivery = await axios.get(
            `/api/method/lbf_logistica.api.bol.get_unique_tyre_hotel_items?customer=${encodeURIComponent(customerLoginUser.name)}&license_plate=${encodeURIComponent(LicensePlate)}&fields=["item_code","item_name","actual_qty","custom_tyre_type","custom_license_plate"]`,
          )
          console.log(itemsForRedelivery.data, "itemsforredelivery")
          setItemsRedelivery(itemsForRedelivery.data)
        } catch (error: any) {
          console.error("Error fetching items for redelivery:", error.message || error)
        }
      }
    }

    fetchRedeliveryItems()
  }, [purpose, LicensePlate, customerLoginUser])

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setDateOfPosting(today)
  }, [])

  const fetchAddress = async (customerName: string) => {
    try {
      const response = await axios.get(
        `/api/resource/Address?fields=["name","address_title","city","country","address_type","address_line1"]&filters=[["Dynamic Link", "link_name", "=", "${encodeURIComponent(customerName)}"]]`,
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
        `/api/method/lbf_logistica.api.bol.get_customer_contacts?customer_name=${encodeURIComponent(customerName)}`,
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

      // Fetch address and contact data
      await fetchAddress(data.shipping_to)
      await fetchContactEmail(data.shipping_to)

      // Set address data
      if (data.shipping_address_name) {
        setSelectedAddress(data.shipping_address_name)

        try {
          const addressResponse = await axios.get(
            `/api/resource/Address/${encodeURIComponent(data.shipping_address_name)}`,
          )

          const addressData = addressResponse?.data?.data
          if (addressData) {
            setAddressDetails({
              name: addressData.name,
              address_title: addressData.address_title,
              address_type: addressData.address_type,
              address_line1: addressData.address_line1,
              city: addressData.city,
              country: addressData.country,
            })
            setShowAddressFields(true)

            // Handle transporters
            const transporterData = addressData.custom_transporters || []
            setTransporters(transporterData)
            setTransportersLoaded(true)

            if (data.transporter_name) {
              setSelectedTransporter(data.transporter_name)
              const matchedTransporter = transporterData.find(
                (t: { supplier: any }) => t.supplier === data.transporter_name,
              )
              if (matchedTransporter) {
                setTransporterDetails({
                  supplier: data.transporter_name,
                  cutoff_start_time: matchedTransporter.cutoff_start_time,
                  cutoff_end_time: matchedTransporter.cutoff_end_time,
                  name: matchedTransporter.name,
                  address: matchedTransporter.address,
                })
                setShowTransporterFields(true)
              }
            }
          }
        } catch (error) {
          console.error("Error fetching address details:", error)
        }
      }

      // Set contact data
      if (data.customer_contact) {
        setSelectedContact(data.customer_contact)
        // Find the matching contact in contacts array
        const contactData = contacts.find((c) => c.name === data.customer_contact)
        if (contactData) {
          setContact(contactData.phone || data.contact || "")
        } else {
          // Fallback to the data from the API response
          setContact(data.contact || "")
        }
        setShowContactFields(true)
      }

      // Set items data
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

  useEffect(() => {
    const autofetchDataTHform = async () => {
      try {
        const response = await axios.get(
          `/api/method/lbf_logistica.api.bol.fetch_bol_for_redelivery_mri?material_request_doc=${selectedItemId}`
        )
        const data = response.data.message
        console.log(data, "auto fetch data for tyre hotel")
        setSelectedCustomer(data.shipping_to)
        setCustomerName(data.shipping_to)
        setSelectedReason(data.reason || "")
        setSelectedCondition(data.condition || "")
        setSelectSeason(data.season || "")
        
        setMezzo(data.mezzo || "")
  
        // Handle customer data first to ensure dependent data is available
        if (data.shipping_to) {
          const customerName = data.shipping_to 
          
          // Fetch contacts and addresses for this customer
          await Promise.all([
            fetchContactEmail(customerName),
            fetchAddress(customerName)
          ])
          
          // Handle contact information
          const contactPersonName = data.contact_person
          const addressNames = data.customer_shipping_address
          
            setSelectedContact(contactPersonName)
            // This will trigger the side effects in handleContactSelect
            setSelectedAddress(addressNames)
  
          // Handle address information
          const addressName = data.customer_shipping_address
          if (addressName) {
            
            
            try {
              const addressResponse = await axios.get(`/api/resource/Address/${encodeURIComponent(addressName)}`)
              const addressData = addressResponse?.data?.data
              console.log(addressData,"andiii")
              setSelectedAddress(addressData.name)
              if (addressData) {
                // Set address details directly
                setAddressDetails({
                  name: addressData.name,
                  address_title: addressData.address_title,
                  address_type: addressData.address_type,
                  address_line1: addressData.address_line1,
                  city: addressData.city,
                  country: addressData.country,
                })
                setShowAddressFields(true)
  
                // Process transporters data
                const transporterData = addressData.custom_transporters || []
                setTransporters(transporterData)
                setTransportersLoaded(true)
  
                // Set transporter if available
                const transporterName = data.transporter_name || ""
                if (transporterName && transporterData.length > 0) {
                  setSelectedTransporter(transporterName)
                  const matchedTransporter = transporterData.find(
                    (t: { supplier: string }) => t.supplier === transporterName
                  )
                  if (matchedTransporter) {
                    setTransporterDetails({
                      supplier: transporterName,
                      cutoff_start_time: matchedTransporter.cutoff_start_time,
                      cutoff_end_time: matchedTransporter.cutoff_end_time,
                      name: matchedTransporter.name,
                      address: matchedTransporter.address,
                    })
                    setShowTransporterFields(true)
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching address details:", error)
            }
          }
        }
  
        // Handle item details
        if (data.item_details_th && Array.isArray(data.item_details_th)) {
          const itemDetailsTH = data.item_details_th.map((item: any) => ({
            item_code: item.item_code,
            item_name: item.item_name,
            type: item.tyre_type,
            qty: item.accepted_qty,
            id: item.name,
          }))
  
          setUpdateTyreItems(itemDetailsTH)
        } else {
          setUpdateTyreItems([])
        }
      } catch (err: any) {
        console.error("Error in autofetchDataTHform:", err)
        setError(err.message || "Error fetching existing data")
      }
    }
  
    // Only run the fetch if selectedItemId is provided
    if (selectedItemId) {
      autofetchDataTHform()
    }
  }, [selectedItemId])

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
      OtherItemCode: "",
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
      try {
        // Using Promise.all to fetch all the APIs concurrently
        const [reasonRes, seasonRes, conditionRes, itemRes] = await Promise.all([
          fetch("/api/resource/Reason"),
          fetch("/api/resource/Season"),
          fetch("/api/resource/Condition"),
          fetch("/api/resource/Item"),
        ])

        // Parsing the response to JSON
        const reason = await reasonRes.json()
        const season = await seasonRes.json()
        const condition = await conditionRes.json()
        const item = await itemRes.json()

        setReason(reason)
        setSeason(season)
        setCondition(condition)
        setTyreItems(item)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Error fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [purpose])
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
      material_request_doc: selectedItemId,
      service: service,
      transaction_date: dateOfPosting,
      schedule_date: DateOfDelivery,
      material_request_type: purpose,
      party_type: groupBy,
      season: selectedSeasons,
      condition: selectedCondition,
      reason: selectedReason,
      license_plate: LicensePlate,
      mezzo: mezzo,
      customer: customerLoginUser?.customer_name,
      customer_contact: selectedContact,
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
        qty: item.quantity,
        stock_uom: "Nos",
        uom: "Nos",
        conversion_factor: 1.0,
        description: "",
        other_item_code: item.OthersItemCode,
        other_item_name: item.OthersItemName,
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
        result = await axios.put(
          `/api/method/lbf_logistica.api.bol.save_material_request_instruction_log/${resultData}?fields=["*"]`,
          myData,
          { headers },
        )
      } else {
        result = await axios.post("/api/method/lbf_logistica.api.bol.save_material_request_instruction_log",
           myData, {
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
    e.preventDefault()
    const csrfToken = "your-csrf-token"
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-Frappe-CSRF-Token": csrfToken } : {}),
    }

    const siubmitData = {
      name: resultData,
    }

    try {
      const submitResult = await fetch("/api/method/lbf_logistica.api.bol.submit_material_request", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(siubmitData),
      })
      const resultSubmitJson = await submitResult.json()
      setDataSubmit(resultSubmitJson)
      if (resultSubmitJson.message?.docstatus !== undefined) {
        setDocStatus(resultSubmitJson.message.docstatus)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }
  const isDocStatusLocked: () => boolean = () => {
    return docStatus === 1
  }
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  return (
    <div className="max-w-7xl border border-gray-300 my-8 mx-auto bg-white p-6 shadow-md rounded">
      <p className="mb-4 text-red-500">{dataSubmit?.message?.message}</p>
      <MaterialRequestHeader navigate={navigate} isEditMode={isEditMode} isDocStatusLocked={isDocStatusLocked} />
      <form onSubmit={handleSubmit}>
        <CustomerSection
          selectedCustomer={selectedCustomer}
          customerName={customerName}
          loginCustomerName={LoginCustomerName}
          groupBy={groupBy}
          customers={customers}
          isDocStatusLocked={isDocStatusLocked}
          onCustomerSelect={handleCustomerSelect}
        />
        <ContactSection
          selectedContact={selectedContact}
          contact={contact}
          email={email}
          contacts={contacts}
          showContactFields={showContactFields}
          isDocStatusLocked={isDocStatusLocked}
          onContactSelect={handleContactSelect}
        />
        <AddressTransporterSection
          selectedAddress={selectedAddress}
          addresses={addresses}
          showAddressFields={showAddressFields}
          addressDetails={addressDetails}
          selectedTransporter={selectedTransporter}
          transporters={transporters}
          showTransporterFields={showTransporterFields}
          transporterDetails={transporterDetails}
          isDocStatusLocked={isDocStatusLocked}
          onAddressSelect={handleAddressSelect}
          onTransporterSelect={handleTransporterSelect}
        />
        <ServiceSection
          service={service}
          selectedSeasons={selectedSeasons}
          selectedCondition={selectedCondition}
          selectedReason={selectedReason}
          licensePlate={LicensePlate}
          mezzo={mezzo}
          season={season}
          condition={condition}
          reason={reason}
          isDocStatusLocked={isDocStatusLocked}
          onServiceChange={handleChangeService}
          onSeasonChange={handleChangeSeason}
          onConditionChange={handleChangeCondition}
          onReasonChange={handleChangeReason}
          onLicensePlateChange={handleLicensePlateChange}
          onMezzoChange={handleMezzoChange}
        />

        <PurposeDateSection
          purpose={purpose}
          dateOfPosting={dateOfPosting}
          dateOfDelivery={DateOfDelivery}
          service={service}
          isDocStatusLocked={isDocStatusLocked}
          onPurposeChange={handleChange}
          onDateOfPostingChange={handleDateChange}
          onDateOfDeliveryChange={handleDateOfDelivery}
        />

        {service === "Pneus Hub" && (
          <ItemTable
            items={items}
            itemList={itemList}
            open={open}
            setOpen={setOpen}
            DateOfRequredBy={DateOfRequredBy}
            handleDateOfRequredBy={handleDateOfRequredBy}
            isDocStatusLocked={isDocStatusLocked}
            handleItemSelect={handleItemSelect}
            setItems={setItems}
            removeRow={removeRow}
          />
        )}
        {service === "Tyre Hotel" && (
          <div className="mb-6">
            <TableComponent
              itemsData={tyreItems}
              updateItemData={updateTyreItems}
              onDataChange={handleDataChange}
              itemsRedelivery={itemsRedelivery}
              purpose={purpose}
              abledHandle={isDocStatusLocked}
            />
          </div>
        )}

        <div className="flex flex-row justify-between">
          {service === "Pneus Hub" && (
            <div className="flex flex-row gap-3">
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
                onClick={handleFinalSubmit}
              >
                Submit
              </button>
            )}
          </div>
          {error && (
            <p style={{ color: "red" }}>
              {error},<br>{dataSubmit?.message?.message}</br>
            </p>
          )}
        </div>
      </form>
      {isModalMaterialListForTh && <ModalMaterialListForTH />}
    </div>
  )
}

export default RedeliveryForm

