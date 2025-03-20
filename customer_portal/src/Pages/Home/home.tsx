/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react"

export default function home() {
  const [requestList, setRequestList] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
 

      console.log(requestList.length,loading,error, "sdfs")
//api call 
 //material request 
 useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/resource/Material%20Request%20Instruction%20Log?fields=["*"]&limit_page_length=1000');

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                if (data && data.data) {
                    const reversData = data.data.reverse()
                    setRequestList(reversData);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching material requests:', error);
                setError('Failed to load requests. Please try again later.');
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);
    

  // Create cosmic particles effect

  useEffect(() => {
    const createCosmicParticles = () => {
      const particleCount = 50
      const container = document.getElementById("dashboard-container")

      if (!container) return

      // Clear existing particles
      const existingParticles = container.querySelectorAll(".cosmic-particle")
      existingParticles.forEach((particle) => particle.remove())

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.classList.add("cosmic-particle")

        // Random position
        particle.style.left = `${Math.random() * 100}%`
        particle.style.top = `${Math.random() * 100}%`

        // Random size
        const size = Math.random() * 3 + 1
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`

        // Random opacity
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`

        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`

        container.appendChild(particle)
      }
    }

    createCosmicParticles()

    // Recreate particles on window resize
    window.addEventListener("resize", createCosmicParticles)

    return () => {
      window.removeEventListener("resize", createCosmicParticles)
    }
  }, [])

  return (
    <div
      id="dashboard-container"
      className="relative flex h-screen  bg-gray-50 text-black"
    >
      <div className="flex-1 flex flex-col ">
      

        {/* Main Content */}
        <main className="flex-1  p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-gray-400">Welcome back, Jane! Here's what's happening today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
              <div className="text-sm font-medium text-gray-400 mb-2">Total Material Request</div>
              <div className="text-2xl font-bold">{requestList.length}</div>
              <p className="text-xs text-green-400 flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                <span>+12.5% from last month</span>
              </p>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
              <div className="text-sm font-medium text-gray-400 mb-2">New Customers</div>
              <div className="text-2xl font-bold">1,482</div>
              <p className="text-xs text-green-400 flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                <span>+8.2% from last month</span>
              </p>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
              <div className="text-sm font-medium text-gray-400 mb-2">Active Users</div>
              <div className="text-2xl font-bold">3,721</div>
              <p className="text-xs text-green-400 flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                <span>+5.1% from last week</span>
              </p>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
              <div className="text-sm font-medium text-gray-400 mb-2">Pending Orders</div>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-red-400 flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                  <polyline points="16 17 22 17 22 11" />
                </svg>
                <span>-2.3% from yesterday</span>
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
              <div className="mb-4">
                <h2 className="text-lg font-bold">Revenue Overview</h2>
                <p className="text-sm text-gray-400">Monthly revenue and profit</p>
              </div>
              <div className="h-[300px] relative">
                {/* Simple line chart using divs */}
                <div className="absolute inset-0 flex items-end justify-between px-4">
                  <div className="h-[60%] w-[10%] bg-gradient-to-t from-black to-purple-400 rounded-t-md relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Jan: $4,000
                    </div>
                  </div>
                  <div className="h-[45%] w-[10%] bg-gradient-to-t from-black to-purple-400 rounded-t-md relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Feb: $3,000
                    </div>
                  </div>
                  <div className="h-[90%] w-[10%] bg-gradient-to-t from-black to-purple-400 rounded-t-md relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Mar: $9,800
                    </div>
                  </div>
                  <div className="h-[50%] w-[10%] bg-gradient-to-t from-black to-purple-400 rounded-t-md relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Apr: $3,908
                    </div>
                  </div>
                  <div className="h-[65%] w-[10%] bg-gradient-to-t from-black to-purple-400 rounded-t-md relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      May: $4,800
                    </div>
                  </div>
                  <div className="h-[55%] w-[10%] bg-gradient-to-t from-black to-purple-400 rounded-t-md relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Jun: $3,800
                    </div>
                  </div>
                  <div className="h-[70%] w-[10%] bg-gradient-to-t from-black to-purple-400 rounded-t-md relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Jul: $5,000
                    </div>
                  </div>
                </div>
                {/* Chart grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-slate-700/50"></div>
                  <div className="border-b border-slate-700/50"></div>
                  <div className="border-b border-slate-700/50"></div>
                  <div className="border-b border-slate-700/50"></div>
                </div>
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pt-2 border-t border-slate-700/50 text-xs text-gray-400">
                  <div>Jan</div>
                  <div>Feb</div>
                  <div>Mar</div>
                  <div>Apr</div>
                  <div>May</div>
                  <div>Jun</div>
                  <div>Jul</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
              <div className="mb-4">
                <h2 className="text-lg font-bold">Sales Distribution</h2>
                <p className="text-sm text-gray-400">Sales by category</p>
              </div>
              <div className="h-[300px] flex items-center justify-center">
                {/* Simple pie chart using CSS */}
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-purple-500 origin-right transform rotate-0"></div>
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-pink-500 origin-right transform rotate-[108deg]"></div>
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-400 origin-right transform rotate-[216deg]"></div>
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-green-400 origin-right transform rotate-[288deg]"></div>
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-yellow-400 origin-right transform rotate-[324deg]"></div>
                  </div>
                  <div className="absolute inset-[15%] bg-slate-800 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">Total Sales</span>
                  </div>
                </div>
                <div className="ml-8 space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
                    <span className="text-sm">Electronics (30%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-pink-500 rounded-sm mr-2"></div>
                    <span className="text-sm">Clothing (25%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm mr-2"></div>
                    <span className="text-sm">Books (25%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-sm mr-2"></div>
                    <span className="text-sm">Home (15%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-sm mr-2"></div>
                    <span className="text-sm">Other (5%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

      

          {/* Recent Orders and Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">Recent Orders</h2>
                  <p className="text-sm text-gray-400">Latest customer orders</p>
                </div>
                <button className="px-3 py-1 text-sm border border-slate-700 rounded-md text-gray-400 hover:bg-slate-700 hover:text-white">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {/* Order 1 */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Alex Johnson</p>
                      <p className="text-xs text-gray-400">#ORD-001 • Today</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 mr-4">
                      Completed
                    </span>
                    <span className="text-right font-medium">$250.00</span>
                  </div>
                </div>
                {/* Order 2 */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Sarah Williams</p>
                      <p className="text-xs text-gray-400">#ORD-002 • Today</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 mr-4">Processing</span>
                    <span className="text-right font-medium">$120.50</span>
                  </div>
                </div>
                {/* Order 3 */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Michael Brown</p>
                      <p className="text-xs text-gray-400">#ORD-003 • Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 mr-4">
                      Pending
                    </span>
                    <span className="text-right font-medium">$350.00</span>
                  </div>
                </div>
                {/* Order 4 */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Emily Davis</p>
                      <p className="text-xs text-gray-400">#ORD-004 • Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 mr-4">
                      Completed
                    </span>
                    <span className="text-right font-medium">$210.25</span>
                  </div>
                </div>
                {/* Order 5 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">David Miller</p>
                      <p className="text-xs text-gray-400">#ORD-005 • Jul 20</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 mr-4">Cancelled</span>
                    <span className="text-right font-medium">$75.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">Top Products</h2>
                  <p className="text-sm text-gray-400">Best selling products this month</p>
                </div>
                <button className="px-3 py-1 text-sm border border-slate-700 rounded-md text-gray-400 hover:bg-slate-700 hover:text-white">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {/* Product 1 */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Premium Headphones</p>
                      <p className="text-xs text-gray-400">452 sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$13,560</p>
                    <p className="text-xs text-green-400">+12%</p>
                  </div>
                </div>
                {/* Product 2 */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Smart Watch Pro</p>
                      <p className="text-xs text-gray-400">389 sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$11,670</p>
                    <p className="text-xs text-green-400">+7%</p>
                  </div>
                </div>
                {/* Product 3 */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Wireless Earbuds</p>
                      <p className="text-xs text-gray-400">290 sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$8,700</p>
                    <p className="text-xs text-green-400">+23%</p>
                  </div>
                </div>
                {/* Product 4 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Laptop Ultra</p>
                      <p className="text-xs text-gray-400">187 sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$28,050</p>
                    <p className="text-xs text-green-400">+4%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Cosmic particles will be added by the useEffect */}
      <style>{`
        .cosmic-particle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(to right, rgba(138, 79, 255, 0.6), rgba(255, 107, 158, 0.6));
          pointer-events: none;
          z-index: 1;
          animation: float 15s ease-in-out infinite;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  )
}

