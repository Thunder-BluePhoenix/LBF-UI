/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react"

export default function home() {
  const [requestList, setRequestList] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
 console.log(requestList.length,loading,error, "sdfs")
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

