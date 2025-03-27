"use client"

import type { ChangeEvent } from "react"

interface PurposeDateSectionProps {
  purpose: string
  dateOfPosting: string
  dateOfDelivery: string
  service: string
  isDocStatusLocked: () => boolean
  onPurposeChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onDateOfPostingChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDateOfDeliveryChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const PurposeDateSection = ({
  purpose,
  dateOfPosting,
  dateOfDelivery,
  service,
  isDocStatusLocked,
  onPurposeChange,
  onDateOfPostingChange,
  onDateOfDeliveryChange,
}: PurposeDateSectionProps) => {
  return (
    <div className="grid grid-cols-3 bg-gray-50 p-4 border border-gray-300 rounded gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">
          Purpose<span className="text-red-500">*</span>
        </label>
        <select
          name="purpose"
          value={purpose}
          onChange={onPurposeChange}
          disabled={isDocStatusLocked()}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
        >
          <option>Redelivery</option>
          {service === "Tyre Hotel" && <option>Pick Up</option>}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">
          Date of Posting<span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dateOfPosting"
          value={dateOfPosting}
          onChange={onDateOfPostingChange}
          disabled={isDocStatusLocked()}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Date of Delivery<span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dateOfDelivery"
          value={dateOfDelivery}
          onChange={onDateOfDeliveryChange}
          disabled={isDocStatusLocked()}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
        />
      </div>
    </div>
  )
}

