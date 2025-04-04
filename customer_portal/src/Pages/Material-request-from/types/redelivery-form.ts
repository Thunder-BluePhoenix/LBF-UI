import type { ReactNode } from "react"

export interface ItemList {
  id: number
  item_code: string
  item_name: string
  requiredBy: string
  quantity: number
  targetWarehouse: string
  uom: string
  name: string
  available?: ReactNode
  OthersItemCode?: string
  OthersItemName?: string
  AspectRatio?: string
  Brand?: string
  Carcass?: string
  diameter?: string
  LoadIndex?: string
  Marks?: string
  Model?: string
  SpeedRating?: string
  tireWidth?: string
  weight?: string
  type?: string
  otherItemName?: string
  OtherItemCode?: string
}

export interface FetchedItem {
  schedule_date: string
  item_code: string
  item_name: string
  items_quantity: number
  label: string
  value: string
  actual_qty: number
}

export interface Address {
  name: string
  address_title: string
  address_line1: string
  city: string
  country: string
  address_type?: string
}

export interface CustomerLoginUser {
  name: string | boolean | CustomerLoginUser | null
  customer_name: string
  customer_group: string
}

export interface Contact {
  name: string
  phone: string
  email_id: string
}

export interface Transporter {
  supplier: string
  cutoff_start_time: string
  cutoff_end_time: string
  name: string
  address: string
  is_default?: number
}

export interface DataSubmit {
  message?: {
    message: string
    docstatus: number
  }
}

export interface RowData {
  id: number
  item_code: string
  item_name: string
  requiredBy: string
  quantity: string
  uom: string
  uomConversion: string
  type: string
  selectedItem: string
}

export interface FormData {
  name: string
  service: string
  transaction_date: string
  schedule_date: string
  material_request_type: string
  party_type: string
  season: string
  condition: string
  reason: string
  license_plate: string
  mezzo: string
  customer: string | undefined
  customer_contact: string
  shipping_to: string
  shipping_address_name: string
  contact_person: string
  contact: string
  email: string
  transporter_name: string | undefined
  items: Array<{
    item_code: string
    item_name: string
    schedule_date: string
    qty: number
    stock_uom: string
    uom: string
    conversion_factor: number
    description: string
    other_item_code?: string
    other_item_name?: string
    aspect_ratio_others?: string
    brandothers?: string
    carcass_others?: string
    diameterinch_others?: string
    load_index_others?: string
    marks_others?: string
    model_others?: string
    speed_rating_others?: string
    tire_widthmm_others?: string
    weight_others?: string
    type?: string
  }>
}

export interface Item {
  id: number;
  item_code: string;
  item_name: string;
  quantity: number;
  available: number;
}

export interface ItemCode {
  value: number;
  item_code: string;
}

export interface ItemData {
  type: string | undefined;
  name?: string;
  item_code?: string;
  item_name?: string;
  custom_tyre_type?: string;
  actual_qty?: number;
}

export interface ItemsApiResponse {
  data?: ItemData[];
  message?: ItemData[];
}

// Row data for the table
export interface RowData {
  id: number;
  item_code: string;
  item_name: string;
  OthersItemCode: string;
  OthersItemName: string;
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

// Data structure from API for updating items
export interface UpdateItemData {
  other_item_code: string;
  other_item_name: string;
  marks_others: string;
  speed_rating_others: string;
  carcass_others: string;
  model_others: string;
  load_index_others: string;
  aspect_ratio_others: string;
  tire_widthmm_others: string;
  diameterinch_others: string;
  weight_others: string;
  brandothers: string;
  name: string;
  item_code: string;
  item_name: string;
  Others_item_code?: string;
  Others_item_name?: string;
  schedule_date: string;
  qty: number;
  type: string;
  uom: string;
  conversion_factor: number;
  stock_uom: string;
  // Additional fields specific to tire properties
  tire_widthmm?: string;
  tire_widthmm_Others?: string;
  diameterinch?: string;
  diameterinch_Others?: string;
  weight?: string;
  weight_Others?: string;
  aspect_ratio?: string;
  aspect_ratio_Others?: string;
  load_index?: string;
  load_index_Others?: string;
  model?: string;
  model_Others?: string;
  carcass?: string;
  carcass_Others?: string;
  speed_rating?: string;
  speed_rating_Others?: string;
  marks?: string;
  marks_Others?: string;
  brand?: string;
  brandOthers?: string;
}

// Props for the table component
export interface TableComponentProps {
  itemsData?: ItemsApiResponse;
  updateItemData?: UpdateItemData[];
  itemsRedelivery?: ItemsApiResponse;
  purpose?: string;
  onDataChange?: (rows: RowData[]) => void;
  abledHandle: () => boolean; // Function that returns whether fields should be disabled
}


export interface FormDataType {
  item_code: string;
  item_name: string;
  OthersItemCode: string;
  OthersItemName: string;
  requiredBy: string;
  type: string;
  tireWidth: string;
  diameter: string;
  weight: string;
  quantity: string;
  uom: string;
  expenseAccount: string;
  wipCompositeAsset: string;
  Brand: string;
  Marks: string;
  SpeedRating: string;
  Carcass: string;
  Model: string;
  LoadIndex: string;
  AspectRatio: string;
}