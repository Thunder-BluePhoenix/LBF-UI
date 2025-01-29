

const ShippingList = () => {
  const orders = [
    { id: 'ORDERID01', status: 'Delivered', location: 'Delhi', destination: 'LBF Storage, Warehouse' },
    { id: 'ORDERID02', status: 'Loading', location: 'Delhi', destination: 'C6, Shah Colony, Mumbai' },
    { id: 'ORDERID03', status: 'Approved', location: 'Delhi', destination: 'C6, Shah Colony, Mumbai' },
  ];

  return (
    <div className=" bg-white  rounded-lg  p-4  shadow-md">
      <h2 className=" font-bold">Shipping List</h2>
      <div className=" mt-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className=" flex  justify-between  py-2  border-b  border-gray-200"
          >
            <div>
              <div className=" font-bold">{order.id}</div>
              <div className=" text-sm  text-gray-500">
                {order.location} → {order.destination}
              </div>
            </div>
            <div>
              <span
                className={` px-2  py-1  text-sm  rounded-full ${
                  order.status === 'Delivered'
                    ? ' bg-green-200  text-green-700'
                    : ' bg-yellow-200  text-yellow-700'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingList;
