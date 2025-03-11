"use client"

import { useState, useEffect } from "react"
import { BiPlus, BiSearch } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AiFillCloseCircle } from "react-icons/ai"

// Define types to match the actual API response
interface CustomerDetailsForWholesaler {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    parent_customer: string;
    child_customer_name: string;
    child_customer_address_name: string;
    child_customer_contact_name: string;
    datetime: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
}

interface Customer {
    displayName: string
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
    custom_mail_id?: string;
    custom_contact_no?: string;
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
    doctype: string;
    custom_details_for_parent_customer: CustomerDetailsForWholesaler[];
}

interface ApiResponse {
    message: Customer[];
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
    const [loginUser, setLoginUser] = useState<string>("")
    const [customerLoginUser, setCustomerLoginUser] = useState<Customer | null>(null)
    const navigate = useNavigate()
    console.log(customers,"customerscustomers")
    // Fetch user data and then fetch customer data
    useEffect(() => {
        const fetchUserAndCustomerData = async () => {
            try {
                setLoading(true)
                
                // Step 1: Get logged-in user email
                const userResponse = await axios.get("/api/method/frappe.auth.get_logged_user")
                const loginUserEmail = userResponse.data.message
                setLoginUser(loginUserEmail)
                
                // Step 2: Get the customer associated with logged-in user
                const customerResponse = await axios.get(
                    `/api/resource/Customer?fields=["*"]&filters=[["Portal User","user", "=", "${encodeURIComponent(loginUserEmail)}"]]`
                )
                
                // Check if we have customer data
                if (customerResponse.data.data && customerResponse.data.data.length > 0) {
                    const customerData = customerResponse.data.data[0]
                    setCustomerLoginUser(customerData)
                    console.log("Customer data:", customerData)
                    
                    // Step 3: Fetch child customers associated with this customer
                    const response = await fetch(`/api/method/lbf_logistica.api.bol.fetch_child_customers?customer=${encodeURIComponent(customerData.name)}`)
                    
                    if (!response.ok) {
                        throw new Error("Failed to fetch customers")
                    }
                    
                    const data: ApiResponse = await response.json()
                    
                    // Update to correctly access the data from the API response
                    if (data.message && Array.isArray(data.message)) {
                        // Process customers to identify the display name for each
                        const processedCustomers = data.message.map(customer => {
                            // Find if there's an entry in custom_details_for_parent_customer where parent_customer matches the login user's customer name
                            const matchingChildDetail = customer.custom_details_for_parent_customer.find(
                                detail => detail.parent_customer === customerData.name || detail.parent_customer === customerData.customer_name
                            );
                            
                            // If found, use the child_customer_name as the display name
                            if (matchingChildDetail) {
                                return {
                                    ...customer,
                                    displayName: matchingChildDetail.child_customer_name
                                };
                            }
                            
                            // Otherwise use the regular customer_name
                            return {
                                ...customer,
                                displayName: customer.customer_name
                            };
                        });
                        
                        setCustomers(processedCustomers);
                        setFilteredCustomers(processedCustomers);
                        checkForSimilarCustomers(processedCustomers, customerData);
                    } else {
                        setCustomers([])
                        setFilteredCustomers([])
                        console.warn("No customers found or invalid data format", data)
                    }
                } else {
                    console.warn("No customer data found for user:", loginUserEmail)
                    setCustomers([])
                    setFilteredCustomers([])
                }
            } catch (err) {
                console.error("Error fetching data:", err)
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchUserAndCustomerData()
    }, [])

    // Function to check for similar customers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkForSimilarCustomers = (customers: any[], customerData: Customer) => {
        const similarCustomers = customers.filter(customer => 
            (customer.customer_name === customerData.customer_name && customer.name !== customerData.name) || 
            (customer.custom_mail_id && customerData.custom_mail_id && 
             customer.custom_mail_id.toLowerCase() === customerData.custom_mail_id.toLowerCase() &&
             customer.name !== customerData.name)
        );

        if (similarCustomers.length > 0) {
            console.log("Similar customers found:", similarCustomers);
            // You can also show a modal or alert with the details if needed
        }
    }

    // Handle search
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCustomers(customers)
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = customers.filter((customer) => 
                (customer.customer_name?.toLowerCase() || "").includes(term) ||
                (customer.displayName?.toLowerCase() || "").includes(term) ||
                (customer.name?.toLowerCase() || "").includes(term) ||
                (customer.email_id?.toLowerCase() || "").includes(term) ||
                (customer.custom_mail_id?.toLowerCase() || "").includes(term)
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

    // const handleDetailsRedirect = (id: string) => {
    //     navigate(`/customer_portal/newcustomer/${id}`);  // Add the id to the URL
    // };
   
    // Pagination
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

    // Format date/time for display
    const getTimeDisplay = (modifiedDate: string): string => {
        if (!modifiedDate) return "—";
        
        try {
            const now = new Date()
            const modified = new Date(modifiedDate)
            const diffMs = now.getTime() - modified.getTime()
            const diffMins = Math.floor(diffMs / 60000)
            const diffHours = Math.floor(diffMins / 60)
            const diffDays = Math.floor(diffHours / 24)

            if (diffMins < 60) return `${diffMins} m`
            if (diffHours < 24) return `${diffHours} h`
            return `${diffDays} d`
        } catch (e) {
            console.error("Error formatting date:", e);
            return "—";
        }
    }

    const handleRedirect = (path: string) => {
        navigate(path);
    };

    // Get status based on disabled field
    const getCustomerStatus = (customer: Customer): string => {
        return customer.disabled === 0 ? "Enabled" : "Disabled"
    }

    // Function to get display name for a customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getCustomerDisplayName = (customer: any): string => {
        if (customer.displayName) {
            return customer.displayName;
        }
        
        // Fallback to customer_name if displayName is not set
        return customer.customer_name;
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading customers...</div>
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>
    }

    return (
        <div className="w-full bg-white rounded shadow overflow-hidden">
            {/* User info banner */}
            {customerLoginUser && (
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                    <p className="text-sm text-blue-800">
                        <span className="font-medium">Logged in as:</span> {loginUser} 
                        {customerLoginUser.customer_name && 
                            <span> | <span className="font-medium">Customer:</span> {customerLoginUser.customer_name}</span>
                        }
                    </p>
                </div>
            )}
            
            {/* Search bar */}
            <div className="flex w-full justify-between p-4 border-b border-gray-300">
            <div className="relative   mr-4">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
        <BiSearch />
    </span>
    <input
        type="text"
        placeholder="Search customers..."
        className="border border-gray-300 rounded-md pl-10 pr-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
    {searchTerm && (
        <span
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
        >
            <AiFillCloseCircle />
        </span>
    )}
</div>

                <div>
                <button
                        onClick={() => handleRedirect('/customer_portal/newcustomer')}
                        className="flex items-center space-x-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
                    >
                        <span className="text-xl"><BiPlus /></span>
                        <span>Add Customer</span>
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
                                Mail ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Modified
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentCustomers.length > 0 ? (
                            currentCustomers.map((customer, index) => (
                                <tr key={`${customer.name}-${index}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-2 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300"
                                            checked={selectedCustomers.includes(customer.name)}
                                            onChange={() => toggleCustomerSelection(customer.name)}
                                        />
                                    </td>
                                    <td 
                                        // onClick={() => handleDetailsRedirect(customer.name)}
                                        className="px-6 py-2 text-xs text-gray-800 font-bold whitespace-nowrap cursor-pointer hover:text-blue-600">
                                        {getCustomerDisplayName(customer)}
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap">
                                        <span className="text-blue-600 text-xs bg-blue-50 rounded-full px-2 py-1">
                                            {getCustomerStatus(customer)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 text-xs whitespace-nowrap text-gray-600">
                                        {customer.customer_group}
                                    </td>
                                    <td className="px-6 py-2 text-xs whitespace-nowrap text-gray-600">
                                        {customer.custom_mail_id || "—"}
                                    </td>
                                    <td className="px-6 py-2 text-xs whitespace-nowrap text-gray-600">
                                        {customer.custom_contact_no || customer.mobile_no || "—"}
                                    </td>
                                    <td className="px-6 py-2 text-xs whitespace-nowrap text-right text-gray-600">
                                        {getTimeDisplay(customer.modified)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                    {loading ? "Loading..." : "No customers found"}
                                </td>
                            </tr>
                        )}
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
                            className={`px-3 py-1 text-sm text-gray-600 rounded-md ${
                                itemsPerPage === size ? "bg-gray-200 font-medium" : "bg-white border hover:bg-gray-50"
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