/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"

export const handleSubmit = async (
  formData: any,
  isEditMode: boolean,
  id: string | undefined,
  navigate: (path: string) => void,
  setError: (error: string) => void,
) => {
  const csrfToken = "your-csrf-token"
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(csrfToken ? { "X-Frappe-CSRF-Token": csrfToken } : {}),
  }

  const myData = {
    name: formData.name,
    service: "Peneus Hub",
    transaction_date: formData.dateOfPosting,
    schedule_date: formData.dateOfDelivery,
    material_request_type: formData.purpose,
    party_type: formData.customerLoginUser?.customer_group,
    customer: formData.customerName,
    customer_contact: formData.selectedContact,
    shipping_to: formData.customerLoginUser?.customer_name,
    shipping_address_name: formData.selectedAddress,
    contact_person: formData.selectedContact,
    contact: formData.contact,
    contact_email: formData.email,
    transporter_name: formData.transporterDetails?.supplier,
    items: formData.items.map((item: any) => ({
      item_code: item.item_code,
      item_name: item.item_name,
      schedule_date: formData.dateOfRequiredBy,
      qty: item.quantity,
      stock_uom: "Nos",
      uom: "Nos",
      conversion_factor: 1.0,
      description: "",
    })),
  }

  try {
    let result
    if (isEditMode && id) {
      result = await axios.put(
        `/api/method/lbf_logistica.api.bol.save_material_request_instruction_log/${id}?fields=["*"]`,
        myData,
        { headers },
      )
    } else {
      result = await axios.post("/api/method/lbf_logistica.api.bol.save_material_request_instruction_log", myData, {
        headers,
      })
    }

    alert(isEditMode ? "Material Request updated successfully!" : "Material Request created successfully!")
    const resultId = isEditMode ? id : result.data.message.name
    navigate(`/customer_portal/material-request-form/${resultId}`)
  } catch (err: any) {
    setError(err.message || "Error submitting material request")
  }
}

export const handleFinalSubmit = async (
  resultData: string,
  setDocStatus: (status: number) => void,
  setError: (error: string) => void,
) => {
  const csrfToken = "your-csrf-token"
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(csrfToken ? { "X-Frappe-CSRF-Token": csrfToken } : {}),
  }

  const submitData = {
    name: resultData,
  }

  try {
    const submitResult = await fetch("/api/method/lbf_logistica.api.bol.submit_material_request", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(submitData),
    })
    const resultSubmitJson = await submitResult.json()
    if (resultSubmitJson.message?.docstatus !== undefined) {
      setDocStatus(resultSubmitJson.message.docstatus)
    }
    alert("Material Request submitted successfully!")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    setError(error.message || "Error submitting form")
  }
}

