import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from './../../../Context/DataProvider';

interface MaterialRequestLog {
  name: string;
  license_plate: string;
  transaction_date: string;
  material_request_doc: string;
  type?: string;
  request_type?: string;
  status?: string;
}

interface ApiResponse {
  message: MaterialRequestLog[];
  error?: string;
}

const ModalMaterialListForTH: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Open the modal by default
  const [logs, setLogs] = useState<MaterialRequestLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedItemId, setSelectedItemId, setLicensePlateFilter } = useDataContext(); // Include setLicensePlateFilter
  
  const [licensePlateFilter, setLocalLicensePlateFilter] = useState<string>('');
  const [transactionDateFilter, setTransactionDateFilter] = useState<string>('');
  const [materialRequestDocFilter, setMaterialRequestDocFilter] = useState<string>('');
  const navigate = useNavigate();
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    navigate(`/customer_portal/material-request-form?purpose=Redelivery&service=Tyre Hotel`);
  };

  useEffect(() => {
    const fetchMaterialRequestLogs = async () => {
      try {
        const response = await fetch('/api/method/lbf_logistica.api.bol.get_material_request_logs_by_customer?customer=Tushar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        
        if ('error' in data) {
          throw new Error(data.error);
        }

        setLogs(data.message || []); 
        setIsLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred';
        
        console.error("Failed to fetch material request logs:", error);
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    fetchMaterialRequestLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      (log.license_plate || '').toLowerCase().includes(licensePlateFilter.toLowerCase()) &&
      (log.transaction_date || '').toLowerCase().includes(transactionDateFilter.toLowerCase()) &&
      (log.material_request_doc || '').toLowerCase().includes(materialRequestDocFilter.toLowerCase())
    );
  }, [logs, licensePlateFilter, transactionDateFilter, materialRequestDocFilter]);

  const handleRowClick = (id: string, licensePlate: string) => {
    setSelectedItemId(id);
    setLicensePlateFilter(licensePlate); // Set license plate filter in context
    navigate(`/customer_portal/material-request-form?purpose=Redelivery&service=Tyre Hotel&license_plate=${licensePlate}`);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading logs...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
    {isModalOpen && (
      <div 
        className="fixed inset-0 bg-[#0000006b] z-50 flex justify-center items-center w-full h-full bg-opacity-50"
        onClick={toggleModal}
      >
        <div 
          className="relative p-4 w-full max-w-4xl max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Material Request Logs
              </h3>
              <button 
                type="button" 
                onClick={toggleModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
  
            <div className="p-4 md:p-5 space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <input 
                  type="text"
                  placeholder="Filter by License Plate"
                  value={licensePlateFilter}
                  onChange={(e) => setLocalLicensePlateFilter(e.target.value)}
                  className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                />
                <input 
                  type="text"
                  placeholder="Filter by Transaction Date"
                  value={transactionDateFilter}
                  onChange={(e) => setTransactionDateFilter(e.target.value)}
                  className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                />
                <input 
                  type="text"
                  placeholder="Filter by Material Request Doc"
                  value={materialRequestDocFilter}
                  onChange={(e) => setMaterialRequestDocFilter(e.target.value)}
                  className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
  
              <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase  bg-gray-50 sticky top-0">
                    <tr>
                      <th scope="col" className="px-6 py-3">Name</th>
                      <th scope="col" className="px-6 py-3">License Plate</th>
                      <th scope="col" className="px-6 py-3">Transaction Date</th>
                      <th scope="col" className="px-6 py-3">Material Request Doc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, index) => (
                      <tr 
                        key={index} 
                        className={`cursor-pointer bg-white border-b border-gray-300 hover:bg-gray-50 ${selectedItemId === log.material_request_doc ? 'bg-blue-100' : ''}`} 
                        onClick={() => handleRowClick(log.material_request_doc, log.license_plate)}
                      >
                        <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap hover:underline">
                          {log.name || 'N/A'}
                        </td>
                        <td className="px-6 py-2">
                          {log.license_plate || 'N/A'}
                        </td>
                        <td className="px-6 py-2">
                          {log.transaction_date || 'N/A'}
                        </td>
                        <td className="px-6 py-2">
                          {log.material_request_doc || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4 md:p-5 border-t border-gray-200 rounded-b">
              <button 
                type="button" 
                className="text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={toggleModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default ModalMaterialListForTH;
