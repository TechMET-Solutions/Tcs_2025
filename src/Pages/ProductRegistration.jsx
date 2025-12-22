import { BarChart, Package, Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import { addProductAPI, getProductAPI } from "../Component/API/productApi";


export default function ProductRegistration() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState("");
const [selectedLink, setSelectedLink] = useState("");
const [showQRModal, setShowQRModal] = useState(false);

  // Brand List
  const [brandList] = useState([
    "Kajaria",
    "Somany",
    "Johnson",
    "Asian Granito",
    "Simpolo",
    "Qutone",
  ]);
const [showBatchModal, setShowBatchModal] = useState(false);
const [selectedBatches, setSelectedBatches] = useState([]);

  // Product Form State
  const [product, setProduct] = useState({
    name: "",
    size: "",
    brand: "",
    category: "",
    quality: "",
    rate: "",
    status: "",
    link: "",
    godown: [],
    description: "",
    image: null,
  });

  // Batch State
  const [batchList, setBatchList] = useState([
    { batchNo: "", qty: "", location: "" },
  ]);

  // Product List
  const [productList, setProductList] = useState([]);
const [showPrintModal, setShowPrintModal] = useState(false);
const [printProduct, setPrintProduct] = useState(null);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await getProductAPI();
      if (res.data.success) {
        setProductList(res.data.products);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, image: file });
  };

  const handleGodownSelect = (selected) => {
    const updated = product.godown.includes(selected)
      ? product.godown.filter((g) => g !== selected)
      : [...product.godown, selected];
    setProduct({ ...product, godown: updated });
  };

  const handleBatchChange = (index, field, value) => {
    const updated = [...batchList];
    updated[index][field] = value;
    setBatchList(updated);
  };

  const addBatchRow = () => {
    setBatchList([...batchList, { batchNo: "", qty: "", location: "" }]);
  };

  const removeBatchRow = (index) => {
    const updated = [...batchList];
    updated.splice(index, 1);
    setBatchList(updated);
  };

  // SAVE PRODUCT
  // const saveProduct = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData();

  //     Object.keys(product).forEach((key) => {
  //       if (key === "godown") {
  //         formData.append("godown", JSON.stringify(product.godown));
  //       } else {
  //         formData.append(key, product[key]);
  //       }
  //     });

  //     formData.append("batches", JSON.stringify(batchList));

  //     if (product.image) {
  //       formData.append("image", product.image);
  //     }

  //     const res = await addProductAPI(formData);

  //     if (res.data.success) {
  //       alert("✅ Product Saved Successfully");

  //       fetchProducts();

  //       setProduct({
  //         name: "",
  //         size: "",
  //         brand: "",
  //         category: "",
  //         quality: "",
  //         rate: "",
  //         status: "",
  //         link: "",
  //         godown: [],
  //         description: "",
  //         image: null,
  //       });

  //       setBatchList([{ batchNo: "", qty: "", location: "" }]);
  //       setShowAddModal(false);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Product Save Failed");
  //   }
  // };
