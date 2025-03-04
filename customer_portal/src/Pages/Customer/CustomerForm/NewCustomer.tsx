import React, { useState, useEffect } from 'react';
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

interface Supplier {
  name: string;
}

interface FormData {
  customerName: string;
  customerGroup: string;
  transporter: string;
  contact: Contact;
  address: Address;
  purpose: string;
  requestedBy: string;
  dateOfPosting: string;
  dateOfDelivery: string;
  items: Item[];
}

// Updated to include index signature
interface ValidationErrors {
  customerName?: string;
  transporter?: string;
  'contact.firstName'?: string;
  'contact.emailId'?: string;
  'contact.phone'?: string;
  'address.addressLine1'?: string;
  'address.city'?: string;
  'address.country'?: string;
  [key: string]: string | undefined;  // Add index signature
}

const NewCustomer: React.FC = () => {
  const navigate = useNavigate();

  const initialFormData: FormData = {
    customerName: '',
    customerGroup: 'Commercial',
    transporter: '',
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
  const [transporters, setTransporters] = useState<Supplier[]>([]);
  const [isLoadingTransporters, setIsLoadingTransporters] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTransporters();
  }, []);

  const fetchTransporters = async () => {
    try {
      setIsLoadingTransporters(true);
      const response = await fetch('/api/resource/supplier');
      if (!response.ok) {
        throw new Error('Failed to fetch transporters');
      }
      
      const result = await response.json();
      setTransporters(result.data || []);
    } catch (error) {
      console.error('Error fetching transporters:', error);
      showErrorPopup('Failed to load transporters. Please try again.');
    } finally {
      setIsLoadingTransporters(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone.replace(/[-()\s]/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.transporter) {
      newErrors.transporter = 'Transporter selection is required';
    }
    
    if (!formData.contact.firstName.trim()) {
      newErrors['contact.firstName'] = 'Contact name is required';
    }
    
    if (!formData.contact.emailId.trim()) {
      newErrors['contact.emailId'] = 'Email is required';
    } else if (!validateEmail(formData.contact.emailId)) {
      newErrors['contact.emailId'] = 'Invalid email format';
    }
    
    if (!formData.contact.phone.trim()) {
      newErrors['contact.phone'] = 'Phone number is required';
    } else if (!validatePhone(formData.contact.phone)) {
      newErrors['contact.phone'] = 'Invalid phone number format';
    }
    
    if (!formData.address.addressLine1.trim()) {
      newErrors['address.addressLine1'] = 'Address line is required';
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }
    
    if (!formData.address.country.trim()) {
      newErrors['address.country'] = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showErrorPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouchedFields({
      ...touchedFields,
      [name]: true
    });

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

    // Clear error for this field if it exists
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Type-safe field validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    const newErrors = { ...errors };
    
    // Field-specific validation
    if (name === 'customerName') {
      if (!formData.customerName.trim()) {
        newErrors.customerName = 'Customer name is required';
      } else {
        delete newErrors.customerName;
      }
    } 
    else if (name === 'contact.firstName') {
      if (!formData.contact.firstName.trim()) {
        newErrors['contact.firstName'] = 'Contact name is required';
      } else {
        delete newErrors['contact.firstName'];
      }
    }
    else if (name === 'contact.emailId') {
      if (!formData.contact.emailId.trim()) {
        newErrors['contact.emailId'] = 'Email is required';
      } else if (!validateEmail(formData.contact.emailId)) {
        newErrors['contact.emailId'] = 'Invalid email format';
      } else {
        delete newErrors['contact.emailId'];
      }
    }
    else if (name === 'contact.phone') {
      if (!formData.contact.phone.trim()) {
        newErrors['contact.phone'] = 'Phone number is required';
      } else if (!validatePhone(formData.contact.phone)) {
        newErrors['contact.phone'] = 'Invalid phone number format';
      } else {
        delete newErrors['contact.phone'];
      }
    }
    else if (name === 'address.addressLine1') {
      if (!formData.address.addressLine1.trim()) {
        newErrors['address.addressLine1'] = 'Address line is required';
      } else {
        delete newErrors['address.addressLine1'];
      }
    }
    else if (name === 'address.city') {
      if (!formData.address.city.trim()) {
        newErrors['address.city'] = 'City is required';
      } else {
        delete newErrors['address.city'];
      }
    }
    else if (name === 'address.country') {
      if (!formData.address.country.trim()) {
        newErrors['address.country'] = 'Country is required';
      } else {
        delete newErrors['address.country'];
      }
    }
    else if (name === 'transporter') {
      if (!formData.transporter) {
        newErrors.transporter = 'Transporter selection is required';
      } else {
        delete newErrors.transporter;
      }
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showErrorPopup('Please fix all validation errors before submitting');
      setShowAddressDetails(true); // Show address details if there are errors there
      return;
    }

    try {
      const payload = {
        customer_name: formData.customerName,
        customer_group: formData.customerGroup,
        transporter: formData.transporter,
        addresses: [
          {
            address_title: formData.address.addressTitle,
            address_line1: formData.address.addressLine1,
            city: formData.address.city,
            country: formData.address.country,
            is_primary_address: formData.address.isPrimaryAddress ? 1 : 0,
            custom_transporters: [
              {
                supplier: formData.transporter,
                is_default: 1
              }
            ]
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
      setErrors({});
      navigate('/customer_portal/customer-table');
    } catch (error) {
      console.error('Error creating customer:', error);
      showErrorPopup('Failed to create customer. Please try again.');
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

  // Helper function to determine if a field has an error
  const hasError = (fieldName: keyof ValidationErrors): boolean => {
    return !!errors[fieldName];
  };

  // Type-safe way to get error message
  const getErrorMessage = (fieldName: keyof ValidationErrors): string => {
    return errors[fieldName] || '';
  };

  return (
    <div className="max-w-4xl border border-gray-300 my-8 mx-auto bg-white p-6 shadow-md rounded-xl relative">
      {/* Validation Popup */}
      {showPopup && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10 shadow-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {popupMessage}</span>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-6">
        <span onClick={handleGoBack} className="cursor-pointer"><FaArrowLeft /></span>
        <h2 className="text-2xl font-semibold">New Customer Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Customer Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border ${hasError('customerName') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
          />
          {hasError('customerName') && (
            <p className="mt-1 text-xs text-red-500">{getErrorMessage('customerName')}</p>
          )}
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

        {/* Transporter Field */}
        <div>
          <label className="block text-sm font-medium">Transporter <span className="text-red-500">*</span></label>
          <select
            name="transporter"
            value={formData.transporter}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border ${hasError('transporter') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
            disabled={isLoadingTransporters}
          >
            <option value="">Select Transporter</option>
            {transporters.map((supplier) => (
              <option key={supplier.name} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </select>
          {hasError('transporter') && (
            <p className="mt-1 text-xs text-red-500">{getErrorMessage('transporter')}</p>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium">Contact Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="contact.firstName"
            value={formData.contact.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border ${hasError('contact.firstName') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
          />
          {hasError('contact.firstName') && (
            <p className="mt-1 text-xs text-red-500">{getErrorMessage('contact.firstName')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border ${hasError('contact.phone') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
          />
          {hasError('contact.phone') && (
            <p className="mt-1 text-xs text-red-500">{getErrorMessage('contact.phone')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="contact.emailId"
            value={formData.contact.emailId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border ${hasError('contact.emailId') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
          />
          {hasError('contact.emailId') && (
            <p className="mt-1 text-xs text-red-500">{getErrorMessage('contact.emailId')}</p>
          )}
        </div>

        {/* Address Field that expands to show details */}
        <div className="col-span-2">
          <label className="block text-sm font-medium">Address <span className="text-red-500">*</span></label>
          <div 
            onClick={toggleAddressDetails}
            className={`w-full px-3 py-2 border ${(hasError('address.addressLine1') || hasError('address.city') || hasError('address.country')) ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1 cursor-pointer bg-gray-50`}
          >
            {getFormattedAddress()}
          </div>
          {(hasError('address.addressLine1') || hasError('address.city') || hasError('address.country')) && !showAddressDetails && (
            <p className="mt-1 text-xs text-red-500">Please complete all required address fields</p>
          )}
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
              <label className="block text-sm font-medium">Address Line <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="address.addressLine1"
                value={formData.address.addressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${hasError('address.addressLine1') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
              />
              {hasError('address.addressLine1') && (
                <p className="mt-1 text-xs text-red-500">{getErrorMessage('address.addressLine1')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${hasError('address.city') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
              />
              {hasError('address.city') && (
                <p className="mt-1 text-xs text-red-500">{getErrorMessage('address.city')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Country <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${hasError('address.country') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
              />
              {hasError('address.country') && (
                <p className="mt-1 text-xs text-red-500">{getErrorMessage('address.country')}</p>
              )}
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
            onClick={() => {
              setFormData(initialFormData);
              setErrors({});
              setTouchedFields({});
            }}
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