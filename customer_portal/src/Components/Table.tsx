

const Table = () => {
  const orders = [
    { id: 'ORDERID01', status: 'Delivered', customer: 'Raj Industries', qty: 240, service: 'PH', arrival: '17 July 2024' },
    { id: 'ORDERID02', status: 'Canceled', customer: 'Raj Industries', qty: 240, service: 'TH', arrival: '17 July 2024' },
    { id: 'ORDERID03', status: 'Active', customer: 'Raj Industries', qty: 240, service: 'PH', arrival: '17 July 2024' },
  ];

  return (
    <div className=" bg-white  rounded-lg  p-4  shadow-md">
      <h2 className=" font-bold  text-lg  mb-4">Latest Shipping</h2>
      <table className=" w-full">
        <thead>
          <tr className=" text-left  border-b">
            <th className=" pb-2">ORDER ID</th>
            <th className=" pb-2">STATUS</th>
            <th className=" pb-2">CUSTOMER</th>
            <th className=" pb-2">DEPARTURE</th>
            <th className=" pb-2">QTY</th>
            <th className=" pb-2">ARRIVAL</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className=" border-b">
              <td className=" py-2">{order.id}</td>
              <td className=" py-2">{order.status}</td>
              <td className=" py-2">{order.customer}</td>
              <td className=" py-2">{order.service}</td>
              <td className=" py-2">{order.qty}</td>
              <td className=" py-2">{order.arrival}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
