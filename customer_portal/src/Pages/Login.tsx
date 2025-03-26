"use client"

import { useEffect, useState } from "react"
import { BiHide, BiShowAlt } from "react-icons/bi"
import { useFrappeAuth } from "frappe-react-sdk"
import Frame from "../assets/Frame 1430105876.png"
import Frame2 from "../assets/image 21.png"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { currentUser, login, error, isValidating } = useFrappeAuth()
  const navigate = useNavigate()
  const [rotation, setRotation] = useState(0)
  const [speed, setSpeed] = useState(1)

  // Enhanced tire rotation with variable speed
  useEffect(() => {
    const interval = setInterval(() => {
      // Gradually change speed to simulate realistic physics
      setSpeed(prevSpeed => {
        const newSpeed = prevSpeed + (Math.random() * 0.2 - 0.1)
        return Math.max(0.5, Math.min(2, newSpeed)) // Keep speed between 0.5 and 2
      })
      
      setRotation(prev => (prev + speed) % 360)
    }, 30)

    return () => clearInterval(interval)
  }, [speed])

  useEffect(() => {
    const checkCurrentUser = async () => {
      if (currentUser) {
        navigate("/customer_portal/home")
      }
    }

    checkCurrentUser()
  }, [currentUser, navigate])

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      await login({
        username: username,
        password: password,
      })

      console.log("Login successful")
      navigate("/customer_portal/bill-of-landing-list")
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  }

  const errorVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: 16,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  // Tire rotation animation with dynamic speed
  const tireRotation = {
    rotate: rotation,
    transition: {
      type: "tween",
      ease: "linear",
      duration: 0.03,
    }
  }

  return (
    <div className="flex w-full bg-gray-200 items-center justify-center h-screen bg-cover bg-center">
      <motion.div
        className="bg-[#ffff] shadow-sm bg-opacity-50 p-4 rounded max-w-4xl w-full flex gap-12 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Large background tire */}
        <motion.div
          className="absolute -left-20 -top-20 w-40 h-40 rounded-full border-8 border-dashed opacity-30"
          style={{
            borderColor: "#333",
            background: "radial-gradient(circle, #888 0%, #888 30%, #333 30%, #333 45%, #888 45%, #888 50%, transparent 50%)",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)"
          }}
          animate={tireRotation}
        />
        
        {/* Small background tire with opposite rotation */}
        <motion.div
          className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full border-8 border-dashed opacity-30"
          style={{
            borderColor: "#333",
            background: "radial-gradient(circle, #888 0%, #888 30%, #333 30%, #333 45%, #888 45%, #888 50%, transparent 50%)",
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.5)"
          }}
          animate={{ rotate: -rotation }}
        />

        <motion.div
          className="text-white max-w-sm relative"
          variants={itemVariants}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          {/* Tire with tread pattern on left side */}
          <motion.div
            className="absolute -left-4 -top-4 w-16 h-16 rounded-full"
            style={{
              borderColor: "#333",
              background: "radial-gradient(circle, #777 0%, #777 25%, #222 25%, #222 45%, #777 45%, #777 48%, transparent 48%)",
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.2)"
            }}
            animate={tireRotation}
          >
            {/* Add tread pattern as a pseudo-element via CSS class */}
            <div className="w-full h-full rounded-full border-4 border-dashed border-gray-800 opacity-70"></div>
          </motion.div>
          
          <img src={Frame || "/placeholder.svg"} className="w-[400px] relative z-10" alt="Frame" />
          
          {/* Tire with rim details on right side */}
          <motion.div
            className="absolute right-4 bottom-4 w-20 h-20 rounded-full overflow-hidden"
            style={{
              background: "radial-gradient(circle, #888 0%, #888 20%, #222 20%, #222 40%, #888 40%, #888 45%, transparent 45%)",
              boxShadow: "inset 0 0 8px rgba(0,0,0,0.7)"
            }}
            animate={{ rotate: -rotation }}
          >
            {/* Tread pattern */}
            <div className="w-full h-full rounded-full border-4 border-dashed border-gray-800 opacity-80"></div>
            {/* Tire hub */}
            <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 rounded-full bg-gray-500 shadow-inner"></div>
          </motion.div>
        </motion.div>

        <div className="p-4 flex flex-col gap-2 rounded-xl w-96 relative">
          {/* Small decorative tire in form section */}
        
          <motion.img
            src={Frame2}
            className="w-[150px]"
            alt="Frame 2"
            variants={itemVariants}
            custom={1}
            initial="hidden"
            animate="visible"
          />
          <motion.h2
            className="text-2xl font-bold mb-6 text-gray-800"
            variants={itemVariants}
            custom={2}
            initial="hidden"
            animate="visible"
          >
            Welcome!
          </motion.h2>

          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {error.message || "Authentication failed"}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <motion.div className="mb-4" variants={itemVariants} custom={3} initial="hidden" animate="visible">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                disabled={isValidating}
              />
            </motion.div>
            <motion.div className="mb-4" variants={itemVariants} custom={4} initial="hidden" animate="visible">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  disabled={isValidating}
                />
                <motion.div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 cursor-pointer"
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {showPassword ? <BiShowAlt /> : <BiHide />}
                </motion.div>
              </div>
            </motion.div>
            <motion.button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 relative overflow-hidden"
              disabled={isValidating}
              variants={itemVariants}
              custom={5}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
              }}
            >
              {isValidating ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                      ease: "linear",
                    }}
                  />
                  Logging in...
                </motion.div>
              ) : (
                <>
                  {/* Animated mini tire along button */}
                  <motion.div
                    className="absolute top-1/2 w-8 h-8 rounded-full opacity-70"
                    style={{
                      background: "radial-gradient(circle, #fff 0%, #fff 15%, #333 15%, #333 40%, #fff 40%, #fff 45%, transparent 45%)",
                      transform: "translateY(-50%)"
                    }}
                    animate={{
                      opacity: [0, 0.7, 0],
                      scale: [0.5, 1, 0.5],
                      rotate: 360,
                      left: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      times: [0, 0.5, 1],
                    }}
                  >
                    {/* Tire tread */}
                    <div className="w-full h-full rounded-full border-2 border-dashed border-white"></div>
                  </motion.div>
                  
                  Log in
                  
                  {/* Second mini tire along button */}
                  <motion.div
                    className="absolute top-1/2 w-8 h-8 rounded-full opacity-70"
                    style={{
                      background: "radial-gradient(circle, #fff 0%, #fff 15%, #333 15%, #333 40%, #fff 40%, #fff 45%, transparent 45%)",
                      transform: "translateY(-50%)"
                    }}
                    animate={{
                      opacity: [0, 0.7, 0],
                      scale: [0.5, 1, 0.5],
                      rotate: -360,
                      right: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 1,
                      times: [0, 0.5, 1],
                    }}
                  >
                    {/* Tire tread */}
                    <div className="w-full h-full rounded-full border-2 border-dashed border-white"></div>
                  </motion.div>
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom left tire with tread pattern */}
        </div>
      </motion.div>
    </div>
  )
}

export default Login