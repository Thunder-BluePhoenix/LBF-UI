import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { BiPlus, BiSearch } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router';

interface Request {
    id: number;
    requestedBy: string;
    customerName: string;
    service: string;
    purpose: string;
    requiredBy: string;
    requiredQty: number;
    recipientContact: string;
    recipientAddress: string;
    status: string;
}

const requestList: Request[] = [
    {
        id: 1,
        requestedBy: 'Supplier',
        customerName: 'Andrew Cirkis',
        service: 'PH',
        purpose: 'Redelivery',
        requiredBy: '01/01/25',
        requiredQty: 28,
        recipientContact: '9864537286',
        recipientAddress: 'M.C. GARAGE S.R.L.Via B. Cavaceppi 26, Italy',
        status: 'Pending',
    },
    {
        id: 2,
        requestedBy: 'Supplier',
        customerName: 'Brenda Miles',
        service: 'PH',
        purpose: 'Replacement',
        requiredBy: '01/03/25',
        requiredQty: 15,
        recipientContact: '9864537299',
        recipientAddress: 'Via Roma 10, Italy',
        status: 'Accepted',
    },
    {
        id: 3,
        requestedBy: 'Customer',
        customerName: 'Henry Adams',
        service: 'PH',
        purpose: 'New Order',
        requiredBy: '01/02/25',
        requiredQty: 50,
        recipientContact: '9874537123',
        recipientAddress: 'Piazza Navona, Italy',
        status: 'Awaiting',
    },
    {
        id: 4,
        requestedBy: 'Customer',
        customerName: 'Luna Park',
        service: 'PH',
        purpose: 'Redelivery',
        requiredBy: '01/06/25',
        requiredQty: 12,
        recipientContact: '9984657322',
        recipientAddress: 'Via Garibaldi 50, Italy',
        status: 'Delivered',
    },
    {
        id: 5,
        requestedBy: 'Customer',
        customerName: 'Mark Douglas',
        service: 'PH',
        purpose: 'Replacement',
        requiredBy: '01/05/25',
        requiredQty: 20,
        recipientContact: '9675431234',
        recipientAddress: 'Via Veneto 14, Italy',
        status: 'Awaiting',
    },
    {
        id: 6,
        requestedBy: 'Supplier',
        customerName: 'Jane Roberts',
        service: 'CH',
        purpose: 'New Order',
        requiredBy: '01/03/25',
        requiredQty: 40,
        recipientContact: '9776543121',
        recipientAddress: 'Via Milano 33, Italy',
        status: 'Processing',
    },
    {
        id: 7,
        requestedBy: 'Customer',
        customerName: 'John Smith',
        service: 'PH',
        purpose: 'Redelivery',
        requiredBy: '01/04/25',
        requiredQty: 35,
        recipientContact: '9887654321',
        recipientAddress: 'Via Torino 15, Italy',
        status: 'Accepted',
    },
    {
        id: 8,
        requestedBy: 'Supplier',
        customerName: 'Emma Black',
        service: 'PH',
        purpose: 'Replacement',
        requiredBy: '01/02/25',
        requiredQty: 25,
        recipientContact: '9654783212',
        recipientAddress: 'Via Napoli 8, Italy',
        status: 'Pending',
    },
    {
        id: 9,
        requestedBy: 'Customer',
        customerName: 'Michael Brown',
        service: 'PH',
        purpose: 'New Order',
        requiredBy: '01/08/25',
        requiredQty: 18,
        recipientContact: '9564782314',
        recipientAddress: 'Via Firenze 19, Italy',
        status: 'Delivered',
    },
    {
        id: 10,
        requestedBy: 'Supplier',
        customerName: 'David Green',
        service: 'PH',
        purpose: 'Redelivery',
        requiredBy: '01/09/25',
        requiredQty: 22,
        recipientContact: '9123456789',
        recipientAddress: 'Via Trento 6, Italy',
        status: 'Processing',
    },
    {
        id: 11,
        requestedBy: 'Customer',
        customerName: 'Sophia Lee',
        service: 'PH',
        purpose: 'Replacement',
        requiredBy: '01/07/25',
        requiredQty: 30,
        recipientContact: '9234567890',
        recipientAddress: 'Via Parma 22, Italy',
        status: 'Pending',
    },
    {
        id: 12,
        requestedBy: 'Supplier',
        customerName: 'James White',
        service: 'PH',
        purpose: 'New Order',
        requiredBy: '01/05/25',
        requiredQty: 10,
        recipientContact: '9345678901',
        recipientAddress: 'Via Bari 12, Italy',
        status: 'Accepted',
    },
    {
        id: 13,
        requestedBy: 'Customer',
        customerName: 'Olivia Walker',
        service: 'PH',
        purpose: 'Redelivery',
        requiredBy: '01/11/25',
        requiredQty: 45,
        recipientContact: '9456789012',
        recipientAddress: 'Via Palermo 28, Italy',
        status: 'Processing',
    },
    {
        id: 14,
        requestedBy: 'Supplier',
        customerName: 'Lucas Hall',
        service: 'PH',
        purpose: 'Replacement',
        requiredBy: '01/12/25',
        requiredQty: 33,
        recipientContact: '9567890123',
        recipientAddress: 'Via Siena 4, Italy',
        status: 'Delivered',
    },
    {
        id: 15,
        requestedBy: 'Customer',
        customerName: 'Ethan King',
        service: 'PH',
        purpose: 'New Order',
        requiredBy: '01/10/25',
        requiredQty: 38,
        recipientContact: '9678901234',
        recipientAddress: 'Via Genoa 3, Italy',
        status: 'Awaiting',
    },
    {
        id: 16,
        requestedBy: 'Supplier',
        customerName: 'Ava Scott',
        service: 'PH',
        purpose: 'Replacement',
        requiredBy: '01/04/25',
        requiredQty: 27,
        recipientContact: '9789012345',
        recipientAddress: 'Via Livorno 9, Italy',
        status: 'Pending',
    },
    {
        id: 17,
        requestedBy: 'Customer',
        customerName: 'Mia Young',
        service: 'PH',
        purpose: 'Redelivery',
        requiredBy: '01/07/25',
        requiredQty: 48,
        recipientContact: '9890123456',
        recipientAddress: 'Via Pisa 16, Italy',
        status: 'Accepted',
    },
    {
        id: 18,
        requestedBy: 'Supplier',
        customerName: 'Daniel Harris',
        service: 'PH',
        purpose: 'New Order',
        requiredBy: '01/08/25',
        requiredQty: 26,
        recipientContact: '9901234567',
        recipientAddress: 'Via Mantova 5, Italy',
        status: 'Processing',
    },
    {
        id: 19,
        requestedBy: 'Customer',
        customerName: 'Lily Perez',
        service: 'PH',
        purpose: 'Replacement',
        requiredBy: '01/09/25',
        requiredQty: 16,
        recipientContact: '9012345678',
        recipientAddress: 'Via Salerno 14, Italy',
        status: 'Delivered',
    },
    {
        id: 20,
        requestedBy: 'Supplier',
        customerName: 'Jack Hill',
        service: 'PH',
        purpose: 'Redelivery',
        requiredBy: '01/06/25',
        requiredQty: 55,
        recipientContact: '9123456789',
        recipientAddress: 'Via Bari 6, Italy',
        status: 'Pending',
    },
];

