import React from "react";
import { MdDelete } from "react-icons/md";
import type { FetchedItem, ItemList, } from "../types/redelivery-form"; 

interface ItemTableProps {
  items: ItemList[]; // Changed from Item[] to ItemList[]
  itemList: FetchedItem[]; // Changed to match the type used in RedeliveryForm
  open: number | null;
  setOpen: React.Dispatch<React.SetStateAction<number | null>>;
  DateOfRequredBy: string;
  handleDateOfRequredBy: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDocStatusLocked: () => boolean;
  handleItemSelect: (id: number, item: FetchedItem) => void; // Adjusted type
  setItems: React.Dispatch<React.SetStateAction<ItemList[]>>; // Changed to ItemList[]
  removeRow: (index: number) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  itemList,
  open,
  setOpen,
  DateOfRequredBy,
  handleDateOfRequredBy,
  isDocStatusLocked,
  handleItemSelect,
  setItems,
  removeRow,
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-lg font-bold mb-4">Item TH</h1>
      <table className="w-full border rounded-md border-gray-300">
        <thead>
          <tr className="border-b bg-gray-50 border-gray-300">
            <th className="border border-gray-300 p-2">No.</th>
            <th className="border border-gray-300 p-2">Item Code *</th>
            <th className="border border-gray-300 p-2">Item Name</th>
            <th className="border border-gray-300 p-2">Required By *</th>
            <th className="border border-gray-300 p-2">Qty</th>
            <th className="border border-gray-300 p-2">Available Qty</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b rounded-md border-gray-300">
              <td className="p-2 text-left">{item.id}</td>
              <td>
                <div className="relative">
                  <div
                    onClick={() =>
                      !isDocStatusLocked() &&
                      setOpen(open === item.id ? null : item.id)
                    }
                    className={`w-full text-left px-2 py-2 border-x border-gray-300 ${
                      isDocStatusLocked() ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    {item.item_code || "Select item..."}
                  </div>
                  {open === item.id && !isDocStatusLocked() && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                      <input
                        type="text"
                        placeholder="Search items..."
                        className="w-full p-2 border border-gray-300"
                      />
                      <ul className="max-h-32 overflow-y-auto z-50">
                        {itemList.map((code) => (
                          <li
                            key={code.item_code}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleItemSelect(item.id, code)}
                          >
                            {code.item_code}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <input
                  type="text"
                  value={item.item_name}
                  readOnly
                  className="w-full p-2 border-x border-gray-300"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={DateOfRequredBy || item.requiredBy}
                  onChange={handleDateOfRequredBy}
                  className="w-full p-2 border-x border-gray-300"
                  disabled={isDocStatusLocked()}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedItems = items.map((i) =>
                      i.id === item.id
                        ? { ...i, quantity: Number.parseInt(e.target.value, 10) }
                        : i
                    );
                    setItems(updatedItems);
                  }}
                  className="w-full p-2 border-x border-gray-300"
                  disabled={isDocStatusLocked()}
                />
              </td>
              <td className="border-r border-gray-300">{item.available}</td>
              <td>
                <span
                  onClick={() => !isDocStatusLocked() && removeRow(index)}
                  className={`py-1 flex items-center justify-center text-black text-xl rounded-md ${
                    isDocStatusLocked() ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  <MdDelete />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;