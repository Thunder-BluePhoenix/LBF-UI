import { useRef } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

const DownloadInvoice = () => {
  const invoiceRef = useRef<HTMLDivElement | null>(null);

  // const downloadInvoice = () => {
  //   const input = invoiceRef.current;
  //   if (input) {
  //     html2canvas(input, { useCORS: true, backgroundColor: null }).then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF('p', 'mm', 'a4');
      
  //       const imgWidth = 210; // A4 page width in mm
  //       const pageHeight = 297; // A4 page height in mm
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
  //       let heightLeft = imgHeight;
  //       let position = 0;
      
  //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
      
  //       while (heightLeft >= 0) {
  //         position = heightLeft - imgHeight;
  //         pdf.addPage();
  //         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  //       }
      
  //       pdf.save('invoice.pdf');
  //     });
      
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div ref={invoiceRef} className="w-[600px] p-8 border border-gray-300 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">LBF Logistica</h1>
          <p>747 Poplar Court Crown Point, IN 46307</p>
          <p>www.smithph.com</p>
          <p>880-201-4838</p>
        </div>

        <div className="flex justify-between mb-6">
          <div>
            <h4 className="font-semibold">Invoice to:</h4>
            <p>Andrew Cirkis</p>
            <p>Wilmington, MA 01887</p>
            <p>georgee@gmail.com</p>
            <p>89847578425</p>
          </div>
          <div>
            <p>Invoice No: 12345</p>
            <p>Date: 12/1/2025</p>
          </div>
        </div>

        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">SL.</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Qty</th>
              <th className="border border-gray-300 px-4 py-2">Rate (€)</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">Storage Fee</td>
              <td className="border border-gray-300 px-4 py-2">30 Days</td>
              <td className="border border-gray-300 px-4 py-2">0.10 per tyre/day</td>
              <td className="border border-gray-300 px-4 py-2">€301.60</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">Handling In Charges</td>
              <td className="border border-gray-300 px-4 py-2">400</td>
              <td className="border border-gray-300 px-4 py-2">0.10 per tyre</td>
              <td className="border border-gray-300 px-4 py-2">€50.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">Handling Out Charges</td>
              <td className="border border-gray-300 px-4 py-2">480</td>
              <td className="border border-gray-300 px-4 py-2">0.15 per tyre</td>
              <td className="border border-gray-300 px-4 py-2">€70.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">Other Charges</td>
              <td className="border border-gray-300 px-4 py-2">0</td>
              <td className="border border-gray-300 px-4 py-2">-</td>
              <td className="border border-gray-300 px-4 py-2">€0.00</td>
            </tr>
          </tbody>
        </table>

        <div className="mb-6">
          <p className="font-semibold">Payment info:</p>
          <p>Account: 1234 5678 0954</p>
          <p>A/C: George Ericson</p>
        </div>

        <div className="mb-6 flex justify-between">
          <p className="font-semibold">Sub Total: €421.60</p>
          <p className="font-semibold">Tax: €0.00</p>
          <p className="text-lg font-bold">Total: €421.60</p>
        </div>

        <div>
          <p className="text-sm italic">
            Terms & Condition: Please pay within 20 days by PayPal (smithph@gmail.com). Installed products have 3 years warranty.
          </p>
        </div>
      </div>
{/* 
      <button
        onClick={downloadInvoice}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Download Invoice
      </button> */}
    </div>
  );
};

export default DownloadInvoice;