const MaterialRequestList: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigator = useNavigate();
    const itemsPerPage = 10;

    // Filter requests based on search query matching with customerName, service (material name), or order ID.
    const filteredRequests = requestList.filter(
        (request) =>
            request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) // Convert id to string
    );

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Accepted':
                return ' text-green-500  bg-green-100  border  border-green-500';
            case 'Awaiting':
                return ' text-blue-500  bg-blue-100  border  border-blue-500';
            case 'Approved':
                return ' text-green-500  bg-green-100  border  border-green-500';
            case 'Processing':
                return ' text-orange-500  bg-orange-100  border  border-orange-500';
            case 'Delivered':
                return ' text-purple-500  bg-purple-100  border  border-purple-500';
            default:
                return ' text-gray-500  bg-gray-100  border  border-gray-500';
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleRedirectToRedeliveryRequest = () => {
        navigator('/customer_portal/material-request-form');
    };
    const handlMaterialRequestDetails = () => {
        navigator('/customer_portal/material-request-details');
    };

    const handleGoBack = () => {
        navigator(-1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };




    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 w-full">
            <div className=" flex  items-center  justify-between  mb-2">
                <div className=" flex  items-center  space-x-4">
                    <div
                        onClick={handleGoBack}
                        className=" p-[10px]  border  rounded-lg  flex  items-center  justify-center  bg-gray-100  text-gray-700  cursor-pointer  transition-all  duration-300  ease-in-out hover: hover: shadow-lg"
                    >
                        <span className=" text-xl"><FiArrowLeft  /></span>
                    </div>

                    <div className=" flex  flex-col">
                        <h1 className=" text-xl  font-semibold">Request List</h1>
                        <span className=" text-gray-500  text-xs">PH & TH Request list</span>
                    </div>
                </div>

                <div className=" flex  items-center  flex-row  space-x-2">
                    <div className=" relative  w-96">
                       <span  className=" absolute  left-3  top-1/2  transform  -translate-y-1/2  text-gray-400  text-xl"> <BiSearch /></span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by order id, material name"
                            className=" border  border-gray-300  rounded-lg  pl-10  pr-10  py-2  w-full"
                        />
                        {searchQuery && (
                            <span
                            onClick={handleClearSearch}
                                className=" absolute  right-3  top-1/2  transform  -translate-y-1/2  text-gray-400  text-xl  cursor-pointer"
                            ><AiFillCloseCircle/></span>
                                
                        )}
                    </div>
                </div>

                <div className="  flex  justify-end">
                    <button
                        onClick={handleRedirectToRedeliveryRequest}
                        className=" flex  items-center  space-x-2  bg-orange-500  text-white  py-2  px-4  rounded-lg  hover:bg-orange-600"
                    >
                        <span className=" text-xl" ><BiPlus /></span>
                        <span>Add Request</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className=" w-full  z-0">
                <table className=" min-w-full  bg-white  shadow  rounded-lg  z-0">
                    <thead>
                        <tr className=" border-b">
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">
                                <input type="checkbox" className=" form-checkbox" />
                            </th>
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">Requested by</th>
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">Customer Name</th>
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">Service</th>
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">Purpose</th>
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">Required by</th>
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">Required Qty</th>
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">Recipient Contact</th>
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">Recipient Address</th>
                            <th className=" p-4  text-left  text-xs  opacity-[70%]">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedRequests.map((request) => (
                            <tr
                                key={request.id}
                                className="border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigator('/customer_portal/material-request-details')}
                            >
                                <td className=" p-4">
                                    <input type="checkbox" className=" form-checkbox" />
                                </td>
                                <td className=" p-4  text-xs  opacity-[100%]">{request.requestedBy}</td>
                                <td
                                    onClick={handlMaterialRequestDetails}
                                    className=" p-4  text-xs  opacity-[70%]  cursor-pointer  text-black hover: underline ">
                                    {request.customerName}
                                </td>
                                <td className=" p-4  text-xs  opacity-[70%]">{request.service}</td>
                                <td className=" p-4  text-xs  opacity-[70%]">{request.purpose}</td>
                                <td className=" p-4  text-xs  opacity-[70%]">{request.requiredBy}</td>
                                <td className=" p-4  text-xs  opacity-[70%]">{request.requiredQty}</td>
                                <td className=" p-4  text-xs  opacity-[70%]">{request.recipientContact}</td>
                                <td className=" p-4  text-xs  opacity-[70%]">{request.recipientAddress}</td>
                                <td className=" p-4  text-xs">
                                    <span
                                        className={` px-3  py-1  rounded-lg  text-sm  font-medium ${getStatusClass(
                                            request.status
                                        )}  opacity-[70%]`}
                                    >
                                        {request.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className=" flex  justify-between  items-center  mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className=" px-4  py-2  border  rounded-lg  bg-gray-100  text-gray-700  disabled: opacity-50"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span className=" text-sm  font-medium">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className=" px-4  py-2  border  rounded-lg  bg-gray-100  text-gray-700  disabled: opacity-50"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MaterialRequestList;
