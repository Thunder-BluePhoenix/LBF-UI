import { useState, useEffect, } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

// Define interfaces for API data
interface ItemData {
  type: string | undefined;
  name?: string;
  item_code?: string;
  item_name?: string;
  custom_tyre_type?: string;
  actual_qty?: number;
}

interface ItemsApiResponse {
  data?: ItemData[];
  message?: ItemData[];
}

// Row data for the table
interface RowData {
  id: number;
  item_code: string;
  item_name: string;
  OthersItemCode: string;
  OthersItemName: string;
  requiredBy: string;
  quantity: string;
  uom: string;
  uomConversion: string;
  type: string;
  selectedItem: string;
  Brand: string;
  Marks: string;
  SpeedRating: string;
  Carcass: string;
  Model: string;
  LoadIndex: string;
  AspectRatio: string;
  // Additional fields from the form
  tireWidth?: string;
  diameter?: string;
  weight?: string;
  expenseAccount?: string;
  wipCompositeAsset?: string;
  // Reference to the original API data item if available
  originalItemName?: string;
}

// Data structure from API for updating items
interface UpdateItemData {
  other_item_code: string;
  other_item_name: string;
  marks_others: string;
  speed_rating_others: string;
  carcass_others: string;
  model_others: string;
  load_index_others: string;
  aspect_ratio_others: string;
  tire_widthmm_others: string;
  diameterinch_others: string;
  weight_others: string;
  brandothers: string;
  name: string;
  item_code: string;
  item_name: string;
  Others_item_code?: string;
  Others_item_name?: string;
  schedule_date: string;
  qty: number;
  type: string;
  uom: string;
  conversion_factor: number;
  stock_uom: string;
  // Additional fields specific to tire properties
  tire_widthmm?: string;
  tire_widthmm_Others?: string;
  diameterinch?: string;
  diameterinch_Others?: string;
  weight?: string;
  weight_Others?: string;
  aspect_ratio?: string;
  aspect_ratio_Others?: string;
  load_index?: string;
  load_index_Others?: string;
  model?: string;
  model_Others?: string;
  carcass?: string;
  carcass_Others?: string;
  speed_rating?: string;
  speed_rating_Others?: string;
  marks?: string;
  marks_Others?: string;
  brand?: string;
  brandOthers?: string;
}

// Props for the table component
interface TableComponentProps {
  itemsData?: ItemsApiResponse;
  updateItemData?: UpdateItemData[];
  itemsRedelivery?: ItemsApiResponse;
  purpose?: string;
  onDataChange?: (rows: RowData[]) => void;
  abledHandle: () => boolean; // Function that returns whether fields should be disabled
}

// Form data type for the dialog
interface FormDataType {
  item_code: string;
  item_name: string;
  OthersItemCode: string;
  OthersItemName: string;
  requiredBy: string;
  type: string;
  tireWidth: string;
  diameter: string;
  weight: string;
  quantity: string;
  uom: string;
  expenseAccount: string;
  wipCompositeAsset: string;
  Brand: string;
  Marks: string;
  SpeedRating: string;
  Carcass: string;
  Model: string;
  LoadIndex: string;
  AspectRatio: string;
}

