import { CiDeliveryTruck, CiGift } from "react-icons/ci";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useDataContext } from "../../../Context/DataProvider";


interface Item {
  qty: string;
  name: string;
  item_code: string;
  item_name: string;
  total_qty: string;
  accepted_qty: string;
  rejected_qty: string;
}

interface Message {
  name: string;
  customer: string;
  party_type: string;
  service: string;
  posting_date: string;
  total_qty: string;
  total_qty_accepted: string;
  total_qty_rejected: string;
  reference_material_request: string | null;
  reference_shipment_id: string | null;
  customer_address: string | null;
  address: string | null;
  customer_contact: string | null;
  contact: string | null;
  shipping_to: string | null;
  customer_shipping_address: string | null;
  shipping_address: string | null;
  transporter_name: string | null;
  transporter_address: string | null;
  transporter_contact: string | null;
  transport_contact: string | null;
  docstatus: number;
  status: string;
  items: Item[
  ];
}


const BillOfLandingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { apiData } = useDataContext();

  const messageData: Message | null = 
  (Array.isArray(apiData?.message) ? apiData.message.find(
    (item: Message) => item.name === id
  ) : null) || null;

  if (!messageData) {
    return <div>Loading...</div>;
  }
  

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
  return (
    <div className="p-4 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white border border-gray-100 rounded-lg p-8 pt-0">
        {/* Tabs Navigation */}
        <div className="max-w-[50%] flex flex-row gap-4 p-4 pl-0">
          <NavLink
            to={(`/customer_portal/bill-of-landing-ditails/${id}`)}
            className={({ isActive }: { isActive: boolean }) =>
              `flex flex-row items-center cursor-pointer ${isActive
                ? "border-b-2 border-blue-700 text-blue-700 font-semibold"
                : "text-gray-500"
              }`
            }
          >
            <span className="pb-1">Bill of Landing</span>
          </NavLink>
          <div className="bg-gray-300 h-5 w-[1px] mr-2"></div>
          <NavLink
            to={(`/customer_portal/quality-inspection-data/${id}`)}
            className={({ isActive }: { isActive: boolean }) =>
              `flex flex-row items-center cursor-pointer ${isActive
                ? "border-b-2 border-blue-700 text-blue-700 font-semibold"
                : "text-gray-500"
              }`
            }
          >
            <span className="pb-1">Quality Inspection</span>
          </NavLink>
          <div className="bg-gray-300 h-5 w-[1px] mr-2"></div>
          <NavLink
            to={(`/customer_portal/serial-batch-no/${id}`)}
            className={({ isActive }: { isActive: boolean }) =>
              `flex flex-row items-center cursor-pointer ${isActive
                ? "border-b-2 border-blue-700 text-blue-700 font-semibold"
                : "text-gray-500"
              }`
            }
          >
            <span className="pb-1">Serial & Batch no.</span>
          </NavLink>
        </div>

        <hr className="text-gray-300"></hr>
        {/* Outlet for nested routes */}
        <div>
          <Outlet />
        </div>

        {/* Header Section */}
        <div className="border-b border-gray-300 mx-4 py-4">
          <h2 className="text-xl">Bill of Landing</h2>
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-row gap-2">
            <img
              src="https://www.shutterstock.com/shutterstock/photos/2278726727/display_1500/stock-vector-minimalistic-circular-logo-sample-vector-2278726727.jpg"
              alt="Company Logo"
              className="h-12 w-12 rounded-full"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl">Bill of Landing</h1>
              <p className="text-sm">{messageData?.customer}</p>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <span
              className={`px-3 max-w-20 flex justify-center py-1 rounded-lg text-xs ${getStatusClass(
                messageData?.status // Assuming status is taken from the first item
              )}`}
            >
              {messageData?.status}
            </span>
            <span>{messageData?.posting_date}</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="border border-gray-300 p-4 rounded-xl">
          <div className="w-full mb-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-row bg-gray-50 max-w-[40%] gap-8 rounded-xl justify-start p-6 items-center">
                <div>
                  <p className="text-sm">Request ID</p>
                  <p className="text-xs flex flex-row items-center gap-2">
                    <CiGift />
                    {messageData.reference_material_request || "Not Available"}
                  </p>
                </div>
                <div>
                  <p className="">Shipment ID</p>
                  <p className="text-xs flex flex-row items-center gap-2">
                    <CiDeliveryTruck />
                  {messageData.reference_shipment_id || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="grid grid-cols-5 gap-2 mb-6">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <span className="text-sm font-medium ">Recipient</span>
                  <span className="text-sm  text-gray-500">{messageData?.shipping_to || "Not Available"}</span>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium ">Pick up Date</span>
                  <span className="text-sm  text-gray-500">{messageData?.posting_date}</span>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium ">Service</span>
                  <span className="text-sm  text-gray-500">{messageData?.service}</span>
                </div>
              </div>
            </div>
            <hr className="mb-4 text-gray-300"></hr>
            <div className="grid grid-cols-5 gap-2 mb-6">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <span className="text-sm font-medium ">Contact no.</span>
                  <span className="text-sm  text-gray-500">{messageData?.contact || "Not Available"}</span>
                </div>
              </div>
              <div className="flex flex-row">
              <div className="bg-gray-300 h-10 w-[1px] mr-4">&nbsp;</div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium ">Email ID</span>
                  <span className="text-sm  text-gray-500">test@gmail.com</span>
                </div>
              </div>
              
              <div className="flex flex-row">
                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium ">Required Tyres</span>
                  <span className="text-sm  text-gray-500">{messageData?.reference_material_request || "Not Available"}</span>
                </div>
              </div>
            </div>
            <hr className="mb-4 text-gray-300"></hr>
            <div className="grid grid-cols-5 gap-2 mb-6">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <span className="text-sm font-medium ">Address</span>
                  <span className="text-sm  text-gray-500">{messageData?.address || "Not Available"}</span>
                </div>
              </div>
             
              <div className="flex flex-row">
              </div>
            </div>
          </div>

          {/* Items Table Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border-b border-gray-300">
                      Item Name
                    </th>
                    <th className="px-4 py-2 border-b border-gray-300">
                      Item Code
                    </th>
                    <th className="px-4 py-2 border-b border-gray-300">
                      Total Qty
                    </th>
                    <th className="px-4 py-2 border-b border-gray-300">
                      Accepted Qty
                    </th>
                    <th className="px-4 py-2 border-b border-gray-300">
                      Rejected Qty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Loop through items */}
                  {messageData?.items.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b border-gray-300 text-gray-700">{row.item_name}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-gray-700">{row.item_code}</td>
                       {messageData?.service === "Pneus Hub" && (<td className="px-4 py-2 border-b border-gray-300 text-gray-700">{row.total_qty}</td>)}
                       {messageData?.service === "Tyre Hotel" && (<td className="px-4 py-2 border-b border-gray-300 text-gray-700">{row.qty}</td>)}
                      <td className="px-4 py-2 border-b border-gray-300 text-gray-700">{row.accepted_qty}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-gray-700">{row.rejected_qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillOfLandingDetails;
