"use client"

import type { ChangeEvent } from "react"

interface CustomerSectionProps {
  selectedCustomer: string
  customerName: string | undefined
  loginCustomerName: string | undefined
  groupBy: string
  customers: customer[]
  isDocStatusLocked: () => boolean
  onCustomerSelect: (event: ChangeEvent<HTMLSelectElement>) => void
}

interface customer {
  name: string
  displayName?: string
  customer_name: string
}

export const CustomerSection = ({
  selectedCustomer,
  loginCustomerName,
  groupBy,
  customers,
  isDocStatusLocked,
  onCustomerSelect,
}: CustomerSectionProps) => {
  
  // Ensure that every customer has a customer_name
  const processedCustomers = customers.map((customer) => ({
    ...customer,
    customer_name: customer.customer_name || customer.name, // Fallback if customer_name is missing
  }));

  // Get the display name of the customer
  const getCustomerDisplayName = (customer: { displayName?: string; customer_name: string }): string => {
    return customer.displayName || customer.customer_name;
  };



  return (
    <div className="grid grid-cols-3 bg-gray-50 p-4 border border-gray-300 rounded gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">
          Customer Name<span className="text-red-500">*</span>
        </label>
        <select
          value={selectedCustomer}
          disabled={isDocStatusLocked()}
          onChange={onCustomerSelect}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
        >
          <option value="">Select Customer</option>
          {processedCustomers.map((customer) => (
            <option key={customer.name} value={customer.name}>
              {getCustomerDisplayName(customer)}
            </option>
          ))}
          <option>{loginCustomerName}</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Request By</label>
        <input
          type="text"
          name="request-by"
          value={loginCustomerName}
          disabled={isDocStatusLocked()}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">
          Party Type<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="request-by"
          value={groupBy || "Guest"}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
        />
      </div>
    </div>
  );
};
