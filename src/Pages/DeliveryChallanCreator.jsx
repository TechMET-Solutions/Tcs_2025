import axios from "axios";
import { ChevronRight, MapPin, Search, Send, Truck, User } from "lucide-react";
import { useState } from "react";
import { BASEURL } from "../Component/API/Url";

const DeliveryChallanCreator = () => {
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [challanItems, setChallanItems] = useState([]);
  console.log("Challan Items:", challanItems);
  const [driverDetails, setDriverDetails] = useState({
    deliveryBoy: "",
    contact: "",
    tempo: "",
  });

  const handleSearch = async () => {
    if (!searchName) return;
    setLoading(true);
    setQuotation(null);
    try {
      const response = await axios.get(
        `${BASEURL}/api/Quotation/search/${searchName}`,
      );
      if (response.data.success) {
        setSearchResults(response.data.quotations);
      }
    } catch (err) {
      alert("No quotations found for this client");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuotation = (selected) => {
    setQuotation(selected);
    setSearchResults([]);

    const initialItems = selected.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      rate: item.rate,
      dispatchBoxes: 0,
      remainingBoxes: item.remainingBoxes || 0,
      currentStock: item.currentStock || 0,
      cov: parseFloat(item.cov) || 1,
      // Ensure batches are captured from the response
      batches: item.batches || [],
    }));
    setChallanItems(initialItems);
  };

  const handleBoxChange = (index, value) => {
    const val = parseInt(value) || 0;
    const updatedItems = [...challanItems];
    updatedItems[index].dispatchBoxes = val;
    setChallanItems(updatedItems);
  };

  const handleSubmitChallan = async () => {
    const itemsToDispatch = challanItems
      .filter((item) => item.dispatchBoxes > 0)
      .map((item) => ({
        productId: item.productId,
        productName: item.productName,
        dispatchBoxes: item.dispatchBoxes,
        rate: item.rate,
      }));

    if (itemsToDispatch.length === 0)
      return alert("Enter boxes for at least one item.");

    const payload = {
      quotationId: quotation?.id,
      client: quotation?.clientName,
      contact: quotation?.contactNo,
      address: quotation?.address,

      driverDetails,
      items: itemsToDispatch,
    };

    try {
      const response = await axios.post(
        `${BASEURL}/api/Quotation/generate-dc`,
        payload,
      );
      if (response.data.success) {
        alert("Challan Generated Successfully!");
        setQuotation(null);
        setSearchName("");
      }
    } catch (error) {
      alert("Error generating challan.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* Search Section */}
      <div className="max-w-5xl mx-auto mb-6 relative">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search Client Name (e.g. name)"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Multiple Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
            <div className="p-3 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
              Quotations Found ({searchResults.length})
            </div>
            {searchResults.map((q) => (
              <div
                key={q.id}
                onClick={() => handleSelectQuotation(q)}
                className="p-4 border-b border-slate-50 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors"
              >
                <div>
                  <p className="font-bold text-slate-800">
                    {q.clientName}{" "}
                    <span className="text-slate-400 text-sm ml-2">#{q.id}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(q.createdAt).toLocaleDateString()} • Total: ₹
                    {q.grandTotal}
                  </p>
                </div>
                <ChevronRight className="text-slate-300" size={18} />
              </div>
            ))}
          </div>
        )}
      </div>

      {quotation && (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                <User size={14} /> Selected Quotation #{quotation.id}
              </h2>
              <p className="text-xl font-black text-slate-800">
                {quotation.clientName}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {quotation.contactNo}
              </p>
              <p className="text-slate-500 text-sm flex items-center gap-1 mt-2">
                <MapPin size={14} /> {quotation.address}
              </p>
            </div>

            {/* Driver Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-bold text-blue-600 uppercase mb-4 flex items-center gap-2">
                <Truck size={14} /> Dispatch Logistics
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="p-2 text-sm bg-white border border-blue-200 rounded-lg outline-none"
                  placeholder="Driver Name"
                  value={driverDetails.deliveryBoy}
                  onChange={(e) =>
                    setDriverDetails({
                      ...driverDetails,
                      deliveryBoy: e.target.value,
                    })
                  }
                />
                <input
                  className="p-2 text-sm bg-white border border-blue-200 rounded-lg outline-none"
                  placeholder="Contact"
                  value={driverDetails.contact}
                  onChange={(e) =>
                    setDriverDetails({
                      ...driverDetails,
                      contact: e.target.value,
                    })
                  }
                />
                <input
                  className="p-2 text-sm bg-white border border-blue-200 rounded-lg outline-none col-span-2"
                  placeholder="Vehicle No (e.g. MH-15-AB-1234)"
                  value={driverDetails.tempo}
                  onChange={(e) =>
                    setDriverDetails({
                      ...driverDetails,
                      tempo: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">
                    In Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">
                    Remaining
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-600 uppercase text-center bg-blue-50/50">
                    Dispatch Boxes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {challanItems.map((item, index) => (
                  <tr
                    key={item.productId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800">
                        {item.productName}
                      </div>

                      {/* Batch Information Display */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.batches && item.batches.length > 0 ? (
                          item.batches.map((batch, bIndex) => (
                            <div
                              key={bIndex}
                              className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-slate-600 flex items-center gap-1"
                            >
                              <span className="font-bold text-blue-700">
                                B#{batch.batch_no}
                              </span>
                              <span>|</span>
                              <span>Qty: {batch.qty}</span>
                              <span className="text-slate-400 capitalize">
                                ({batch.location})
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-[10px] text-red-400 italic">
                            No batches available
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                        {item.currentStock} qty
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-slate-700">
                      {item.remainingBoxes}
                    </td>
                    <td className="px-6 py-5 text-center bg-blue-50/30">
                      <input
                        type="number"
                        className="w-20 p-2 border-2 border-blue-100 rounded-xl text-center font-black text-blue-700 focus:border-blue-500 outline-none"
                        value={item.dispatchBoxes}
                        onChange={(e) => handleBoxChange(index, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 bg-slate-50 border-t flex justify-end">
              <button
                onClick={handleSubmitChallan}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2"
              >
                <Send size={20} /> Generate Delivery Challan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryChallanCreator;
