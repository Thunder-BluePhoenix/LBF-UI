import {  useEffect, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { CiDeliveryTruck, CiGift } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";

// Define the types for the API response
interface MaterialRequestItem {
  item_code: string;
  schedule_date: string;
  qty: number;
  uom: string;
}

interface MaterialRequestDetails {
  company: string;
  customer: string;
  transaction_date: string;
  docstatus: number;
  name: string;
  license_plate: string;
  material_request_type: string;
  service: string;
  contact_person: string;
  owner: string;
  required_qty_th: number;
  address_of_customer: string;
  items: MaterialRequestItem[];
}

const MaterialRequestDetails = () => {
  const navigate = useNavigate();
  const [requestDetails, setRequestDetails] = useState<MaterialRequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(`/api/resource/Material Request Instruction Log/${id}?fields=["*"]`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data && data.data) {
          setRequestDetails(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching material request details:', error);
        setError('Failed to load request details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchRequestDetails();
    }
  }, [id]);

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

  if (loading) return <p>Loading request details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 ml-12 bg-white shadow-md rounded-lg">
          <div className="flex items-center justify-between bg-white px-4 pt-4 rounded-lg">
            <h5 className="font-semibold text-sm">Material Request Details</h5>
            <div className="flex flex-row gap-2 items-center">
              <span
                onClick={() => navigate(`/customer_portal/material-request-form/${id}`)}
                className="text-gray-500 text-xl cursor-pointer hover:text-gray-800"
              >
                <BiSolidEdit />
              </span>
            </div>
          </div>
          <hr className="my-1 text-gray-300"></hr>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/64"
                  alt="Logo"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{requestDetails?.company}</h3>
                  <p className="text-gray-500">{requestDetails?.customer}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className={`px-3 py-1 rounded-lg text-xs border ${getStatusClass(requestDetails?.docstatus || 0)}`}
                >
                  {getStatusFromNumber(requestDetails?.docstatus || 0)}
                </span>
                <span className="text-xs text-gray-400">{requestDetails?.transaction_date}</span>
              </div>
            </div>
            <div className="flex flex-col gap-6 border border-gray-300 p-4 rounded-xl">
              <div className="flex flex-row bg-gray-50 min-w-[40%] rounded-xl justify-start gap-4 p-6 items-center">
                <div>
                  <p className="text-sm">Request ID</p>
                  <p className="text-xs flex flex-row items-center gap-2"><CiGift />{requestDetails?.name}</p>
                </div>
                <div>
                  <p className="">Shipment ID</p>
                  <p className="text-xs flex flex-row items-center gap-2"><CiDeliveryTruck />{requestDetails?.license_plate || "N/A"}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="grid grid-cols-5 gap-2 mb-6">
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Delivery Date</span>
                      <span className="text-sm text-gray-500">{requestDetails?.transaction_date || "N/A"}</span>
                    </div>
                  </div>
                  {/* Other columns */}
                </div>
                <hr className="text-gray-300 mb-4"></hr>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Address</span>
                    <span className="text-sm text-gray-500">{requestDetails?.address_of_customer}</span>
                  </div>
                </div>
              </div>

              <div className="container mx-auto">
                <h1 className="text-xl font-bold mb-4">Items</h1>
                <div className="overflow-x-auto rounded">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required By</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {requestDetails?.items?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                          <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap">{index + 1}</td>
                          <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap">{item?.item_code || "N/A"}</td>
                          <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap">{item?.schedule_date || "N/A"}</td>
                          <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap">{item?.qty || "N/A"}</td>
                          <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap">{item?.uom || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialRequestDetails;
