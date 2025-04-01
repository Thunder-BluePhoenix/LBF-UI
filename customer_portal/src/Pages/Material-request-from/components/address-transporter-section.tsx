"use client"

import type { ChangeEvent } from "react"
import type { Address, Transporter } from "../types/redelivery-form"

interface AddressTransporterSectionProps {
  selectedAddress: string
  addresses: Address[]
  showAddressFields: boolean
  addressDetails: Address | null
  selectedTransporter: string
  transporters: Transporter[]
  showTransporterFields: boolean
  transporterDetails: Transporter | null
  isDocStatusLocked: () => boolean
  onAddressSelect: (event: ChangeEvent<HTMLSelectElement>) => void
  onTransporterSelect: (event: ChangeEvent<HTMLSelectElement>) => void
}

export const AddressTransporterSection = ({
  selectedAddress,
  addresses,
  showAddressFields,
  addressDetails,
  selectedTransporter,
  transporters,
  showTransporterFields,
  transporterDetails,
  isDocStatusLocked,
  onAddressSelect,
  onTransporterSelect,
}: AddressTransporterSectionProps) => {


  return (
    <div className="grid grid-cols-3 bg-gray-50 p-4 border border-gray-300 rounded gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">
          Select Address<span className="text-red-500">*</span>
        </label>
        <select
          value={selectedAddress}
          onChange={onAddressSelect}
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
        <div>
          <label className="block text-sm font-medium">City & Country</label>
          <input
            type="text"
            value={`${addressDetails.address_line1}, ${addressDetails.city}, ${addressDetails.country}`}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">
          Select Transporter<span className="text-red-500">*</span>
        </label>
        <select
          name="name"
          value={selectedTransporter}
          onChange={onTransporterSelect}
          disabled={isDocStatusLocked()}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
        >
          <option value="">Select Transporter</option>
          {transporters.map((transporter, index) => (
            <option key={transporter.name || index} value={transporter.supplier || ""}>
              {transporter.supplier || "Unnamed Transporter"}
            </option>
          ))}
        </select>
      </div>

      {showTransporterFields && transporterDetails && (
        <>
          <div>
            <label className="block text-sm font-medium">Supplier</label>
            <input
              type="text"
              value={transporterDetails.supplier || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cutoff Start Time</label>
            <input
              type="text"
              value={transporterDetails.cutoff_start_time || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cutoff End Time</label>
            <input
              type="text"
              value={transporterDetails.cutoff_end_time || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Weekdays Off</label>
            <input
              type="text"
              value={transporterDetails.cutoff_end_time || ""}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-gray-50"
            />
          </div>
        </>
      )}
    </div>
  )
}

