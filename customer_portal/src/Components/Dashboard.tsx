
const Dashboard = () => {
  return (
    <div className=" pl-20  grid  w-[95%]  grid-cols-3  gap-4  px-4  py-8">
      {/* Dashboard Cards */}
      <div className=" bg-white  rounded-lg  p-4  shadow-md">
        <div className=" text-xl  font-bold">€657</div>
        <div className=" text-gray-500">from Last month invoice</div>
      </div>
      <div className=" bg-white  rounded-lg  p-4  shadow-md">
        <div className=" text-xl  font-bold">284</div>
        <div className=" text-gray-500">Total tyres from Last month</div>
      </div>
      <div className=" bg-white  rounded-lg  p-4  shadow-md">
        <div className=" text-xl  font-bold">28</div>
        <div className=" text-gray-500">Total Pickup request from Last month</div>
      </div>
     
    </div>
  );
};

export default Dashboard;
