"use client"

import type { ChangeEvent } from "react"
import type { Contact } from "../types/redelivery-form"

interface ContactSectionProps {
  selectedContact: string
  contact: string
  email: string
  contacts: Contact[]
  showContactFields: boolean
  isDocStatusLocked: () => boolean
  onContactSelect: (event: ChangeEvent<HTMLSelectElement>) => void
}

export const ContactSection = ({
  selectedContact,
  contact,
  email,
  contacts,
  showContactFields,
  isDocStatusLocked,
  onContactSelect,
}: ContactSectionProps) => {
  return (
    <div className="grid grid-cols-3 bg-gray-50 p-4 border border-gray-300 rounded gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">
          Select Contact<span className="text-red-500">*</span>
        </label>
        <select
          value={selectedContact}
          onChange={onContactSelect}
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
    </div>
  )
}

