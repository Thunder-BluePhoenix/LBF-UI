import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // For navigation

const RedeliveryRequest = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    contact: '',
    email: '',
    address: '',
    purpose: 'Redelivery',
    requestedBy: '',
    dateOfPosting: '',
    dateOfDelivery: '',
    marks: '',
    aspectRatio: '',
    diameter: '',
    carcass: '',
    localIndex: '',
    weight: '',
    quantity: '',
  });

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Simulate form update logic here (API call or local update)

    // After successful update, reset the form fields
    setFormData({
      customerName: '',
      contact: '',
      email: '',
      address: '',
      purpose: 'Redelivery',
      requestedBy: '',
      dateOfPosting: '',
      dateOfDelivery: '',
      marks: '',
      aspectRatio: '',
      diameter: '',
      carcass: '',
      localIndex: '',
      weight: '',
      quantity: '',
    });

    navigate('/redelivery-request');
  };
  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div className=" max-w-4xl  border-2  my-8  mx-auto  bg-white  p-6  shadow-md  rounded-xl">
      <div className=" flex  items-center  space-x-2  mb-6">
       <span onClick={handleGoBack}> <FaArrowLeft /></span>
        <h2 className=" text-2xl  font-semibold">New Item Details</h2>
      </div>

      <div className=" grid  grid-cols-2  gap-4  mb-6">
    
        <div>
          <label className=" block  text-sm  font-medium">Item Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
        <div>
          <label className=" block  text-sm  font-medium">Brand Name</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>

        <div>
          <label className=" block  text-sm  font-medium">Model</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
        <div>
          <label className=" block  text-sm  font-medium">Marks</label>
          <input
            type="text"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>

        <div>
          <label className=" block  text-sm  font-medium">Aspect Ratio</label>
          <input
            type="text"
            name="aspectRatio"
            value={formData.aspectRatio}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
        <div>
          <label className=" block  text-sm  font-medium">Diameter</label>
          <input
            type="text"
            name="diameter"
            value={formData.diameter}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>

        <div>
          <label className=" block  text-sm  font-medium">Carcass</label>
          <input
            type="text"
            name="carcass"
            value={formData.carcass}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
        <div>
          <label className=" block  text-sm  font-medium">Local Index</label>
          <input
            type="text"
            name="localIndex"
            value={formData.localIndex}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
        <div>
          <label className=" block  text-sm  font-medium">Weight</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className=" w-full  px-3  py-2  border  rounded-md  mt-1"
          />
        </div>
        <div>
          <label className=" block  text-sm  font-medium">Quantity</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
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
            onClick={handleSubmit}
            className=" px-6  py-2  bg-orange-500  text-white  rounded-md"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeliveryRequest;
