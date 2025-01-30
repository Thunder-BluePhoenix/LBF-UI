import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';



interface Request {
  name: string;
  customer: string;
  customer_address: string | null;
  customer_shipping_address: string | null;
  posting_date: string;
  total_qty: string;
  total_qty_accepted: string;
  total_qty_rejected: string;
  service: string;
  status: string;

}

const BloList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        '/api/method/lbf_logistica.api.bol.get_bill_of_landing'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.message || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Closed':
        return ' text-green-500  bg-green-100  border  border-green-500';
      case 'Open':
        return ' text-orange-500  bg-orange-100  border  border-orange-500';
      case 'Under QC':
        return ' text-violet-500  bg-violet-100  border  border-violet-500';
      case 'Cancelled':
        return ' text-red-500  bg-red-100  border  border-red-500';
      default:
        return ' text-gray-500  bg-gray-100  border  border-gray-500';
    }
  };

  const filteredRequests = data.filter(
    (request) =>
      request.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-12 mb-2">
        <div className="flex items-center space-x-4">
          <div
            onClick={handleGoBack}
            className="p-[7px] border border-gray-500  rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg"
          >
            <span className="text-xl">
              <FiArrowLeft />
            </span>
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">Bill of Landing List</h1>
            <span className="text-gray-500 text-xs">
              All the BOL are here to access
            </span>
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
              placeholder="Search by invoice id"
              className="border border-gray-300 rounded-lg pl-10 pr-10 py-2 w-full"
            />
            {searchQuery && (
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
                onClick={handleClearSearch}
              >
                <AiFillCloseCircle />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full py-4">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="border-b border-b-gray-300 bord">
              <th className="p-4 text-left text-xs opacity-[70%]">Serial no.</th>
              <th className="p-4 text-left text-xs opacity-[70%]">Bol ID</th>
              <th className="p-4 text-left text-xs opacity-[70%]">Customer Name</th>
              <th className="p-4 text-left text-xs opacity-[70%]">Service</th>
              <th className="p-4 text-left text-xs opacity-[70%]">Posting Date</th>
              <th className="p-4 text-left text-xs opacity-[70%]">Total Qty</th>
              <th className="p-4 text-left text-xs opacity-[70%]">Accepted Qty</th>
              <th className="p-4 text-left text-xs opacity-[70%]">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRequests.map((request, index) => (
              <tr
                key={request.name}
                className="border-b border-b-gray-300  hover:bg-gray-100 cursor-pointer"
              >
                <td className="p-4 text-xs opacity-[70%]">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="p-4 text-xs opacity-[100%]">{request.name}</td>
                <td className="p-4 text-xs opacity-[70%] text-black hover:underline cursor-pointer">
                  {request.customer}
                </td>
                <td className="p-4 text-xs opacity-[70%]">{request.service}</td>
                <td className="p-4 text-xs opacity-[70%]">{request.posting_date}</td>
                <td className="p-4 text-xs opacity-[70%]">{request.total_qty}</td>
                <td className="p-4 text-xs opacity-[70%]">{request.total_qty_accepted}</td>
                <td className="p-4 text-xs">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs ${getStatusClass(
                      request.status // Assuming status is taken from the first item
                    )}`}
                  >
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="px-4 text-sm py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BloList;

