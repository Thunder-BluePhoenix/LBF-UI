import { CiDeliveryTruck, CiGift } from "react-icons/ci"
import { NavLink, Outlet } from "react-router-dom";






const Q = () => {

    const tabs = [
        { name: "Bill of landing", path: "/customer_portal" },
        { name: "Quality Inspection", path: "/customer_portal/quality-inspection" },
        { name: "Serial & Batch no.", path: "/customer_portal/serial-batch-no" },
      ];

return (
    <div className="p-6 min-h-screen">
    <div className="max-w-6xl mx-auto bg-white border border-gray-100 rounded-lg shadow-lg p-8 pt-0">
    <div className="max-w-[50%] flex flex-row gap-4 p-4 pl-0">
  {tabs.map((tab, index) => (
    <NavLink
      key={index}
      to={tab.path}
      className={({ isActive }: { isActive: boolean }) =>
        `flex flex-row items-center cursor-pointer ${
          isActive
            ? "border-b-2 border-blue-700 text-blue-700 font-semibold"
            : "text-gray-500"
        }`
      }
    >
      {index !== 0 && (
        <div className="bg-gray-300 h-5 w-[1px] mr-2"></div>
      )}
      <span className="pb-1">{tab.name}</span>
    </NavLink>
  ))}
</div>

<div>
  <Outlet />
</div>
                <div className="border-b border-gray-300 mx-4 py-4">
                    <h2 className="text-xl">Quality Inspection</h2>
                </div>
                {/* Header Section */}
                <div className="flex items-center justify-between p-4">
                    <div>
                        <h1 className="text-2xl ">Quality Inspection</h1>
                        <p className="text-sm ">-anil Rajput</p>
                    </div>

                    <div className="flex flex-col justify-end">
                        <span className="w-full flex justify-end">Test</span>
                        <span>12-Nov-2024, 08:00 PM</span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="border border-gray-300 p-4 rounded-xl">
                    <div className="w-full mb-4">
                        <div className=" flex  flex-col  gap-6">
                            <div className=" flex  flex-row  bg-gray-50  max-w-[40%] gap-8 rounded-xl  justify-start  p-6  items-center ">
                                <div className="">
                                    <p className=" text-sm">Request ID</p>
                                    <p className=" text-xs  flex  flex-row  items-center  gap-2"><CiGift />3243</p>
                                </div>
                                <div>
                                    <p className="">Shipment ID</p>
                                    <p className=" text-xs  flex  flex-row  items-center  gap-2"><CiDeliveryTruck />545444</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl">
                        <div className="grid grid-cols-6 gap-2 mb-6">
                            <div className="flex flex-row">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>
                        </div>
                        <hr className="mb-4 text-gray-300"></hr>
                        <div className="grid grid-cols-6 gap-2 mb-6">
                            <div className="flex flex-row">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>
                        </div>
                        <hr className="mb-4 text-gray-300"></hr>
                        <div className="grid grid-cols-6 gap-2 mb-6">
                            <div className="flex flex-row">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="bg-gray-300 h-10 w-[1px] mr-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium ">Service</span>
                                    <span className="text-sm  text-gray-500">items</span>
                                </div>
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
                                        <th className="px-4 py-2  border-b border-gray-300">Item Name</th>
                                        <th className="px-4 py-2 border-b border-gray-300">Item Code</th>
                                        <th className="px-4 py-2 border-b border-gray-300">Total Qty</th>
                                        <th className="px-4 py-2 border-b border-gray-300">Accepted Qty</th>
                                        <th className="px-4 py-2 border-b border-gray-300">Rejected Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Loop through items to display each item's details */}

                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            MRF
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            BCS9273
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            23
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            MB22
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            21
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            MRF
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            BCS9273
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            23
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            MB22
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-gray-700">
                                            21
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Q;
