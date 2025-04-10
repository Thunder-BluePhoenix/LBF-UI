import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';



interface Request {
  total_tyres_without_rim: string;
  total_tyres_with_rim: string;
  total_qty_th: string;
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

const BillOfLandingList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  console.log(data, "bill of landing ")
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

  const handleBillOfLanding = (id: string) => {
    navigate(`/customer_portal/bill-of-landing-ditails/${id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const getColorByLetter = (letter: string | undefined) => {
    if (!letter) return "bg-gray-400";

    const char = letter.toUpperCase();
    switch (char) {
      case "A": case "B": case "C": return "bg-red-500";
      case "D": case "E": case "F": return "bg-green-500";
      case "G": case "H": case "I": return "bg-blue-500";
      case "J": case "K": case "L": return "bg-yellow-500";
      case "M": case "N": case "O": return "bg-purple-500";
      case "P": case "T": case "R": return "bg-pink-500";
      case "S": case "Q": case "U": return "bg-indigo-500";
      case "V": case "W": case "X": case "Y": case "Z": return "bg-teal-500";
      default: return "bg-gray-400";
    }
  };


  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Closed':
        return ' text-green-500  bg-green-100 ';
      case 'Open':
        return ' text-orange-500  bg-orange-100  ';
      case 'Under QC':
        return ' text-violet-500  bg-violet-100  ';
      case 'Cancelled':
        return ' text-red-500  bg-red-100  ';
      default:
        return ' text-gray-500  bg-gray-100 ';
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
    <div className="w-full shadow rounded-lg py-4">
      <div className="flex px-4 items-center gap-12  mb-2">
        <div className="flex items-center space-x-4">
          <div
            onClick={handleGoBack}
            className="p-[7px] border border-gray-300  rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg"
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
              placeholder="Search by BOL id"
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
        <table className="min-w-full bg-white  rounded ">
          <thead className=''>
            <tr className="border-b border-gray-300">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Serial no.</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Bol ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Posting Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Qty</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Accepted Qty</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRequests.map((request, index) => (

              <tr
                key={request.name}
                onClick={() => handleBillOfLanding(request.name)}
                className="border-b border-b-gray-300  hover:bg-gray-100 cursor-pointer"
              >
                <td className="px-6 py-3 text-xs opacity-[70%]">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td

                  className="px-6 py-3 text-xs opacity-[100%]">{request.name}</td>
                <td className="px-6 py-3 text-xs opacity-[70%] text-black hover:underline cursor-pointer flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full text-white flex items-center justify-center text-[8px] font-semibold
      ${getColorByLetter(request.customer?.charAt(0))}`}
                  >
                    {request.customer?.charAt(0)}
                  </div>
                  {request.customer}
                </td>


                <td className="px-6 py-3 text-xs opacity-[70%]">{request.service}</td>
                <td className="px-6 py-3 text-xs opacity-[70%]">{request.posting_date}</td>
                {request.service === "Peneus Hub" && (<td className="px-6 py-3 text-xs opacity-[70%]">{request.total_qty}</td>)}
                {request.service === "Tyre Hotel" && (<td className="px-6 py-3 text-xs opacity-[70%]">{request.total_qty_th}</td>)}
                {request.service === "Peneus Hub" && (<td className="px-6 py-3 text-xs opacity-[70%]">{request.total_qty_accepted}</td>)}
                {request.service === "Tyre Hotel" && (<td className="px-6 py-3 text-xs opacity-[70%]">{Number(request.total_tyres_without_rim) + Number(request.total_tyres_with_rim)}</td>)}
                <td className="px-6 py-3 text-xs">
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
      <div className="flex justify-center bg-gray-50 space-x-2">
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

export default BillOfLandingList;

