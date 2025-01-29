// // import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const data = {
//   labels: ['Jan 1', 'Jan 5', 'Jan 9', 'Jan 13', 'Jan 17', 'Jan 21', 'Jan 29'],
//   datasets: [
//     {
//       label: 'Handling In',
//       data: [10, 20, 15, 30, 25, 15, 20],
//       borderColor: 'rgb(255, 99, 132)',
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Handling Out',
//       data: [20, 25, 30, 15, 20, 25, 15],
//       borderColor: 'rgb(54, 162, 235)',
//       backgroundColor: 'rgba(54, 162, 235, 0.5)',
//     },
//   ],
// };

// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'top',
//     },
//   },
// };

// const ChartComponent = () => {
//   return (
//     <div className=" bg-white  rounded-lg  p-4  shadow-md  h-96">
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default ChartComponent;
