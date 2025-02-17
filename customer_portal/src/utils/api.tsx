import axios from "axios"

export const fetchCustomerData = async () => {
  try {
    const userResponse = await axios.get("/api/method/frappe.auth.get_logged_user")
    const loginUserEmail = userResponse.data.message

    const customerResponse = await axios.get(
      `/api/resource/Customer?fields=["*"]&filters=[["Portal User","user", "=", "${encodeURIComponent(loginUserEmail)}"]]`,
    )
    const customerData = customerResponse.data.data[0]

    const transporterResponse = await axios.get(`/api/resource/Customer/${encodeURIComponent(customerData?.name)}`)
    const transporterData = transporterResponse?.data?.data?.custom_suppliers || []

    const childCustomersResponse = await axios.get(
      `/api/method/lbf_logistica.api.bol.get_customers_with_parent?customer_name=${encodeURIComponent(customerData.name)}`,
    )
    const customers = childCustomersResponse.data.data

    const itemsResponse = await axios.get(
      `/api/method/lbf_logistica.api.bol.get_unique_items?customer=${encodeURIComponent(customerData.name)}&fields=["item_code","item_name","actual_qty"]`,
    )
    const itemList = itemsResponse.data.message || []

    return {
      customerLoginUser: customerData,
      transporters: transporterData,
      customers,
      itemList,
    }
  } catch (error) {
    console.error("Error fetching customer data:", error)
    throw error
  }
}

export const fetchExistingData = async (id: string) => {
  try {
    const response = await axios.get(`/api/resource/Material%20Request%20Instruction%20Log/${id}?fields=["*"]`)
    const data = response.data.data

    return {
      name: data.name,
      customerName: data.customer,
      dateOfPosting: data.transaction_date,
      dateOfDelivery: data.schedule_date,
      dateOfRequiredBy: data.items[0]?.schedule_date || "",
      purpose: data.material_request_type,
      selectedAddress: data.shipping_address_name,
      selectedContact: data.contact_person,
      contact: data.contact,
      email: data.contact_email,
      selectedTransporter: data.transporter_name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: data.items.map((item: any, index: number) => ({
        id: index + 1,
        item_code: item.item_code,
        item_name: item.item_name,
        quantity: item.qty,
        requiredBy: item.schedule_date,
        targetWarehouse: item.warehouse,
        uom: item.uom,
        name: item.name,
        available: item.custom_max_order_qty,
      })),
      docStatus: data.docstatus,
    }
  } catch (error) {
    console.error("Error fetching existing data:", error)
    throw error
  }
}

