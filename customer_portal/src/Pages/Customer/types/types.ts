export interface Contact {
    firstName: string
    emailId: string
    phone: string
  }
  
  export interface Address {
    addressTitle: string
    addressLine1: string
    city: string
    country: string
    cap: string // Added CAP field
    stateRegion: string // Added State/Region field
    isPrimaryAddress: boolean
  }
  
  export interface Item {
    itemName: string
    itemCode: string
    requiredQty: string
    availableQty: string
  }
  
  export interface Supplier {
    name: string
  }
  export interface CustomerGroupResponse {
    message: { name: string }[]
  }
  
  export interface FormData {
    uniqueEmail: string
    uniquePhone: string
    customerName: string
    customerGroup: string
    transporter: string
    fiscalCode: string // Added Fiscal Code field
    vatCode: string // Added VAT Code field
    pec: string // Added PEC field
    destinationCode: string // Added Destination Code field
    contact: Contact
    address: Address
    purpose: string
    requestedBy: string
    dateOfPosting: string
    dateOfDelivery: string
    items: Item[]
  }


  export interface ValidationErrors {
    customerName?: string
    transporter?: string
    "contact.uniqueEmail"?: string
    "contact.uniquePhone"?: string
    "contact.firstName"?: string
    "contact.emailId"?: string
    "contact.phone"?: string
    "address.addressLine1"?: string
    "address.city"?: string
    "address.country"?: string
    "address.cap"?: string // Added validation for CAP
    "address.stateRegion"?: string // Added validation for State/Region
    fiscalCode?: string // Added validation for Fiscal Code
    vatCode?: string // Added validation for VAT Code
    pec?: string // Added validation for PEC
    destinationCode?: string // Added validation for Destination Code
    [key: string]: string | undefined
  }