const saveProduct = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    // ✅ Append all product fields EXCEPT image
    Object.keys(product).forEach((key) => {
      if (key === "godown") {
        formData.append("godown", JSON.stringify(product.godown));
      }
      else if (key === "image") {
        // ❌ DO NOT append image here
      }
      else {
        formData.append(key, product[key]);
      }
    });

    // ✅ Append batches
    formData.append("batches", JSON.stringify(batchList));

    // ✅ Append image ONLY ONCE
    if (product.image) {
      formData.append("image", product.image);
    }

    const res = await addProductAPI(formData);

    if (res.data.success) {
      alert("✅ Product Saved Successfully");

      fetchProducts();

      setProduct({
        name: "",
        size: "",
        brand: "",
        category: "",
        quality: "",
        rate: "",
        status: "",
        link: "",
        godown: [],
        description: "",
        image: null,
      });

      setBatchList([{ batchNo: "", qty: "", location: "" }]);
      setShowAddModal(false);
    }

  } catch (err) {
    console.error("SAVE PRODUCT ERROR:", err);
    alert("❌ Product Save Failed");
  }
};

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Product Registration
        </h1>

        {/* <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Plus size={18} /> Add Product
        </button> */}
        <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2  text-[#FA9C42] px-4 py-2 rounded-lg border border-[#FA9C42]"
                >
                  <Plus size={18} /> Add Product
                </button>
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white p-6 shadow-xl rounded-xl">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <BarChart size={22} /> Inventory List
        </h2>

        <table className="w-full bg-white rounded-xl overflow-hidden">
          <thead className="bg-[#FA9C42] text-white ">
            <tr>
              <th className="py-6 px-2">Image</th>
              <th className="py-6 px-2">Name</th>
              <th className="py-6 px-2">Brand</th>
              <th className="py-6 px-2">Category</th>
              <th className="py-6 px-2">Quality</th>
              <th className="py-6 px-2">Rate</th>
              <th className="py-6 px-2">Godown</th>
              <th className="py-6 px-2">Batch Details</th> {/* ⭐ NEW */}
              <th className="py-6 px-2">Barcode</th>
              <th className="py-6 px-2">QR Code</th>
<th className="py-6 px-2">Print</th>

            </tr>
          </thead>

          <tbody>
            {productList.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500 italic">
                  No products added yet.
                </td>
              </tr>
            ) : (
              productList.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">

                  {/* IMAGE */}
                  <td className="p-3 text-center">
                    {item.image_url ? (
                      <img
                        className="h-12 w-12 rounded-md object-cover mx-auto"
                        src={item.image_url}
                      />
                    ) : "-"}
                  </td>

                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.brand}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.quality}</td>
                  <td className="p-3">₹{item.rate}</td>
                  <td className="p-3">{item.godown}</td>

                  {/* ⭐ BATCH DETAILS DISPLAY */}
                  {/* <td className="p-3">
                    {item.batches && item.batches.length > 0 ? (
                      <div className="space-y-1">
                        {item.batches.map((b, idx) => (
                          <div key={idx} className="text-sm bg-gray-100 p-1 rounded">
                            <strong>Batch {b.batch_no}</strong> → Qty: {b.qty}, Loc: {b.location}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No Batch</span>
                    )}
                  </td> */}
                  <td className="p-3 text-center">
  {item.batches && item.batches.length > 0 ? (
    <button
      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
      onClick={() => {
        setSelectedBatches(item.batches);
        setShowBatchModal(true);
      }}
    >
      View Batches
    </button>
  ) : (
    <span className="text-gray-400 italic">No Batch</span>
  )}
</td>


                  {/* BARCODE */}
                 <td className="p-2">
                  <div
                    className="cursor-pointer inline-block"
                    onClick={() => {
                      setSelectedBarcode(item.name);
                      setShowBarcodeModal(true);
                    }}
                  >
                    <Barcode value={item.name} height={40} width={1} />
                  </div>
                </td>

                {/* QR CODE IN LIST */}
                <td className="p-2">
                  {item.link ? (
                    <div
                      className="cursor-pointer inline-block"
                      onClick={() => {
                        setSelectedLink(item.link);
                        setShowQRModal(true);
                      }}
                    >
                      <QRCode value={item.link} size={60} />
                    </div>
                  ) : (
                    <span className="text-gray-400">No Link</span>
                  )}
                </td>

