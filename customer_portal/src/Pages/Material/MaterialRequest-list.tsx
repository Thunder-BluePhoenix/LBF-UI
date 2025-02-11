import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { BiEdit, BiPlus, BiSearch } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router';

interface Request {
    contact: string;
    address: string;
    name: string;
    owner: string;
    service: string;
    customer: string;
    address_of_customer: string;
    total_qty: number;
    schedule_date: string | null;
    material_request_type: string;
    docstatus: number;
    id: string; // Added unique identifier for each request
}

const MaterialRequestList: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [requestList, setRequestList] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 10;
    console.log(requestList,"materialrequest")
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/resource/Material%20Request%20Instruction%20Log?fields=["*"]&limit_page_length=1000');
              
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                if (data && data.data) {
                    setRequestList(data.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching material requests:', error);
                setError('Failed to load requests. Please try again later.');
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const filteredRequests = requestList.filter(
        (request) =>
            (request.customer?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (request.service?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (request.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (request.material_request_type?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const getStatusClass = (docstatus: number) => {
        const status = getStatusFromNumber(docstatus);
        switch (status) {
            case 'Open':
                return 'text-green-500 bg-green-100 border border-green-500';
            case 'Draft':
                return 'text-yellow-500 bg-yellow-100 border border-yellow-500';
            default:
                return 'text-gray-500 bg-gray-100 border border-gray-500';
        }
    };

    const getStatusFromNumber = (docstatus: number) => {
        switch (docstatus) {
            case 0:
                return 'Open';
            case 1:
                return 'Draft';
            default:
                return 'Unknown';
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleRedirectToRedeliveryRequest = () => {
        navigate('/customer_portal/material-request-form');
    };

    const handleRedirectToMaterialDetails = (id: string) => {
        navigate(`/customer_portal/material-request-details/${id}`);  // Add the id to the URL
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

    if (loading) return <p>Loading requests...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4 w-full">
            {/* Header and Search */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                    <div
                        onClick={() => navigate(-1)}
                        className="p-[10px] border rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg"
                    >
                        <span className="text-xl"><FiArrowLeft /></span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold">Request List</h1>
                        <span className="text-gray-500 text-xs">PH & TH Request list</span>
                    </div>
                </div>

                <div className="flex items-center flex-row space-x-2">
                    <div className="relative w-96">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                            <BiSearch />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by order id, material name"
                            className="border border-gray-300 rounded-lg pl-10 pr-10 py-2 w-full"
                        />
                        {searchQuery && (
                            <span
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
                            >
                                <AiFillCloseCircle />
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleRedirectToRedeliveryRequest}
                        className="flex items-center space-x-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
                    >
                        <span className="text-xl"><BiPlus /></span>
                        <span>Add Request</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            {paginatedRequests.length > 0 ? (
                <div className="w-full">
                    <table className="min-w-full bg-white shadow rounded-lg">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="p-4 text-left text-xs opacity-[70%]">
                                    <input type="checkbox" className="form-checkbox" />
                                </th>
                                <th className="p-4 text-left text-xs opacity-[70%]">Requested by</th>
                                <th className="p-4 text-left text-xs opacity-[70%]">Customer Name</th>
                                <th className="p-4 text-left text-xs opacity-[70%]">Service</th>
                                <th className="p-4 text-left text-xs opacity-[70%]">Material Request Type</th>
                                <th className="p-4 text-left text-xs opacity-[70%]">Total Quantity</th>
                                <th className="p-4 text-left text-xs opacity-[70%]">Recipient Contact</th>
                                <th className="p-4 text-left text-xs opacity-[70%]">Recipient Address</th>
                                <th className="p-4 text-left text-xs opacity-[70%]">Status</th>
                                <th className="p-4 text-left text-xs opacity-[70%]">Edit</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedRequests.map((request) => (
                                <tr
                                    key={request.name}  // Unique key
                                    className="border-b border-gray-300 hover:bg-gray-100 "
                                   // Redirect to material details page
                                >
                                    <td className="p-4">
                                        <input type="checkbox" className="form-checkbox" />
                                    </td>
                                    <td  className="p-4 text-xs">{request.customer || "Not available"}</td>
                                    <td
                                    onClick={() => handleRedirectToMaterialDetails(request.name)}
                                     className="p-4 text-xs text-black cursor-pointer hover:underline">
                                        {request.customer || "Not available"}
                                    </td>
                                    <td className="p-4 text-xs">{request.service || "Not available"}</td>
                                    <td className="p-4 text-xs">{request.material_request_type || "Not available"}</td>
                                    <td className="p-4 text-xs">{request.total_qty || "Not available"}</td>
                                    <td className="p-4 text-xs">{request.contact || "Not available"}</td>
                                    <td className="p-4 text-xs">{request.address || "Not available"}</td>
                                    <td className="p-4 text-xs">
                                        <span
                                            className={`px-3 py-1 rounded-lg text-xs border ${getStatusClass(request.docstatus)}`}
                                        >
                                            {getStatusFromNumber(request.docstatus)}
                                        </span>
                                    </td>
                                    <td 
                                    
                                    className="p-4 text-xl text-gray-500 cursor-pointer"><BiEdit /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No requests found</p>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-500">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-xs bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-xs bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaterialRequestList;
