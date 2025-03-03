import { AiFillCloseCircle } from "react-icons/ai"
import {  BiSearch } from "react-icons/bi"
import { FiArrowLeft } from "react-icons/fi"
import { IoIosArrowDown } from "react-icons/io"
import { useNavigate } from "react-router-dom"


const InvoiceListView = () => {
    const navigate = useNavigate();
    const handleDownloadInvoiceDetails = () => {
        navigate('/customer_portal/downloadInvoice');
    };
  return (
    <div>
      <div className="p-4 w-full">
                  {/* Header and Search */}
                  <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                          <div
                           
                              className="p-[10px] border rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg"
                          >
                              <span className="text-xl"><FiArrowLeft /></span>
                          </div>
                          <div className="flex flex-col">
                              <h1 className="text-xl font-semibold">Invoice of Storage</h1>
                              <span className="text-gray-500 text-xs">A descriptive body text comes here</span>
                          </div>
                      </div>
      
                      <div className="flex items-center flex-row space-x-2">
                          <div className="relative w-96">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                                  <BiSearch />
                              </span>
                              <input
                                  type="text"
                             
                                  placeholder="Search by invoice id, invoice name"
                                  className="border border-gray-300 rounded-lg pl-10 pr-10 py-2 w-full"
                              />
                      
                                  <span
                               
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
                                  >
                                      <AiFillCloseCircle />
                                  </span>
                          
                          </div>
                      </div>
      
                      <div className="flex justify-end">
                          <button
                            //   onClick={handleRedirectToRedeliveryRequest}
                              className="flex items-center space-x-2 border border-gray-300 text-gray-300 py-1 px-4 rounded-lg hover:bg-gray-400"
                          >
                              
                              <span>July </span>
                              <span><IoIosArrowDown /></span>
                          </button>
                      </div>
                  </div>
      
                  {/* Table */}
                 
                      <div className="w-full">
                          <table className="min-w-full bg-white shadow rounded-lg">
                              <thead>
                                  <tr className="border-b border-gray-300">
                                      
                                      <th className="p-4 text-left text-xs opacity-[70%]">Invoice ID</th>
                                      <th className="p-4 text-left text-xs opacity-[70%]">Customer Name</th>
                                      <th className="p-4 text-left text-xs opacity-[70%]">Customer Code</th>
                                      <th className="p-4 text-left text-xs opacity-[70%]">Invoice Date</th>
                                      <th className="p-4 text-left text-xs opacity-[70%]">Storage Free</th>
                                      <th className="p-4 text-left text-xs opacity-[70%]">Handling In Charges</th>
                                      <th className="p-4 text-left text-xs opacity-[70%]">Handling Out Charges</th>
                                      <th className="p-4 text-left text-xs opacity-[70%]">Total Amount</th>
                                      <th className="p-4 text-left text-xs opacity-[70%]">Payment Due Date</th>
                                      <th className="p-4 text-left text-xs opacity-[70%]">Status</th>
                                     
                                  </tr>
                              </thead>
      
                              <tbody>
                                 <tr className="border-b border-gray-300 hover:bg-gray-100 ">
                                        <td
                                          onClick={handleDownloadInvoiceDetails}
                                          className="p-4 text-xs  text-black cursor-pointer hover:underline">9074979</td>
                                          <td className="p-4 text-xs ">Andrew Cirkis</td>
                                          <td className="p-4 text-xs">ABC001</td>
                                          <td className="p-4 text-xs">01/01/25</td>
                                          <td className="p-4 text-xs">€309</td>
                                          <td className="p-4 text-xs">€30</td>
                                          <td className="p-4 text-xs">€59</td>
                                          <td className="p-4 text-xs">€420</td>
                                          <td className="p-4 text-xs">01/01/25</td>
                                          <td className="p-4 text-xs">
                                              <span
                                                  className=""
                                              >test
                                                  {/* {getStatusFromNumber(request.docstatus)} */}
                                              </span>
                                          </td>
                                        
                                      </tr>
                                  
                              </tbody>
                          </table>
                      </div>
                 

              
      
                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-gray-500">
                          Page  of 
                      </div>
                      <div className="space-x-2">
                          <button
                            //   onClick={() => handlePageChange(currentPage - 1)}
                            //   disabled={currentPage === 1}
                              className="px-3 py-1 text-xs bg-gray-200 rounded-lg disabled:opacity-50"
                          >
                              Previous
                          </button>
                          <button
                            //   onClick={() => handlePageChange(currentPage + 1)}
                            //   disabled={currentPage === totalPages}
                              className="px-3 py-1 text-xs bg-gray-200 rounded-lg disabled:opacity-50"
                          >
                              Next
                          </button>
                      </div>
                  </div>
              </div>
    </div>
  )
}

export default InvoiceListView
