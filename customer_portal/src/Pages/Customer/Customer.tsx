"use client"

import { useState, useEffect } from "react"
import { BiPlus } from "react-icons/bi"
import { useNavigate } from "react-router-dom"

// Define types
interface Customer {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    naming_series: string;
    salutation: string | null;
    customer_name: string;
    customer_type: string;
    customer_group: string;
    custom_is_parent: number;
    custom_parent_customer: string | null;
    territory: string | null;
    gender: string | null;
    lead_name: string | null;
    opportunity_name: string | null;
    prospect_name: string | null;
    account_manager: string | null;
    image: string | null;
    default_currency: string | null;
    default_bank_account: string | null;
    default_price_list: string | null;
    is_internal_customer: number;
    represents_company: string | null;
    market_segment: string | null;
    industry: string | null;
    customer_pos_id: string | null;
    website: string | null;
    language: string;
    customer_details: string | null;
    customer_primary_address: string | null;
    primary_address: string | null;
    customer_primary_contact: string | null;
    mobile_no: string | null;
    email_id: string | null;
    tax_id: string | null;
    tax_category: string | null;
    tax_withholding_category: string | null;
    payment_terms: string | null;
    loyalty_program: string | null;
    loyalty_program_tier: string | null;
    default_sales_partner: string | null;
    default_commission_rate: number;
    so_required: number;
    dn_required: number;
    is_frozen: number;
    disabled: number;
}

interface ApiResponse {
    data: Customer[]
}



export default function CustomerTable() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectAll, setSelectAll] = useState(false)
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
    const [itemsPerPage, setItemsPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(1)
    const navigator = useNavigate()
    

    // Fetch customer data
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/resource/Customer/?fields=["*"]')

                if (!response.ok) {
                    throw new Error("Failed to fetch customers")
                }

                const data: ApiResponse = await response.json()
                setCustomers(data.data || [])
                setFilteredCustomers(data.data || [])
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

    // Handle search
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCustomers(customers)
        } else {
            const filtered = customers.filter((customer) => 
                customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredCustomers(filtered)
        }
        setCurrentPage(1)
    }, [searchTerm, customers])

    // Handle select all
    useEffect(() => {
        if (selectAll) {
            setSelectedCustomers(filteredCustomers.map((customer) => customer.name))
        } else {
            setSelectedCustomers([])
        }
    }, [selectAll, filteredCustomers])

    // Handle individual selection
    const toggleCustomerSelection = (customerName: string) => {
        if (selectedCustomers.includes(customerName)) {
            setSelectedCustomers(selectedCustomers.filter((name) => name !== customerName))
        } else {
            setSelectedCustomers([...selectedCustomers, customerName])
        }
    }

    const handleDetailsRedirect = (id: string) => {
        navigator(`/customer_portal/newcustomer/${id}`);  // Add the id to the URL
    };
   

    // Pagination
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

    // Format date/time for display
    const getTimeDisplay = (modifiedDate: string): string => {
        const now = new Date()
        const modified = new Date(modifiedDate)
        const diffMs = now.getTime() - modified.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 60) return `${diffMins} m`
        if (diffHours < 24) return `${diffHours} h`
        return `${diffDays} d`
    }

    const handleRedirect = (path: string) => {
        navigator(path);
    };

    // Get status based on disabled field
    const getCustomerStatus = (customer: Customer): string => {
        return customer.disabled === 0 ? "Enabled" : "Disabled"
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading customers...</div>
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>
    }
    console.log(currentCustomers,"responseresponseresponse")
    return (
        <div className="w-full bg-white rounded-lg shadow overflow-hidden">
            {/* Search bar */}
            <div className="flex w-full justify-between p-4 border-b border-gray-300">
                <div className="">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        onClick={() => handleRedirect('/customer_portal/newcustomer')}
                        className="flex items-center space-x-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
                    >
                        <span className="text-xl"><BiPlus /></span>
                        <span>Add New Customer</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={selectAll}
                                    onChange={() => setSelectAll(!selectAll)}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer Group
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Territory
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {`${currentPage === 1 ? startIndex + 1 : startIndex}-${Math.min(endIndex, filteredCustomers.length)} of ${filteredCustomers.length}`}
                            </th>
                          
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentCustomers.map((customer, index) => (
                            <tr key={`${customer.name}-${index}`} className="hover:bg-gray-50">
                                <td className="px-6 py-2 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4  rounded border-gray-300"
                                        checked={selectedCustomers.includes(customer.name)}
                                        onChange={() => toggleCustomerSelection(customer.name)}
                                    />
                                </td>
                                <td 
                                onClick={() => handleDetailsRedirect(customer.name)}
                                className="px-6 py-2 text-xs text-gray-800 font-bold whitespace-nowrap ">{customer.customer_name}</td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                    <span className="text-blue-00 text-xs bg-blue-50 text-blue-600 rounded-full px-2 py-1">{getCustomerStatus(customer)}</span>
                                </td>
                                <td className="px-6 py-2 text-xs whitespace-nowrap text-gray-600">{customer.customer_group}</td>
                                <td className="px-6 py-2 text-xs whitespace-nowrap text-gray-600 ">{customer.territory}</td>
                                <td className="px-6 py-2 text-xs whitespace-nowrap text-gray-600">{customer.name}</td>
                                <td className="px-6 py-2 text-xs whitespace-nowrap text-right text-gray-600">{getTimeDisplay(customer.modified)}</td>
                             
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-between items-center">
                <div className="flex space-x-2">
                    {[20, 100, 500, 2500].map((size) => (
                        <button
                            key={size}
                            onClick={() => {
                                setItemsPerPage(size)
                                setCurrentPage(1)
                            }}
                            type="button"
                            className={`px-3 py-1 text-sm text-gray-600 rounded-md ${itemsPerPage === size ? "bg-gray-200 font-medium" : "bg-white border hover:bg-gray-50"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        type="button"
                        className="px-2 py-1 text-xs border text-gray-600 rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-gray-600">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        type="button"
                        className="px-2 py-1 text-xs border text-gray-600 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}