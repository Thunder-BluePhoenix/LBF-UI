import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

const NewCustomer = () => {
  const navigate = useNavigate();  // Initialize useNavigate hook for redirection

  const initialFormData = {
    customerName: '',
    contact: '',
    email: '',
    address: '',
    pincode: '',
    coordinates: '',
    purpose: 'Redelivery',
    requestedBy: '',
    dateOfPosting: '',
    dateOfDelivery: '',
    items: [{ itemName: '', itemCode: '', requiredQty: '', availableQty: '' }],
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    if (typeof index === 'number') {
      const updatedItems = [...formData.items];
      updatedItems[index][name as keyof typeof formData.items[0]] = value;
      setFormData({ ...formData, items: updatedItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = () => {
    // Handle your update logic here (e.g., API call to update the data)
    // After the update is successful:

    // Reset form fields
    setFormData(initialFormData);

    // Redirect to "Redelivery Request" component
    navigate('/redelivery-request'); // Adjust the route as per your routing setup
  };
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className=" max-w-4xl  border-2  my-8  mx-auto  bg-white  p-6  shadow-md  rounded-xl">
      <div className=" flex  items-center  space-x-2  mb-6">
        <span onClick={handleGoBack}><FaArrowLeft /></span>
        <h2 className=" text-2xl  font-semibold">New Customer Details</h2>
      </div>

      <div className=" grid  grid-cols-2  gap-4  mb-6">
        <div>
          <label className=" block  text-sm  font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
        <div>
          <label className=" block  text-sm  font-medium">Contact</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>

        <div>
          <label className=" block  text-sm  font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
        <div>
          <label className=" block  text-sm  font-medium">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>

        <div>
          <label className=" block  text-sm  font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
        <div>
          <label className=" block  text-sm  font-medium">Coordinates</label>
          <input
            type="text"
            name="coordinates"
            value={formData.coordinates}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
      </div>

      <hr />

      <div className=" flex  justify-end">
        <div className=" flex  space-x-4">
          <button className=" px-6  py-2  bg-gray-100  rounded-md  text-gray-600">
            Cancel
          </button>
          <button
            className=" px-6  py-2  bg-orange-500  text-white  rounded-md"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;
