import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Contact {
  firstName: string;
  emailId: string;
  phone: string;
}

interface Address {
  addressTitle: string;
  addressLine1: string;
  city: string;
  country: string;
  isPrimaryAddress: boolean;
}

interface Item {
  itemName: string;
  itemCode: string;
  requiredQty: string;
  availableQty: string;
}

interface FormData {
  customerName: string;
  customerGroup: string;
  contact: Contact;
  address: Address;
  purpose: string;
  requestedBy: string;
  dateOfPosting: string;
  dateOfDelivery: string;
  items: Item[];
}

const NewCustomer: React.FC = () => {
  const navigate = useNavigate();

  const initialFormData: FormData = {
    customerName: '',
    customerGroup: 'Commercial',
    contact: {
      firstName: '',
      emailId: '',
      phone: '',
    },
    address: {
      addressTitle: 'Office',
      addressLine1: '',
      city: '',
      country: 'United States',
      isPrimaryAddress: true,
    },
    purpose: 'Redelivery',
    requestedBy: '',
    dateOfPosting: '',
    dateOfDelivery: '',
    items: [{ itemName: '', itemCode: '', requiredQty: '', availableQty: '' }],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showAddressDetails, setShowAddressDetails] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [objectName, fieldName] = name.split('.');
      setFormData({
        ...formData,
        [objectName]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(formData as any)[objectName],
          [fieldName]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        customer_name: formData.customerName,
        customer_group: formData.customerGroup,
        addresses: [
          {
            address_title: formData.address.addressTitle,
            address_line1: formData.address.addressLine1,
            city: formData.address.city,
            country: formData.address.country,
            is_primary_address: formData.address.isPrimaryAddress ? 1 : 0,
          },
        ],
        contacts: [
          {
            first_name: formData.contact.firstName,
            email_id: formData.contact.emailId,
            phone: formData.contact.phone,
          },
        ],
      };

      const response = await fetch('/api/method/lbf_logistica.api.bol.create_customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      setFormData(initialFormData);
      navigate('/customer_portal/material-request-form/');
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleAddressDetails = () => {
    setShowAddressDetails(!showAddressDetails);
  };

  const getFormattedAddress = () => {
    const { addressTitle, addressLine1, city, country } = formData.address;
    if (!addressLine1 && !city) return 'Click to add address details';
    return `${addressTitle}, ${addressLine1}, ${city}, ${country}`;
  };
  return (
    <div className="max-w-4xl border border-gray-300 my-8 mx-auto bg-white p-6 shadow-md rounded-xl">
      <div className="flex items-center space-x-2 mb-6">
        <span onClick={handleGoBack} className="cursor-pointer"><FaArrowLeft /></span>
        <h2 className="text-2xl font-semibold">New Customer Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Customer Group</label>
          <select
            name="customerGroup"
            value={formData.customerGroup}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
          >
            <option value="Commercial">Commercial</option>
            <option value="Individual">Individual</option>
            <option value="Non-Profit">Non-Profit</option>
          </select>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium">Contact Name</label>
          <input
            type="text"
            name="contact.firstName"
            value={formData.contact.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="contact.emailId"
            value={formData.contact.emailId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
          />
        </div>

        {/* Address Field that expands to show details */}
        <div className="col-span-2">
          <label className="block text-sm font-medium">Address</label>
          <div 
            onClick={toggleAddressDetails}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 cursor-pointer bg-gray-50"
          >
            {getFormattedAddress()}
          </div>
        </div>

        {/* Expanded Address Fields */}
        {showAddressDetails && (
          <div className="col-span-2 grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div>
              <label className="block text-sm font-medium">Address Title</label>
              <input
                type="text"
                name="address.addressTitle"
                value={formData.address.addressTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address Line</label>
              <input
                type="text"
                name="address.addressLine1"
                value={formData.address.addressLine1}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="address.isPrimaryAddress"
                  checked={formData.address.isPrimaryAddress}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      isPrimaryAddress: e.target.checked
                    }
                  })}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">Primary Address</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <hr className="text-gray-300" />

      <div className="flex mt-4 justify-end">
        <div className="flex space-x-4">
          <button 
            className="px-6 py-2 bg-gray-100 border-gray-300 rounded-md text-gray-600"
            onClick={() => setFormData(initialFormData)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-orange-500 text-white rounded-md"
            onClick={handleSubmit}
          >
            Create Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;