const TableComponent: React.FC<TableComponentProps> = ({
  itemsData,
  updateItemData,
  purpose,
  itemsRedelivery,
  onDataChange,
  abledHandle
}) => {
  // Initialize the items data source based on service type
  const [itemsSource, setItemsSource] = useState<ItemData[]>([]);

  // Initialize itemsSource based on purpose and available data
  useEffect(() => {
    if (purpose === "Redelivery" && itemsRedelivery?.message) {
      setItemsSource(itemsRedelivery.message);
    } else if (itemsData?.data) {
      setItemsSource(itemsData.data);
    }
  }, [purpose, itemsRedelivery, itemsData]);

  const [rows, setRows] = useState<RowData[]>([
    {
      id: 1,
      item_code: "",
      requiredBy: "",
      quantity: "",
      uom: "Nos",
      uomConversion: "1.00",
      type: "",
      selectedItem: "",
      item_name: "",
      OthersItemCode: "",
      OthersItemName: "",
      Brand: "",
      Marks: "",
      SpeedRating: "",
      Carcass: "",
      Model: "",
      LoadIndex: "",
      AspectRatio: "",
    },
  ]);

  const [formData, setFormData] = useState<FormDataType>({
    item_code: "",
    item_name: "",
    OthersItemCode: "",
    OthersItemName: "",
    requiredBy: "",
    type: "",
    tireWidth: "",
    diameter: "",
    weight: "",
    quantity: "",
    uom: "",
    expenseAccount: "",
    wipCompositeAsset: "",
    Brand: "",
    Marks: "",
    SpeedRating: "",
    Carcass: "",
    Model: "",
    LoadIndex: "",
    AspectRatio: "",
  });

  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Initialize rows from updateItemData when it's available
  useEffect(() => {
    if (updateItemData && updateItemData.length > 0) {
      const mappedRows = updateItemData.map((item, idx) => {
        const isOthersItem = item.item_code === "Others";

        return {
          id: idx + 1,
          item_code: item.item_code,
          item_name: item.item_name,
          originalItemName: item.item_name,
          OthersItemCode: isOthersItem ? (item.other_item_code || "") : "",
          OthersItemName: isOthersItem ? (item.other_item_name || "") : "",
          requiredBy: item.schedule_date || "",
          // Convert number to string to avoid type errors
          quantity: item.qty?.toString() || "",
          uom: item.uom || "Nos",
          uomConversion: item.conversion_factor?.toString() || "1.00",
          type: item.type || "",
          selectedItem: isOthersItem ? "Others" : item.item_code,
          Brand: isOthersItem ? (item.brandothers || "") : (item.brand || ""),
          Marks: isOthersItem ? (item.marks_others || "") : (item.marks || ""),
          SpeedRating: isOthersItem ? (item.speed_rating_others || "") : (item.speed_rating || ""),
          Carcass: isOthersItem ? (item.carcass_others || "") : (item.carcass || ""),
          Model: isOthersItem ? (item.model_others || "") : (item.model || ""),
          LoadIndex: isOthersItem ? (item.load_index_others || "") : (item.load_index || ""),
          AspectRatio: isOthersItem ? (item.aspect_ratio_others || "") : (item.aspect_ratio || ""),
          tireWidth: isOthersItem ? (item.tire_widthmm_others || "") : (item.tire_widthmm || ""),
          diameter: isOthersItem ? (item.diameterinch_others || "") : (item.diameterinch || ""),
          weight: isOthersItem ? (item.weight_others || "") : (item.weight || ""),
          expenseAccount: item.stock_uom || "",
          wipCompositeAsset: item.conversion_factor?.toString() || "",
        };
      });

      setRows(mappedRows);
    }
  }, [updateItemData]);

  // Send updated rows to parent component whenever rows change
  useEffect(() => {
    if (onDataChange) {
      onDataChange(rows);
    }
  }, [rows, onDataChange]);

  const addRow = () => {
    const newRows = [
      ...rows,
      {
        id: rows.length + 1,
        item_code: "",
        requiredBy: "",
        quantity: "",
        uom: "Nos",
        uomConversion: "1.00",
        type: "",
        selectedItem: "",
        item_name: "",
        OthersItemCode: "",
        OthersItemName: "",
        Brand: "",
        Marks: "",
        SpeedRating: "",
        Carcass: "",
        Model: "",
        LoadIndex: "",
        AspectRatio: "",
      },
    ];
    setRows(newRows);
  };

  const removeRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (index: number, field: keyof RowData, value: string) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  // Updated to handle both name and item_code/item_name properties
  const handleItemSelect = (index: number, item: ItemData) => {
    const itemCode = item.item_code || item.name || "";
    const itemName = item.item_name || item.name || "";

    const updatedRows = rows.map((row, i) => {
      if (i === index) {
        return {
          ...row,
          item_code: itemCode,
          selectedItem: itemCode,
          item_name: itemName,
          type: item.custom_tyre_type || row.type
        };
      }
      return row;
    });
    setRows(updatedRows);
    setShowDropdown(null);
  };

  const handleOthersSelect = (index: number) => {
    const updatedRows = rows.map((row, i) => {
      if (i === index) {
        return {
          ...row,
          item_code: "Others",
          selectedItem: "Others",
          item_name: "Others"
        };
      }
      return row;
    });
    setRows(updatedRows);
    setShowDropdown(null);
  };

  const openDialog = (index: number) => {
    setEditingRowIndex(index);

    // Populate the form with the current row data
    const rowData = rows[index];
    setFormData({
      item_code: rowData.item_code || "Others",
      item_name: rowData.item_name || "Others",
      OthersItemName: rowData.OthersItemName || "",
      OthersItemCode: rowData.OthersItemCode || "",
      requiredBy: rowData.requiredBy || "",
      type: rowData.type || "",
      Brand: rowData.Brand || "",
      Marks: rowData.Marks || "",
      Carcass: rowData.Carcass || "",
      Model: rowData.Model || "",
      AspectRatio: rowData.AspectRatio || "",
      LoadIndex: rowData.LoadIndex || "",
      SpeedRating: rowData.SpeedRating || "",
      tireWidth: rowData.tireWidth || "",
      diameter: rowData.diameter || "",
      weight: rowData.weight || "",
      quantity: rowData.quantity || "",
      uom: rowData.uom || "",
      expenseAccount: rowData.expenseAccount || "",
      wipCompositeAsset: rowData.wipCompositeAsset || ""
    });

    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    if (editingRowIndex !== null) {
      // Update the row with the form data when closing dialog
      updateRowWithFormData();
    }
    setIsDialogOpen(false);
    setEditingRowIndex(null);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const updateRowWithFormData = () => {
    if (editingRowIndex !== null) {
      // Update the row with form data
      const updatedRows = rows.map((row, index) => {
        if (index === editingRowIndex) {
          return {
            ...row,
            item_code: "Others",  // Always "Others" for edited items in the dialog
            item_name: "Others",  // Always "Others" for edited items in the dialog
            OthersItemName: formData.OthersItemName,
            OthersItemCode: formData.OthersItemCode,
            requiredBy: formData.requiredBy,
            quantity: formData.quantity.toString(),
            type: formData.type,
            uom: formData.uom,
            Brand: formData.Brand,
            Marks: formData.Marks,
            SpeedRating: formData.SpeedRating,
            Carcass: formData.Carcass,
            Model: formData.Model,
            LoadIndex: formData.LoadIndex,
            AspectRatio: formData.AspectRatio,
            selectedItem: "Others",
            tireWidth: formData.tireWidth,
            diameter: formData.diameter,
            weight: formData.weight,
            expenseAccount: formData.expenseAccount,
            wipCompositeAsset: formData.wipCompositeAsset
          };
        }
        return row;
      });

      setRows(updatedRows);
    }
  };

  // Helper function to determine if fields should be disabled
  const isFieldDisabled = (): boolean => {
    return abledHandle();
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold mb-4">Item TH</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">No.</th>
            <th className="border border-gray-300 p-2">Item Code *</th>
            <th className="border border-gray-300 p-2">Required By *</th>
            <th className="border border-gray-300 p-2">Quantity *</th>
            {purpose === "Redelivery" && ( <th className="border border-gray-300 p-2">Available Quantity *</th>
            )}
            <th className="border border-gray-300 p-2">Type *</th>
            <th className="border border-gray-300 p-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className="bg-white">
              <td className="border border-gray-300 p-2 text-center">{row.id}</td>
              <td className="border border-gray-300 p-2 relative">
                <input
                  type="text"
                  className="w-full border-gray-300"
                  value={row.item_code || ""}
                  onFocus={() => !isFieldDisabled() && setShowDropdown(index)}
                  disabled={isFieldDisabled()}
                  onChange={(e) => handleInputChange(index, "item_code", e.target.value)}
                  placeholder="Item Code"
                />
                {showDropdown === index && itemsSource && itemsSource.length > 0 && !isFieldDisabled() && (
                  <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 max-h-40 overflow-y-auto z-10">
                    {itemsSource.map((item, i) => (
                      <li
                        key={i}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleItemSelect(index, item)}
                      >
                        {purpose === "Redelivery"
                          ? `${item.item_code ? item.item_code : ""}${item.item_code && item.custom_tyre_type ? "/" : ""}${item.custom_tyre_type ? item.custom_tyre_type : ""}`
                          : item.item_code || item.name
                        }
                      </li>
                    ))}
                    {purpose === "Pick Up" && !isFieldDisabled() && (
                      <li
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleOthersSelect(index)}
                      >
                        Others
                      </li>
                    )}
                  </ul>
                )}
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="date"
                  className="w-full border-gray-300"
                  value={row.requiredBy}
                  onChange={(e) => handleInputChange(index, "requiredBy", e.target.value)}
                  disabled={isFieldDisabled()}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  className="w-full border-gray-300"
                  value={row.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  disabled={isFieldDisabled()}
                  placeholder="Quantity"
                />
              </td>
              {purpose === "Redelivery" && ( <td className="border border-gray-300 p-2">
                {/* Display actual quantity if available */}
                {itemsSource.length > 0 && itemsSource[0]?.actual_qty !== undefined
                  ? itemsSource[0].actual_qty
                  : "-"}
              </td>
              )}
              <td className="border border-gray-300 p-2">
                <select
                  className="w-full border-gray-300"
                  value={row.type}
                  onChange={(e) => handleInputChange(index, "type", e.target.value)}
                  disabled={isFieldDisabled()}
                >
                  <option value="">Select Type</option>
                  <option value="With Rim">With Rim</option>
                  <option value="Without Rim">Without Rim</option>
                </select>
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {row.item_code === "Others" && !isFieldDisabled() ? (
                  <button
                    type="button"
                    onClick={() => openDialog(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MdEdit />
                  </button>
                ) : !isFieldDisabled() ? (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MdDelete />
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isFieldDisabled() && (
        <button
          type="button"
          className="mt-4 p-2 bg-gray-200 text-gray-600 rounded"
          onClick={addRow}
        >
          Add Row
        </button>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 py-12 flex items-center justify-center bg-gray-200 bg-opacity-90 z-50">
          <div className="bg-white h-full my-12 overflow-scroll rounded-lg shadow-lg w-full max-w-4xl">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Edit Item Details</h2>
              <button onClick={closeDialog} className="text-red-500">Close</button>
            </div>
            <div className="p-4">
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Code *</label>
                    <input
                      type="text"
                      name="item_code"
                      placeholder="Others"
                      value={formData.item_code}
                      readOnly
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Name *</label>
                    <input
                      type="text"
                      name="item_name"
                      placeholder="Others"
                      value={formData.item_name}
                      readOnly
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Others Item Code *</label>
                    <input
                      type="text"
                      name="OthersItemCode"
                      placeholder="Enter code"
                      value={formData.OthersItemCode}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Others Item Name *</label>
                    <input
                      type="text"
                      name="OthersItemName"
                      placeholder="Enter name"
                      value={formData.OthersItemName}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Required By *</label>
                    <input
                      type="date"
                      name="requiredBy"
                      value={formData.requiredBy}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="With Rim">With Rim</option>
                      <option value="Without Rim">Without Rim</option>
                    </select>
                  </div>
                </div>
                <hr className="text-gray-300 my-4"></hr>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Aspect Ratio (Others) *</label>
                    <input
                      type="text"
                      name="AspectRatio"
                      value={formData.AspectRatio}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Load Index (Others) *</label>
                    <input
                      type="text"
                      name="LoadIndex"
                      value={formData.LoadIndex}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model (Others) *</label>
                    <input
                      type="text"
                      name="Model"
                      value={formData.Model}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Carcass (Others) *</label>
                    <input
                      type="text"
                      name="Carcass"
                      value={formData.Carcass}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Speed Rating (Others) *</label>
                    <input
                      type="text"
                      name="SpeedRating"
                      value={formData.SpeedRating}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marks (Others)*</label>
                    <input
                      type="text"
                      name="Marks"
                      value={formData.Marks}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">Brand(Others) *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="Brand"
                        value={formData.Brand}
                        onChange={handleFormInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tire Width(mm) *</label>
                    <input
                      type="text"
                      name="tireWidth"
                      value={formData.tireWidth}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Diameter(Inch) *</label>
                    <input
                      type="text"
                      name="diameter"
                      value={formData.diameter}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (Others) *</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">UOM *</label>
                    <input
                      type="text"
                      name="uom"
                      value={formData.uom}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock UOM</label>
                    <input
                      type="text"
                      name="expenseAccount"
                      value={formData.expenseAccount}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Conversion Factor</label>
                    <input
                      type="text"
                      name="wipCompositeAsset"
                      value={formData.wipCompositeAsset}
                      onChange={handleFormInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;