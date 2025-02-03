import React from "react";
import { BsTelephone } from "react-icons/bs";
import { CiDeliveryTruck, CiGift } from "react-icons/ci";
import { useNavigate } from "react-router";

const requestDetails = {
    customerName: "Andrew Sirkis (Customer Name)",
    company: "Raj Industries",
    requestId: "ORDERID001",
    shipmentId: "ORDERID001",
    deliveryDate: "17 July 2024, 18:00",
    purpose: "Pick up",
    service: "Pneuse Hub",
    contact: "07896875764",
    email: "andrewsirkis@gmail.com",
    requiredTyres: 28,
    address: "M.C. GARAGE S.R.L.Via B. Cavaceppi 26, 173782, Italy",
    driverName: "Andrew Sirkis",
    driverContact: "98687674598",
    vehicleNumber: "EV-2017002346",
    estimatedArrival: "12:45pm",
    timeline: [
      { status: "Approved", time: "27/Nov/24 2:30pm" },
      { status: "Loading", time: "27/Nov/24 2:30pm" },
      { status: "Intransit", time: "27/Nov/24 2:30pm" },
      { status: "Closed", time: "27/Nov/24 2:30pm" },
    ],
    locations: [
      { name: "LBF Warehouse", address: "Rd. Santa Ana, Illinois 85486" },
      { name: "8502 Preston", address: "Rd. Inglewood, Maine 98380" },
    ],
  };



