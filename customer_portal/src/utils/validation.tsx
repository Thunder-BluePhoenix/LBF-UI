// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateForm = (formData: any, setValidationErrors: (errors: string[]) => void) => {
    const errors: string[] = []
  
    if (!formData.customerName) {
      errors.push("Customer Name is required.")
    }
  
    if (!formData.selectedContact) {
      errors.push("Contact selection is required.")
    }
  
    if (!formData.dateOfDelivery) {
      errors.push("Date of Delivery is required.")
    }
  
    if (!formData.selectedAddress) {
      errors.push("Address selection is required.")
    }
  
    if (!formData.selectedTransporter) {
      errors.push("Transporter selection is required.")
    }
  
    if (!formData.purpose) {
      errors.push("Purpose is required.")
    }
  
    setValidationErrors(errors)
    return errors.length === 0
  }
  
  