<td className="p-3 text-center">
  <button
    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-black"
    onClick={() => {
      setPrintProduct(item);
      setShowPrintModal(true);
    }}
  >
    🖨 Print
  </button>
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
{showQRModal && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-[#FFF7EF] p-6 rounded-xl shadow-xl text-center w-[350px]">

      <h2 className="text-xl font-semibold mb-4">🔗 Product Link QR</h2>
            <div className="flex justify-center">
               <QRCode
        value={selectedLink}
        size={200}
        level="H"
        includeMargin={true}
      />
              </div>
     

      <p className="text-xs text-gray-500 mt-3 break-all">
        {selectedLink}
      </p>

      <button
        onClick={() => setShowQRModal(false)}
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
)}

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-[#FFF7EF] w-[750px] rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Package size={20} /> Add New Product
              </h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={saveProduct}>

              {/* PRODUCT FORM */}
              <div className="grid grid-cols-2 gap-4 ">
                {/* IMAGE */}
                <div>
                  <label>Product Image:</label>
                  <label className="border rounded p-2 mt-1 bg-gray-50 flex items-center gap-2 cursor-pointer">
                    <Upload size={18} /> Choose File
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                {/* NAME */}
                <div>
                  <label>Product Name:</label>
                  <input
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                    required
                  />
                </div>

                {/* SIZE */}
                <div>
                  <label>Product Size:</label>
                  <input
                    name="size"
                    value={product.size}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                  />
                </div>

                {/* BRAND */}
                <div>
                  <label>Brand Name:</label>
                  <select
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                    required
                  >
                    <option value="">~~SELECT~~</option>
                    {brandList.map((brand, i) => (
                      <option key={i} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* QUALITY */}
                <div>
                  <label>Quality:</label>
                  <select
                    name="quality"
                    value={product.quality}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                  >
                    <option value="">~~SELECT~~</option>
                    <option>Premium</option>
                    <option>Standard</option>
                    <option>Economy</option>
                  </select>
                </div>

                {/* CATEGORY */}
                <div>
                  <label>Category:</label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                  >
                    <option value="">~~SELECT~~</option>
                    <option>Tiles</option>
                    <option>Marble</option>
                    <option>Sanitary</option>
                    <option>Granite</option>
                  </select>
                </div>

                {/* RATE */}
                <div>
                  <label>Rate:</label>
                  <input
                    name="rate"
                    type="number"
                    value={product.rate}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label>Status:</label>
                  <select
                    name="status"
                    value={product.status}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                  >
                    <option value="">~~SELECT~~</option>
                    <option>Available</option>
                    <option>Unavailable</option>
                  </select>
                </div>

                {/* LINK */}
                <div className="col-span-2">
                  <label>Upload Link:</label>
                  <input
                    name="link"
                    value={product.link}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                    placeholder="Paste link here"
                  />
                </div>

                {/* GODOWN */}
                <div className="col-span-2">
                  <label>Godown:</label>
                  <div className="flex gap-4 mt-1">
                    {["KKW", "MN", "TCS"].map((g) => (
                      <label key={g} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={product.godown.includes(g)}
                          onChange={() => handleGodownSelect(g)}
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* BATCH TABLE */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Batch Details</h3>

                <table className="w-full border rounded-lg bg-white">
                  <thead className="">
                    <tr>
                      <th className="p-2 border">Batch No</th>
                      <th className="p-2 border">Quantity</th>
                      <th className="p-2 border">Location</th>
                      <th className="p-2 border">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {batchList.map((batch, index) => (
                      <tr key={index}>
                        <td className="p-2 border">
                          <input
                            className="border p-2 w-full rounded"
                            value={batch.batchNo}
                            onChange={(e) =>
                              handleBatchChange(index, "batchNo", e.target.value)
                            }
                          />
                        </td>

                        <td className="p-2 border">
                          <input
                            className="border p-2 w-full rounded"
                            value={batch.qty}
                            onChange={(e) =>
                              handleBatchChange(index, "qty", e.target.value)
                            }
                          />
                        </td>

                        <td className="p-2 border">
                          <input
                            className="border p-2 w-full rounded"
                            value={batch.location}
                            onChange={(e) =>
                              handleBatchChange(index, "location", e.target.value)
                            }
                          />
                        </td>

                        <td className="p-2 border text-center">
                          <button
                            type="button"
                            className="text-red-600 text-lg"
                            onClick={() => removeBatchRow(index)}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-center mt-3">
                  <button
                    type="button"
                    onClick={addBatchRow}
                    className="bg-blue-600 text-white px-4 py-1 rounded-full text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                 <button
                type="submit"
                className="w-[134px] mt-6 bg-[#FA9C42] text-white py-2  hover:bg-blue-700 h-[48px] rounded-[8px]"
              >
                Save 
              </button>
</div>
             
            </form>

          </div>
        </div>
      )}

      {/* BARCODE MODAL */}
      {showBarcodeModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-[#FFF7EF] p-6 rounded-xl shadow-xl text-center">
            <h2 className="text-xl font-semibold mb-4">Barcode</h2>

            <Barcode value={selectedBarcode || "Product"} />

            <button
              onClick={() => setShowBarcodeModal(false)}
              className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

     {showBatchModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-[#FFF7EF] w-[600px] rounded-xl shadow-2xl p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📦 Batch Details
        </h3>
        <button
          className="text-gray-500 hover:text-red-500 text-xl"
          onClick={() => setShowBatchModal(false)}
        >
          ✕
        </button>
      </div>

      {/* TABLE */}
      <div className="max-h-[300px] overflow-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 border text-left">Batch No</th>
              <th className="p-3 border text-left">Quantity</th>
              <th className="p-3 border text-left">Location</th>
            </tr>
          </thead>

          <tbody>
            {selectedBatches.length > 0 ? (
              selectedBatches.map((b, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 border">{b.batch_no}</td>
                  <td className="p-3 border">{b.qty}</td>
                  <td className="p-3 border">{b.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="p-4 text-center text-gray-500 italic"
                >
                  No batch data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="mt-5 text-right">
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          onClick={() => setShowBatchModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{showPrintModal && printProduct && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-[#FFF7EF] w-[850px] rounded-2xl shadow-2xl p-6">

      {/* HEADER (HIDDEN ON PRINT) */}
      <div className="flex justify-between items-center mb-4 print:hidden">
        <h2 className="text-xl font-semibold">🖨 Print Product Details</h2>
        <button onClick={() => setShowPrintModal(false)}>
          <X size={22} />
        </button>
      </div>

      {/* ================= PRINT AREA ================= */}
      <div id="print-area" className="text-black">

        {/* COMPANY HEADER */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              YOUR COMPANY NAME
            </h1>
            <p className="text-sm text-gray-600">
              Address Line, City – Pincode
            </p>
            <p className="text-sm text-gray-600">
              Phone: +91 90000 00000
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-semibold uppercase">
              Product Sheet
            </h2>
            <p className="text-sm">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* PRODUCT INFO GRID */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            ["Product Name", printProduct.name],
            ["Brand", printProduct.brand],
            ["Category", printProduct.category],
            ["Quality", printProduct.quality],
            ["Rate", `₹ ${printProduct.rate}`],
            ["Godown", printProduct.godown],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="border rounded-lg p-3 flex justify-between"
            >
              <span className="font-semibold text-gray-700">
                {label}
              </span>
              <span className="text-gray-900">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* BATCH DETAILS */}
        {printProduct.batches?.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-2">
              Batch Details
            </h3>

            <table className="w-full border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Batch No</th>
                  <th className="border p-2 text-center">Quantity</th>
                  <th className="border p-2 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {printProduct.batches.map((b, i) => (
                  <tr key={i}>
                    <td className="border p-2">{b.batch_no}</td>
                    <td className="border p-2 text-center">{b.qty}</td>
                    <td className="border p-2">{b.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* FOOTER */}
        <div className="mt-10 flex justify-between text-sm">
          <div>
            <p>Prepared By:</p>
            <p className="font-semibold mt-1">Authorized Person</p>
          </div>

          <div className="text-right">
            <p>Signature</p>
            <div className="mt-4 w-40 border-t"></div>
          </div>
        </div>

      </div>
      {/* ================= END PRINT AREA ================= */}

      {/* ACTION BUTTONS (HIDDEN ON PRINT) */}
      <div className="flex justify-end gap-3 mt-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Print
        </button>
        <button
          onClick={() => setShowPrintModal(false)}
          className="px-5 py-2 bg-gray-600 text-white rounded-lg"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}


    </div>
  );
}
