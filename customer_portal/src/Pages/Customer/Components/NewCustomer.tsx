import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

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
  uniqueEmail: string;
  uniquePhone: string;
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

interface ValidationErrors {
  customerName?: string;
  transporter?: string;
  'contact.uniqueEmail'?: string;
  'contact.uniquePhone'?: string;
  'contact.firstName'?: string;
  'contact.emailId'?: string;
  'contact.phone'?: string;
  'address.addressLine1'?: string;
  'address.city'?: string;
  'address.country'?: string;
  [key: string]: string | undefined;
}

const NewCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get the customer ID from the URL

  const initialFormData: FormData = {
    customerName: '',
    customerGroup: 'Commercial',
    transporter: '',
    uniqueEmail: '',
    uniquePhone: '',
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
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [transporters, setTransporters] = useState<Supplier[]>([]);
  const [isLoadingTransporters, setIsLoadingTransporters] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [customerGroup, setCustomerGroup] = useState<unknown>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
console.log(customerGroup,loading,"customerGroupcustomerGroupcustomerGroupcustomerGroupcustomerGroup")
  useEffect(() => {
    fetchTransporters();
    if (id) {
      fetchCustomerData(id); // Fetch customer data if ID is present
    }
  }, [id]);
  
  useEffect(() => {
    const fetchCustomerGroup = async () => {
      try {
        const response = await fetch('/api/method/lbf_logistica.api.bol.get_customer_group');
        if (!response.ok) {
          throw new Error('Failed to fetch customer group');
        }
        const data = await response.json();
        setCustomerGroup(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setErrors(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerGroup();
  }, []);

  const fetchTransporters = async () => {
    try {
      setIsLoadingTransporters(true);
      const response = await fetch(`/api/resource/Supplier`);
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

  const fetchCustomerData = async (customerId: string) => {
    try {
      const response = await fetch(`/api/resource/Customer/${customerId}/?fields=["*"]`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }

      const result = await response.json();
      console.log(result, "customer update data result");

      // Assuming result.data contains the data you're working with
      const data = result.data;

      setFormData({
        customerName: data.customer_name || '',
        customerGroup: data.customer_group || '',
        transporter: data.transporter || '',
        uniqueEmail: data.contact.uniqueEmail || '', // Fixed here
        uniquePhone: data.contact.uniquePhone || '', // Fixed here
        contact: {
          firstName: data.contacts?.[0]?.first_name || '',  // Contacts array is missing
          emailId: data.contacts?.[0]?.email_id || '',
          phone: data.contacts?.[0]?.phone || '',
        },
        address: {
          addressTitle: data.addresses?.[0]?.address_title || 'Office',  // Addresses array is missing
          addressLine1: data.addresses?.[0]?.address_line1 || '',
          city: data.addresses?.[0]?.city || '',
          country: data.addresses?.[0]?.country || 'United States',
          isPrimaryAddress: data.addresses?.[0]?.is_primary_address === 1,
        },
        purpose: data.purpose || 'Redelivery',  // No purpose field in the provided data, handle accordingly
        requestedBy: data.requested_by || '',  // No requested_by field in the provided data, handle accordingly
        dateOfPosting: data.date_of_posting || '',  // No date_of_posting field in the provided data
        dateOfDelivery: data.date_of_delivery || '',  // No date_of_delivery field in the provided data
        items: data.items || [{ itemName: '', itemCode: '', requiredQty: '', availableQty: '' }],  // Items array is missing
      });

    } catch (error) {
      console.error('Error fetching customer data:', error);
      showErrorPopup('Failed to load customer data. Please try again.');
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

    if (!formData.uniqueEmail.trim()) {
      newErrors['contact.uniqueEmail'] = 'Customer unique email is required';
    } else if (!validateEmail(formData.uniqueEmail)) {
      newErrors['contact.uniqueEmail'] = 'Invalid email format';
    }

    // New unique phone validation
    if (!formData.uniquePhone.trim()) {
      newErrors['contact.uniquePhone'] = 'Customer unique phone number is required';
    } else if (!validatePhone(formData.uniquePhone)) {
      newErrors['contact.uniquePhone'] = 'Invalid phone number format';
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;

    const newErrors = { ...errors };

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
      // Show both contact and address details if there are errors there
      setShowAddressDetails(true);
      setShowContactDetails(true);
      return;
    }

    try {
      const payload = {
        customer_name: formData.customerName,
        customer_group: formData.customerGroup,
        transporter: formData.transporter,
        mail_id: formData.uniqueEmail, // Fixed here
        contact_no: formData.uniquePhone, // Fixed here
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

      const url = id
        ? `/api/method/lbf_logistica.api.bol.update_customer/${id}` // Update endpoint
        : '/api/method/lbf_logistica.api.bol.create_customer'; // Create endpoint

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save customer');
      }

      setFormData(initialFormData);
      setErrors({});
      navigate('/customer_portal/customer-table');
    } catch (error) {
      console.error('Error saving customer:', error);
      showErrorPopup('Failed to save customer. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleAddressDetails = () => {
    setShowAddressDetails(!showAddressDetails);
  };

  const toggleContactDetails = () => {
    setShowContactDetails(!showContactDetails);
  };

  const getFormattedAddress = () => {
    const { addressTitle, addressLine1, city, country } = formData.address;
    if (!addressLine1 && !city) return 'Click to add address details';
    return `${addressTitle}, ${addressLine1}, ${city}, ${country}`;
  };

  const getFormattedContact = () => {
    const { firstName, emailId, phone } = formData.contact;
    if (!firstName) return 'Click to add contact details';
    if (firstName && !emailId && !phone) return `${firstName}`;
    if (firstName && emailId && !phone) return `${firstName}, ${emailId}`;
    if (firstName && !emailId && phone) return `${firstName}, ${phone}`;
    return `${firstName}, ${emailId}, ${phone}`;
  };

  const hasError = (fieldName: keyof ValidationErrors): boolean => {
    return !!errors[fieldName];
  };

  const getErrorMessage = (fieldName: keyof ValidationErrors): string => {
    return errors[fieldName] || '';
  };

  return (
    <div className="max-full border border-gray-100 my-8 mx-auto bg-white p-6 rounded relative">
      {showPopup && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10 shadow-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {popupMessage}</span>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-6">
        <span onClick={handleGoBack} className="cursor-pointer"><FaArrowLeft /></span>
        <h2 className="text-2xl font-semibold">{id ? 'Edit Customer Details' : 'New Customer Details'}</h2>
      </div>

      <div className="grid grid-cols-3 bg-gray-50 p-4 border border-gray-300 rounded gap-4 mb-6">
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
    {loading ? (
      <option value="">Loading...</option>
    ) : (
      customerGroup?.message?.map((group: { name: string }) => (
        <option key={group.name} value={group.name}>
          {group.name}
        </option>
      ))
    )}
  </select>
</div>
        <div>
          <label className="block text-sm font-medium">Customer Unique Mail <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="uniqueEmail"
            value={formData.uniqueEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border ${hasError('contact.uniqueEmail') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
          />
          {hasError('contact.uniqueEmail') && (
            <p className="mt-1 text-xs text-red-500">{getErrorMessage('contact.uniqueEmail')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Customer Unique Phone <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="uniquePhone"
            value={formData.uniquePhone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border ${hasError('contact.uniquePhone') ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1`}
          />
          {hasError('contact.uniquePhone') && (
            <p className="mt-1 text-xs text-red-500">{getErrorMessage('contact.uniquePhone')}</p>
          )}
        </div>
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
      </div>

      {/* Contact field with toggle like address */}
      <div className="col-span-2 mb-4">
        <label className="block text-sm font-medium">Contact <span className="text-red-500">*</span></label>
        <div
          onClick={toggleContactDetails}
          className={`w-full px-3 py-2 border ${(hasError('contact.firstName') || hasError('contact.emailId') || hasError('contact.phone')) ? 'border-red-500' : 'border-gray-300'} rounded-md mt-1 cursor-pointer bg-gray-50`}
        >
          {getFormattedContact()}
        </div>
        {(hasError('contact.firstName') || hasError('contact.emailId') || hasError('contact.phone')) && !showContactDetails && (
          <p className="mt-1 text-xs text-red-500">Please complete all required contact fields</p>
        )}
      </div>

      {showContactDetails && (
        <div className="col-span-2 grid grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50 mb-4">
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
        </div>
      )}

      {/* Address field */}
      <div className="col-span-2 mb-4">
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

      {showAddressDetails && (
        <div className="col-span-2 grid grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50">
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

      <hr className="text-gray-300 mt-4" />

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
            {id ? 'Update Customer' : 'Create Customer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;