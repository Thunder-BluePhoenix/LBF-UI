import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const RedeliveryRequest = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    contact: '',
    email: '',
    address: '',
    purpose: '',
    requestedBy: '',
    dateOfPosting: '',
    dateOfDelivery: '',
    items: [{ itemName: '', itemCode: '', requiredQty: '', availableQty: '' }],
  });
  const navigate = useNavigate();

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { itemName: '', itemCode: '', requiredQty: '', availableQty: '' },
      ],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const { name, value } = e.target;
    if (typeof index === 'number') {
      const updatedItems = [...formData.items];
      updatedItems[index][name as keyof typeof formData.items[0]] = value;
      setFormData({ ...formData, items: updatedItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddNewItemDetails = () => {
    navigate('/add-new-item-details');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform form validation or API call here
    // If successful, redirect to the request list page
    navigate('/request-list');
  };

  return (
    <div className=" max-w-4xl  border-2  my-8  mx-auto  bg-white  p-6  shadow-md  rounded-xl">
      <div className=" flex  items-center  space-x-2  mb-6">
        <span onClick={handleGoBack}><FaArrowLeft  /></span>
        <h2 className=" text-2xl  font-semibold">Redelivery Request</h2>
      </div>

      <form onSubmit={handleSubmit}>
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
            <label className=" block  text-sm  font-medium">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className=" w-full  px-3  py-2  border  rounded-md  mt-1"
            />
          </div>
          <div>
            <label className=" block  text-sm  font-medium">Purpose</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange} 
              className=" w-full  px-3  py-2  border  rounded-md  mt-1"
              
            >
              <option>Redelivery</option>
              <option>delivery</option>
              <option>N/A</option>
            </select>
          </div>

          <div className="">
            <label className=" block  text-sm  font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className=" w-full  px-3  py-2  border  rounded-md  mt-1"
            />
          </div>
          <div className="">
            <label className=" block  text-sm  font-medium">Request By</label>
            <input
              type="text"
              name="request-by"
              value={formData.requestedBy}
              onChange={handleChange}
              className=" w-full  px-3  py-2  border  rounded-md  mt-1"
            />
          </div>

          <div>
            <label className=" block  text-sm  font-medium">Date of Posting</label>
            <input
              type="date"
              name="dateOfPosting"
              value={formData.dateOfPosting}
              onChange={handleChange}
              className=" w-full  px-3  py-2  border  rounded-md  mt-1"
            />
          </div>
          <div>
            <label className=" block  text-sm  font-medium">Date of Delivery</label>
            <input
              type="date"
              name="dateOfDelivery"
              value={formData.dateOfDelivery}
              onChange={handleChange}
              className=" w-full  px-3  py-2  border  rounded-md  mt-1"
            />
          </div>
        </div>

        <div className=" overflow-x-auto  mb-6">
          <table className=" min-w-full  mt-8  mb-6  border  divide-y  divide-gray-200">
            <thead className=" bg-gray-50">
              <tr>
                <th className=" flex  items-center  gap-3  px-2  py-2">
                  <input type="checkbox" className=" form-checkbox  h-3  w-3" />
                  Item Name
                </th>
                <th className=" px-4  py-2">Item Code</th>
                <th className=" px-4  py-2">Required Qty</th>
                <th className=" px-4  py-2">Available Qty</th>
              </tr>
            </thead>
            <tbody className=" bg-white  divide-y  divide-gray-200">
              {formData.items.map((_item, index) => (
                <tr key={index}>
                  <td className=" flex  items-center  gap-3  px-2  py-2">
                    <input type="checkbox" className=" form-checkbox  h-3  w-3" />
                    <div>Mrf item</div>
                  </td>
                  <td>
                    <div>Label</div>
                  </td>
                  <td>
                    <div>Label</div>
                  </td>
                  <td>
                    <div>Label</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className=" flex  justify-between">
          <div>
            <button
              type="button"
              onClick={addItem}
              className=" px-4  py-2  bg-gray-200  rounded-md  text-gray-800"
            >
              Add Row
            </button>
            <button
              type="button"
              onClick={() => {
                handleAddNewItemDetails();
              }}
              className=" ml-4  px-4  py-2  bg-gray-200  rounded-md  text-gray-800"
            >
              Add Item
            </button>
          </div>
          <div className=" flex  space-x-4">
            <button type="button" className=" px-6  py-2  bg-gray-100  rounded-md  text-gray-600">
              Cancel
            </button>
            <button type="submit" className=" px-6  py-2  bg-orange-500  text-white  rounded-md">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RedeliveryRequest;