const MaterialRequestDetails = () => {
  const navigate = useNavigate();

  return (
    <div className=" p-6  bg-gray-50  min-h-screen  flex  flex-col  gap-6">
  <div className=" grid  grid-cols-3  gap-6">
        
        <div className=" col-span-2  ml-12   bg-white  shadow-md  rounded-lg">
        <div className=" flex  items-center  justify-between  bg-white  px-4  pt-4  rounded-lg ">
        <h5 className="  font-semibold  text-sm">Material Request Details</h5>
        <div
          className=" text-blue-500  hover:underline"
          onClick={() => navigate("/bol")}
        >
          View BOL
        </div>
      </div>
      <hr className=" my-1"></hr>
         <div className="  px-6  py-4">
         <div className=" flex  items-center  justify-between">
            <div className=" flex  items-center  gap-4">
              <img
                src="https://cdn.dribbble.com/userupload/10556461/file/original-58141f3190ba71cd1ee27e322a7df6ab.png?format=webp&resize=400x300&vertical=center"
                alt="Logo"
                className=" w-16  h-16  rounded-full"
              />
              <div>
                <h3 className=" text-xl  font-semibold">{requestDetails.company}</h3>
                <p className=" text-gray-500">-{requestDetails.customerName}</p>
              </div>
            </div>
           <div className=" flex  flex-col  gap-2">
           <span className=" bg-green-100  w-[90px]  text-green-600  border  border-green-600  px-3  py-1  text-sm  rounded-lg">
             Approved
            </span>
            <span className=" text-xs  text-gray-400">17 july 2025,08:20PM</span>
           </div>
          </div>

          {/* Request Details */}
          <div className=" flex  flex-col  gap-6  border  p-4  rounded-xl">
           <div className=" flex  flex-row  bg-gray-50  max-w-[40%]  rounded-xl  justify-between  p-6  items-center ">
           <div className="">
              <p className=" text-sm">Request ID</p>
              <p className=" text-xs  flex  flex-row  items-center  gap-2"><CiGift  />{requestDetails.requestId}</p>
            </div>
            <div>
              <p className="">Shipment ID</p>
              <p className=" text-xs  flex  flex-row  items-center  gap-2"><CiDeliveryTruck />{requestDetails.shipmentId}</p>
            </div>
           </div>




        <div className=" bg-gray-50  rounded-xl   px-4  py-6">
      <div className=" flex  flex-row  gap-4">
      <div className="">
         <p className=" ">Delivery Date</p>
         <p className=" text-xs">{requestDetails.deliveryDate}</p>
         </div>
         <div className=" h-full  w-px  bg-gray-300"></div>
            <div>
              <p className=" ">Purpose</p>
              <p className=" text-xs">{requestDetails.purpose}</p>
            </div>
            <div>
              <p className="">Service</p>
              <p className=" text-xs">{requestDetails.service}</p>
            </div>
      </div>
      <hr>
      </hr>
           <div className=" flex  flex-row  gap-6">
           <div>
              <p className=" ">Contact no.</p>
              <p className=" text-xs">{requestDetails.contact}</p>
            </div>
            <div>
              <p className=" ">Email ID</p>
              <p className=" text-xs">{requestDetails.email}</p>
            </div>
            <div>
              <p className="">Required Tyres</p>
              <p className=" text-xs">{requestDetails.requiredTyres}</p>
            </div>
           </div>
         <hr></hr>

          <div className=" mt-4">
            <p className=" ">Address</p>
            <p className=" text-xs">{requestDetails.address}</p>
          </div>
          </div>
        

          {/* Timeline */}
          <div className=" mt-6">
            <h3 className=" font-bold  text-lg  mb-2">Timeline</h3>
            <div className=" flex  items-center  bg-gray-50  p-6  rounded-xl  gap-8">
              {requestDetails.timeline.map((item: { status: string | number | boolean | React.ReactElement< string > | Iterable<React.ReactNode> | null | undefined; time: string | number | boolean | React.ReactElement | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                <div
                  key={index}
                  className=" flex  flex-col  items-center  text-center"
                >
                  <div
                    className={` w-6  h-6  rounded-full  border-4  mb-2 ${
                      item.status === "Closed" ? " border-gray-400" : " border-green-500"
                    }`}
                  ></div>
                  <p className=" text-sm  font-semibold">{item.status}</p>
                  <p className=" text-sm  text-gray-500">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
         </div>
         </div>
        </div>


        {/* Right Section */}
        <div className="  flex  flex-col  gap-6">

          <div className=" flex  justify-between  shadow-md  p-4  bg-white  rounded-lg  items-center  gap-4">
          <div className=" flex  gap-6">
          <img
              src="https://www.ucsfhealth.org/-/media/project/ucsf/ucsf-health/doctor/hero/dr-thomas-link-md-0298-1440x784-2x.jpg?h=1568&iar=0&w=2880&rev=cfaeb389e3cf43f5aba2a5b4f6ee0584&hash=2B237020774679BE2E25E849B3C725F0"
              alt="Driver"
              className=" w-16  h-16  rounded-full"
            />
            <div className=" flex  flex-col">
              <span className=" text-xs  font-semibold  text-gray-400">Driver</span>
              <span className=" font-bold">{requestDetails.driverName}</span>
              <span className=" text-gray-500">{requestDetails.driverContact}</span>
            </div>
          </div>
            <div className=" border  px-[10px]  py-[3px]  bg-green-200  rounded-full  hover:underline">
              <BsTelephone />
              </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <p className=" text-gray-500">Vehicle number</p>
            <p className=" font-semibold">{requestDetails.vehicleNumber}</p>
            <p className=" text-gray-500 mt-2">ETA</p>
            <p className=" font-semibold">{requestDetails.estimatedArrival}</p>
          </div>

          {/* Locations */}
          <div>
            <h3 className=" font-bold  text-lg  mb-2">Locations</h3>
            <div className=" flex  flex-col  gap-4">
              {requestDetails.locations.map((location: { name: string | number | boolean | React.ReactElement | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; address: string | number | boolean | React.ReactElement| Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                <div
                  key={index}
                  className=" flex  items-center  gap-4  bg-gray-100  p-4  rounded-lg"
                >
                  <div className=" w-3  h-3  rounded-full  bg-green-500"></div>
                  <div>
                    <p className=" font-bold">{location.name}</p>
                    <p className=" text-gray-500  text-sm">{location.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialRequestDetails;
