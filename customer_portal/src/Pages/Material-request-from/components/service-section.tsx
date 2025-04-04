import type { ChangeEvent, Key } from "react"
// Define an interface for the data items
interface DataItem {
  name: string;
}
// Define an interface for the data object
interface DataObject {
  data?: DataItem[];
}

interface ServiceSectionProps {
  service: string
  selectedSeasons: string
  selectedCondition: string
  selectedReason: string
  licensePlate: string
  mezzo: string
  season: DataObject
  condition: DataObject
  reason: DataObject
  isDocStatusLocked: () => boolean
  onServiceChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onSeasonChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onConditionChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onReasonChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onLicensePlateChange: (event: ChangeEvent<HTMLInputElement>) => void
  onMezzoChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const ServiceSection = ({
  service,
  selectedSeasons,
  selectedCondition,
  selectedReason,
  licensePlate,
  mezzo,
  season,
  condition,
  reason,
  isDocStatusLocked,
  onServiceChange,
  onSeasonChange,
  onConditionChange,
  onReasonChange,
  onLicensePlateChange,
  onMezzoChange,
}: ServiceSectionProps) => {
  return (
    <div className="grid grid-cols-3 bg-gray-50 p-4 border border-gray-300 rounded gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">
          Service<span className="text-red-500">*</span>
        </label>
        <select
          name="service"
          value={service}
          onChange={onServiceChange}
          disabled={isDocStatusLocked()}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
        >
          <option>Select Service</option>
          <option>Peneus Hub</option>
          <option>Tyre Hotel</option>
        </select>
      </div>
      {service === "Tyre Hotel" && (
        <>
          <div>
            <label className="block text-sm font-medium">Season</label>
            <select
              name="season"
              value={selectedSeasons}
              onChange={onSeasonChange}
              disabled={isDocStatusLocked()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option>Select Season</option>
              {season?.data?.map((item: DataItem, index: Key) => (
                <option key={index}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Condition</label>
            <select
              name="condition"
              value={selectedCondition}
              onChange={onConditionChange}
              disabled={isDocStatusLocked()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option>Select Condition</option>
              {condition?.data?.map((item: DataItem, index: Key) => (
                <option key={index}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Reason</label>
            <select
              name="reason"
              value={selectedReason}
              onChange={onReasonChange}
              disabled={isDocStatusLocked()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option>Select Reason</option>
              {reason?.data?.map((item: DataItem, index: Key) => (
                <option key={index}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">
              License Plate<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              onChange={onLicensePlateChange}
              disabled={isDocStatusLocked()}
              value={licensePlate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              placeholder="Enter license plate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mezzo</label>
            <input
              type="text"
              value={mezzo}
              onChange={onMezzoChange}
              disabled={isDocStatusLocked()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              placeholder="Enter detail"
            />
          </div>
        </>
      )}
    </div>
  )
}