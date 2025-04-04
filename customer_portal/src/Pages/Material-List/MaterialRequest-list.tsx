import React, { useEffect, useState, useRef } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { BiPlus, BiSearch } from 'react-icons/bi';
import { AiFillCloseCircle, } from 'react-icons/ai';
import { CiDeliveryTruck } from 'react-icons/ci';
import { useNavigate } from 'react-router';

interface Request {
    required_qty_th: string;
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
    id: string;
}

const MaterialRequestList: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [requestList, setRequestList] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const itemsPerPage = 10;

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);


    const handleRedirect = (path: string) => {
        navigate(path);
        setDropdownOpen(false);
    };
    const handleTyreHotelRedelivery = () => {
        const purpose = "Redelivery";
        const service = "Tyre Hotel";
        const modalMaterialListForTh = true;
    
        const queryParams = new URLSearchParams({
          purpose,
          service,
          "modal-material-list-for-th": modalMaterialListForTh.toString(),
        }).toString();
    
        navigate(`/customer_portal/material-request-form?${queryParams}`);
        setDropdownOpen(false);
      };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/resource/Material%20Request%20Instruction%20Log?fields=["*"]&limit_page_length=1000');

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                if (data && data.data) {
                    const reversData = data.data.reverse()
                    setRequestList(reversData);
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
                return 'text-blue-500 bg-blue-100 ';
            case 'Submitted':
                return 'text-green-500 bg-green-100';
            case 'Cancelled':
                return 'text-red-500 bg-red-100 ';
            default:
                return 'text-gray-500 bg-gray-100 ';
        }
    };

    const getStatusFromNumber = (docstatus: number) => {
        switch (docstatus) {
            case 0:
                return 'Open';
            case 1:
                return 'Submitted';
            case 2:
                return 'Cancelled';
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleRedirectToMaterialDetails = (id: string) => {
        navigate(`/customer_portal/material-request-details/${id}`);
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
        <div className="w-full shadow">
            {/* Header and Search */}
            <div className="flex p-4 items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                    <div
                        onClick={() => navigate(-1)}
                        className="p-[10px] border border-gray-300 rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg"
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
                    <div className="relative">
                        <button
                            ref={buttonRef}
                            onClick={toggleDropdown}
                            className="flex items-center space-x-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
                            <span className="text-xl"><BiPlus /></span>
                            <span>Add Request</span>
                        </button>

                        {dropdownOpen && (
                            <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-85 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 overflow-hidden"
                            >
                                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                                    <h3 className="font-medium text-sm text-gray-700">Create New</h3>
                                </div>

                                <div className="py-1">



                                    <div className="transition-all duration-300 ease-in-out">
                                        <button
                                            onClick={() =>
                                                handleRedirect("/customer_portal/material-request-form?purpose=Redelivery&service=Peneus Hub")
                                            }
                                            className="flex items-center w-full px-8 py-2 gap-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <CiDeliveryTruck />
                                            Request For Redelivery - Peneus Hub
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleRedirect("/customer_portal/material-request-form?purpose=Pick Up&service=Tyre Hotel")
                                            }
                                            className="flex items-center w-full px-8 py-2 gap-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <CiDeliveryTruck />
                                            Request For Pickup - Tyre Hotel
                                        </button>
                                        <button
                                            onClick={handleTyreHotelRedelivery}
                                            className="flex items-center w-full px-8 py-2 gap-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <CiDeliveryTruck />
                                            Request For Redelivery - Tyre Hotel
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rest of the existing code remains the same */}
            {/* Table */}
            {paginatedRequests.length > 0 ? (
                <div className="w-full">
                    <table className="min-w-full bg-white ">
                        <thead className='bg-gray-50 border-t border-gray-300'>
                            <tr className="border-b border-gray-300">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested by</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material Request Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedRequests.map((request) => (
                                <tr
                                    onClick={() => handleRedirectToMaterialDetails(request.name)}
                                    key={request.name}
                                    className="border-b border-gray-300 cursor-pointer hover:bg-gray-100 "
                                >
                                    <td className="px-6 py-2 text-xs text-gray-800 font-bold">{request.customer || "Not available"}</td>
                                    <td
                                        
                                        className="px-6 py-4 text-xs  text-black">
                                        {request.customer || "Not available"}
                                    </td>
                                    <td className="px-6 py-4 block truncate max-w-[15rem] text-gray-600 text-xs">{request.service || "Not available"}</td>
                                    <td className="px-6 py-4 text-gray-600 text-xs">{request.material_request_type || "Not available"}</td>
                                    {request.service === "Peneus Hub" && (<td className="px-6 py-4 text-gray-600 text-xs">{request.total_qty || "Not available"}</td>)}
                                    {request.service === "Tyre Hotel" && (<td className="px-6 py-4 text-gray-600 text-xs">{request.required_qty_th || "Not available"}</td>)}
                                    <td className="px-6 py-4 text-gray-600 text-xs">{request.contact || "Not available"}</td>
                                    <td className="px-6 py-4 text-gray-600 text-xs relative group">
                                        <span className="block truncate max-w-[15rem]">
                                            {request.address ? request.address : "Not available"}
                                        </span>
                                        {request.address && (
                                            <span className="hidden group-hover:block absolute bg-white border p-2 rounded-lg shadow-lg text-sm top-8 left-0 z-10">
                                                {request.address}
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-xs">
                                        <span
                                            className={`px-3 py-1 rounded-lg text-xs  ${getStatusClass(request.docstatus)}`}
                                        >
                                            {getStatusFromNumber(request.docstatus)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No requests found</p>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center p-4  ">
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