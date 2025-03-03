import { CiCircleCheck } from "react-icons/ci";


export default function NotificationsPanel() {
  return (
    <div className="w-full  bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      <div className="p-4 pb-2">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {/* First notification with profile picture */}
        <div className="p-4 flex gap-3">
          <div className="flex-shrink-0">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-gray-800">Your pick-up request Ord001 has been accepted.</p>
            <p className="text-sm text-gray-500 mt-1">45 mins ago</p>
          </div>
        </div>

        {/* Second notification with icon */}
        <div className="p-4 flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <CiCircleCheck  />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-800">Your pick-up request has been accepted.</p>
            <p className="text-sm text-gray-500">We will soon send you the BOL of this order.</p>
            <p className="text-sm text-gray-500 mt-1">45 mins ago</p>
          </div>
        </div>

        {/* Third notification with icon */}
        <div className="p-4 flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <CiCircleCheck />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-800">Your request to add question in the repository has been accepted.</p>
            <p className="text-sm text-gray-500">
              How likely are you to recommend our company/product/service to a friend or colleague? Please rate on a
              scale f...
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-gray-600">#3066</span>
              <span className="text-sm text-gray-500">45 mins ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* View All link */}
      <div className="p-4 text-center">
        <a href="#" className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
          View All
        </a>
      </div>
    </div>
  )
}

