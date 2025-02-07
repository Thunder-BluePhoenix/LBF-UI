import { CiDeliveryTruck, CiGift } from "react-icons/ci";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useDataContext } from "../../../Context/DataProvider";

// Type definitions for clarity
interface Reading {
    status: string;
    specification: string;
    reading_name: string;
    reading_value: string;
}

interface QualityInspectionData {
    status: string;
    item_code: string;
    item_name: string;
    custom_accepted_qty: number;
    custom_rejected_qty: number;
    modified: string;
    inspection_type: string;
    readings: Reading[];
}

interface Item {
    quality_inspection_data: QualityInspectionData;
}

interface Message {
    name: string;
    customer: string;
    posting_date: string;
    items: Item[];
}

const QualityInspectionData = () => {
    const { id } = useParams<{ id: string }>();
    const { apiData } = useDataContext();

    // Safely accessing `messageData`
    const messageData: Message | null = apiData?.message?.find((item: Message) => item.name === id) || null;

    if (!messageData) {
        return <div>Loading...</div>;
    }

    console.log(messageData, "ttf");

    // Safely accessing nested properties
    const firstItem = messageData?.items?.[0]?.quality_inspection_data || null;
    const status = firstItem?.status || "N/A";
    const itemCode = firstItem?.item_code || "N/A";
    const itemName = firstItem?.item_name || "N/A";
    const itemAccepted = firstItem?.custom_accepted_qty || "N/A";
    const itemRejected = firstItem?.custom_rejected_qty || "N/A";
    const itemModified = firstItem?.modified || "N/A";
    const itemInspection = firstItem?.inspection_type || "N/A";
    const readings = firstItem?.readings || [];

    console.log(readings, "reading data");

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'text-green-500 bg-green-100 border border-green-500';
            case 'Open':
                return 'text-orange-500 bg-orange-100 border border-orange-500';
            case 'Under QC':
                return 'text-violet-500 bg-violet-100 border border-violet-500';
            case 'Cancelled':
                return 'text-red-500 bg-red-100 border border-red-500';
            default:
                return 'text-gray-500 bg-gray-100 border border-gray-500';
        }
    };

    console.log("Message Data:", messageData);

    return (
        <div className="p-6 min-h-screen">
            {messageData.items.map((item, index) => (
            <div  key={index}className="max-w-6xl mx-auto bg-white border border-gray-100 rounded-lg shadow-lg p-8 pt-0">
                {/* Tabs Navigation */}
                <div className="max-w-[50%] flex flex-row gap-4 p-4 pl-0">
                    <NavLink
                        to={`/customer_portal/bill-of-landing-ditails/${id}`}
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
                        to={`/customer_portal/quality-inspection-data/${id}`}
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
                        to={`/customer_portal/serial-batch-no/${id}`}
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

                <Outlet />

                {/* Header Section */}
                <div className="border-b border-gray-300 mx-4 py-4">
                    <h2 className="text-xl">Quality Inspection</h2>
                </div>
                <div className="flex items-center justify-between p-4">
                    <div className="flex flex-row gap-2">
                        <img
                            src="https://www.shutterstock.com/shutterstock/photos/2278726727/display_1500/stock-vector-minimalistic-circular-logo-sample-vector-2278726727.jpg"
                            alt="Company Logo"
                            className="h-12 w-12 rounded-full"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-2xl">Quality Inspection</h1>
                            <p className="text-sm">{messageData?.customer}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-end">
                        <span
                            className={`px-3 max-w-20 flex justify-center py-1 rounded-lg text-xs ${getStatusClass(status)}`}>
                            {status}
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
                                        3243
                                    </p>
                                </div>
                                <div>
                                    <p className="">Shipment ID</p>
                                    <p className="text-xs flex flex-row items-center gap-2">
                                        <CiDeliveryTruck />
                                        545444
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl">
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            <div className="flex flex-row">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Item-Code</span>
                                    <span className="text-sm  text-gray-500">{itemCode}</span>
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Item-Name</span>
                                    <span className="text-sm  text-gray-500">{itemName}</span>
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Warehouse</span>
                                    <span className="text-sm  text-gray-500">N/A</span>
                                </div>
                            </div>
                        </div>
                        <hr className="mb-4 text-gray-300"></hr>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            <div className="flex flex-row">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Type of Transaction</span>
                                    <span className="text-sm  text-gray-500">{itemInspection}</span>
                                </div>
                            </div>
                            {/* <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Supplier Delivery Note</span>
                                    <span className="text-sm  text-gray-500">N/A</span>
                                </div>
                            </div> */}

                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Accepted Qty</span>
                                    <span className="text-sm  text-gray-500">{itemAccepted}</span>
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Rejected Qty</span>
                                    <span className="text-sm  text-gray-500">{itemRejected}</span>
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4">&nbsp;</div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Updated Date</span>
                                    <span className="text-sm  text-gray-500">{itemModified}</span>
                                </div>
                            </div>
                        </div>
                        <hr className="mb-4 text-gray-300"></hr>
                        {/* Display readings if available */}
                        <div>
<h2 className="text-lg font-semibold mb-4">Readings</h2>
<div className="overflow-x-auto">
    <table className="w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-4 py-2 border-b border-gray-300">Serial No.</th>
                <th className="px-4 py-2 border-b border-gray-300">Parameter</th>
                <th className="px-4 py-2 border-b border-gray-300">Status</th>
                <th className="px-4 py-2 border-b border-gray-300">Reading Values</th>
            </tr>
        </thead>
        <tbody>
           
            {readings.length > 0 ? readings.map((row, index)  => (
                <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                        {index + 1}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                        {row.specification || 'N/A'}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                        {row.status || 'N/A'}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                        {row.reading_value || 'N/A'}
                    </td>
                </tr>
            )) : <p>No readings available.</p>}
        </tbody>
    </table>
</div>
                       
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
    );
};

export default QualityInspectionData;












