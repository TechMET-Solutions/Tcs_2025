import axios from "axios";
import { BarChart, BarcodeIcon, Eye, Filter, Layers, MapPin, Maximize, Package, Pencil, Plus, Printer, QrCode, Search, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import { addProductAPI, updateProductAPI } from "../Component/API/productApi";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";


export default function ProductRegistration() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [selectedLink, setSelectedLink] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);

  // Brand List
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [qualityList, setQualityList] = useState([]);

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
    cov:""
  });

  // Batch State
  const [batchList, setBatchList] = useState([
    { batchNo: "", qty: "", location: "" },
  ]);

  // Product List
  const [productList, setProductList] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [limit] = useState(10); // Items per page
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printProduct, setPrintProduct] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  // "add" | "edit" | "view"

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  // FETCH PRODUCTS
  
  const { permissions, user, loading, role } = useAuth(); 
  
  
 const fetchProducts = async (page = 1) => {
  try {
    // Note: Assuming getProductAPI is an axios call, pass the query params
    const res = await axios.get(`${BASEURL}/api/product/list?page=${page}&limit=${limit}`);
    
    if (res.data.success) {
      setProductList(res.data.products);
      setTotalPages(res.data.pagination.totalPages);
      setCurrentPage(res.data.pagination.currentPage);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Failed to fetch products");
  }
};

useEffect(() => {
  fetchProducts(currentPage);
}, [currentPage]);

  const fetchBrands = async () => {
    try {
      const { data } = await axios.get(`${BASEURL}/api/brands/list`);
      if (data.success) {
        setBrandList(data.brands);
      }

    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  },[])

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BASEURL}/api/categories/list`);
      if (data.success) {
        setCategoryList(data.categories);
      }
      console.log("setCategoryList", data.categories)

    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchQualities = async () => {
    try {
      const { data } = await axios.get(`${BASEURL}/api/qualities/list`);
      if (data.success) {
        setQualityList(data.qualities);
      }
    } catch (err) {
      console.error("Failed to fetch qualities", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  },[])

  useEffect(() => {
    fetchQualities();
  },[])

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
  const Handleclose = () => {
    setShowAddModal(false)
    setModalMode("add")
  }
  //   const saveProduct = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData();

  //     // ✅ Append all product fields EXCEPT image
  //     Object.keys(product).forEach((key) => {
  //       if (key === "godown") {
  //         formData.append("godown", JSON.stringify(product.godown));
  //       }
  //       else if (key === "image") {
  //         // ❌ DO NOT append image here
  //       }
  //       else {
  //         formData.append(key, product[key]);
  //       }
  //     });

  //     // ✅ Append batches
  //     formData.append("batches", JSON.stringify(batchList));

  //     // ✅ Append image ONLY ONCE
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
  //     console.error("SAVE PRODUCT ERROR:", err);
  //     alert("❌ Product Save Failed");
  //   }
  // };

  const saveProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // ✅ Append product fields
      Object.keys(product).forEach((key) => {
        if (key === "godown") {
          formData.append("godown", JSON.stringify(product.godown));
        }
        else if (key === "image") {
          // ❌ handled separately
        }
        else {
          formData.append(key, product[key]);
        }
      });

      // ✅ Append batches
      formData.append("batches", JSON.stringify(batchList));

      // ✅ Append image once
      if (product.image instanceof File) {
        formData.append("image", product.image);
      }

      let res;

      // 🔀 MODE SWITCH
      if (modalMode === "edit") {
        res = await updateProductAPI(selectedProductId, formData);
      } else {
        res = await addProductAPI(formData);
      }

      if (res.data.success) {
        alert(`✅ Product ${modalMode === "edit" ? "Updated" : "Saved"} Successfully`);

        fetchProducts();

        // ♻ Reset form
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

  const normalizeGodown = (godown) => {
    if (Array.isArray(godown)) return godown;
    if (typeof godown === "string") {
      return godown.split(",").map(g => g.trim());
    }
    return [];
  };

  const viewProduct = (item) => {
    setModalMode("view");
    setSelectedProductId(item.id);

    setProduct({
      name: item.name || "",
      size: item.size || "",
      brand: item.brand || "",
      category: item.category || "",
      quality: item.quality || "",
      rate: item.rate || "",
      status: item.status || "",
      link: item.link || "",
      godown: normalizeGodown(item.godown), // ✅ FIX
      description: item.description || "",
      image: null,
    });

    setBatchList(
      item.batches?.map(b => ({
        batchNo: b.batch_no,
        qty: b.qty,
        location: b.location,
      })) || [{ batchNo: "", qty: "", location: "" }]
    );

    setShowAddModal(true);
  };


  const editProduct = (item) => {
    setModalMode("edit");
    setSelectedProductId(item.id);

    setProduct({
      name: item.name || "",
      size: item.size || "",
      brand: item.brand || "",
      category: item.category || "",
      quality: item.quality || "",
      rate: item.rate || "",
      status: item.status || "",
      link: item.link || "",
      cov: item.cov || "",
      godown: normalizeGodown(item.godown), // ✅ FIX
      description: item.description || "",
      image: null,
    });

    setBatchList(
      item.batches?.map(b => ({
        batchNo: b.batch_no,
        qty: b.qty,
        location: b.location,
      })) || [{ batchNo: "", qty: "", location: "" }]
    );

    setShowAddModal(true);
  };


  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log("Delete ID:", id);
    }
  };

  const filteredProducts = productList.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedBrand === "" || item.brand === selectedBrand) &&
      (selectedSize === "" || item.size === selectedSize)
    );
  });
  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-wrap items-center gap-4">

        {/* SEARCH BAR */}
        <div className="flex-grow min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-[#FA9C42] focus:bg-white outline-none transition-all"
          />
        </div>

        {/* BRAND FILTER */}
        <div className="w-[200px] relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-[#FA9C42] focus:bg-white outline-none transition-all appearance-none text-slate-600 font-medium"
          >
            <option value="">All Brands</option>
            {brandList
              .filter((brand) => brand.status === "Available")
              .map((brand, i) => (
              <option key={i} value={brand}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* SIZE FILTER */}
        <div className="w-[180px] relative">
          <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-[#FA9C42] focus:bg-white outline-none transition-all appearance-none text-slate-600 font-medium"
          >
            <option value="">All Sizes</option>
            {/* Extracting unique sizes from your product list */}
            {[...new Set(productList.map(p => p.size))].filter(Boolean).map((size, i) => (
              <option key={i} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* RESET BUTTON */}
        {(searchTerm || selectedBrand || selectedSize) && (
          <button
            onClick={() => { setSearchTerm(""); setSelectedBrand(""); setSelectedSize(""); }}
            className="px-4 py-3 text-[#FA9C42] font-bold hover:bg-[#FA9C42]/5 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
      {/* HEADER */}
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Product Registration</h1>
          <p className="text-slate-500 font-medium">Manage and track your inventory stock and logistics.</p>
        </div>
        {(role === "admin" || role === "superadmin" || permissions?.["Product Registration_Add"] === true) && (

 <button
          onClick={() => setShowAddModal(true)}
          className="group flex items-center gap-3 bg-[#FA9C42] text-white px-8 py-4 rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95"
        >
          <Plus size={22} className="group-hover:rotate-90 transition-transform" />
          <span className="font-bold text-lg">Add Product</span>
        </button>
                        )}
       
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden w-full">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FA9C42] text-white rounded-xl shadow-lg">
              <BarChart size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Inventory List</h2>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.1em]">
            Total: {filteredProducts.length} Products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-6 py-5">Product Insight</th>
                <th className="px-6 py-5 text-center">Size</th>
                <th className="px-6 py-5 text-center">Total Stock</th>
                <th className="px-6 py-5 text-center">Administrative</th>
                <th className="px-6 py-5 text-center">Batch Details</th>
                <th className="px-6 py-5 text-center">Logistics</th>
                <th className="px-6 py-5 text-right">Labeling</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-24 text-slate-400 font-medium italic text-lg">
                    No products found in the registry.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item, index) => {
                  const totalQty = item.batches?.reduce((sum, b) => sum + Number(b.qty || 0), 0);

                  return (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      {/* IMAGE & NAME */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-300 text-[10px] font-bold">NO IMG</div>
                            )}
                          </div>
                          <span className="font-black text-slate-800 text-lg tracking-tight leading-tight">{item.name}</span>
                        </div>
                      </td>

                      {/* SIZE */}
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg font-bold text-slate-600 text-sm">
                          {item.size || "-"}
                        </span>
                      </td>

                      {/* QUANTITY */}
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-block px-4 py-1.5 rounded-xl font-black text-lg ${totalQty > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          {totalQty}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          {(role === "admin" || role === "superadmin" || permissions?.["Product Registration_Edit"] === true) && (

<button onClick={() => editProduct(item)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-100 hover:shadow-md transition-all active:scale-90">
                            <Pencil size={18} />
                          </button>
                          )}
                          
                            {(role === "admin" || role === "superadmin" || permissions?.["Product Registration_Delete"] === true) && (

 <button onClick={() => deleteProduct(item.id)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-100 hover:shadow-md transition-all active:scale-90">
                            <Trash2 size={18} />
                          </button>
                        )}
                          
                         
                          <button onClick={() => viewProduct(item)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-sky-500 hover:border-sky-100 hover:shadow-md transition-all active:scale-90">
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>

                      {/* BATCH DETAILS */}
                      <td className="px-6 py-4 text-center">
                        {item.batches?.length > 0 ? (
                          <button
                            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            onClick={() => {
                              setSelectedBatches(item.batches);
                              setShowBatchModal(true);
                            }}
                          >
                            View Batches
                          </button>
                        ) : (
                          <span className="text-slate-300 font-bold text-[10px] uppercase tracking-widest italic">No Data</span>
                        )}
                      </td>

                      {/* Logistics */}
                      <td className="px-6 py-4 text-center">
                        {(role === "admin" || role === "superadmin") && (

 <div className="flex items-center justify-center gap-3">
                          <button
                            title="Print Barcode"
                            onClick={() => {
                              setSelectedBarcode(item.name);
                              setShowBarcodeModal(true);
                            }}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-gray-500 hover:border-red-100 hover:shadow-md transition-all active:scale-90"
                          >
                            <BarcodeIcon />
                          </button>
                          <button
                            title="Print QR code"
                            onClick={() => {
                              setSelectedLink(item.link || item.name);
                              setShowQRModal(true);
                            }}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-gray-500 hover:border-red-100 hover:shadow-md transition-all active:scale-90"
                          >
                            <QrCode />
                          </button>
                        </div>
                        )}
                        
                      </td>

                      {/* PRINT */}
                      <td className="px-6 py-4 text-right">
                        <button
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg"
                          onClick={() => {
                            setPrintProduct(item);
                            setShowPrintModal(true);
                          }}
                        >
                          <Printer size={16} />
                          <span>Print</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {/* --- PAGINATION FOOTER --- */}
<div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
    Showing Page <span className="text-slate-900">{currentPage}</span> of {totalPages}
  </div>

  <div className="flex items-center gap-2 font-['Lexend']">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
      className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
    >
      Prev
    </button>

    <div className="flex gap-1">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${
            currentPage === i + 1
              ? "bg-[#FA9C42] text-white shadow-lg shadow-orange-200"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(prev => prev + 1)}
      className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
    >
      Next
    </button>
  </div>
</div>
        </div>
      </div>
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#FFF7EF] p-6 rounded-xl shadow-xl text-center w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Product Link QR Code</h2>
            <div className="flex justify-center bg-white p-4 rounded-lg mb-4" id="qr-code-ref">
              <QRCode
                value={selectedLink}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-xs text-gray-500 mt-3 break-all">
              {selectedLink}
            </p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={async () => {
                  const svgElement = document.querySelector('#qr-code-ref svg');
                  if (svgElement) {
                    const svgData = new XMLSerializer().serializeToString(svgElement);
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();

                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      ctx.fillStyle = 'white';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      ctx.drawImage(img, 0, 0);

                      const link = document.createElement('a');
                      link.href = canvas.toDataURL('image/png');
                      link.download = `qr-code-${Date.now()}.png`;
                      link.click();
                    };

                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                  }
                }}
                className="flex-1 bg-green-600 text-white px-3  py-2 rounded-lg font-bold hover:bg-green-700 transition-all"
              >
                Download PNG
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-lg font-bold hover:bg-gray-500 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-opacity p-4">
          <div className="w-full max-w-[850px] bg-[#FFF7EF] rounded-3xl shadow-2xl overflow-hidden border border-white/20 max-h-[95vh] flex flex-col">

            {/* HEADER */}
            <div className="px-10 pt-8 pb-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FA9C42]/10 rounded-lg text-[#FA9C42]">
                    <Package size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                      {modalMode === "add" ? "Add New Product" : modalMode === "edit" ? "Edit Product" : "View Product"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Manage inventory details and batch assignments.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors group"
                >
                  <X className="w-6 h-6 text-slate-400 group-hover:text-slate-600" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE FORM AREA */}
            <form onSubmit={saveProduct} className="px-10 pb-8 overflow-y-auto flex-grow custom-scrollbar">
              <div className="space-y-8">

                {/* SECTION: BASIC INFO */}
                <div className="space-y-5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#FA9C42] border-b border-[#FA9C42]/10 pb-2">Primary Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    {/* IMAGE UPLOAD WITH PREVIEW */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 ml-1">Product Image</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white border-2 border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                          {product.imagePreview ? (
                            <img src={product.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <Upload className="text-slate-300" size={20} />
                          )}
                        </div>
                        <label className={`flex-grow flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${modalMode === 'view' ? 'hidden' : 'bg-white border-slate-200 hover:border-[#FA9C42]'}`}>
                          <span className="text-xs font-bold text-slate-500">Choose Product Image</span>
                          <input type="file" className="hidden" onChange={handleImageUpload} disabled={modalMode === "view"} />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 ml-1">Product Name *</label>
                      <input
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        disabled={modalMode === "view"}
                        placeholder="e.g. Italian Glazed Marble"
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none disabled:bg-slate-50 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 ml-1">Size / Dimension *</label>
                      <input
                        name="size"
                        value={product.size}
                        onChange={handleChange}
                        disabled={modalMode === "view"}
                        placeholder="600x1200 mm"
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none disabled:bg-slate-50 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 ml-1">Brand Name </label>
                      <select
                        name="brand"
                        value={product.brand}
                        onChange={handleChange}
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none disabled:bg-slate-50 transition-all"
                        required
                      >
                        <option value="">Select Brand</option>
                        {brandList
                          .filter((brand) => brand.status === "Available")
                          .map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                      </select>

                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 ml-1">Category</label>
                      <select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none disabled:bg-slate-50 transition-all"
                      >
                        <option value="">Select Category</option>
                        {categoryList
                          .filter((cat) => cat.status === "Available")
                          .map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>

                    </div>
                  </div>
                </div>

                {/* SECTION: PRICING & STATUS */}
                <div className="space-y-5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#FA9C42] border-b border-[#FA9C42]/10 pb-2">Pricing & Logistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 ml-1">Rate (₹)</label>
                      <input
                        name="rate"
                        type="number"
                        value={product.rate}
                        onChange={handleChange}
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none disabled:bg-slate-50 transition-all font-bold text-[#FA9C42]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 ml-1">Quality Grade</label>
                      <select
                        name="quality"
                        value={product.quality}
                        onChange={handleChange}
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none disabled:bg-slate-50 transition-all"
                      >
                        <option value="">Select Quality</option>
                        {qualityList
                          .filter((q) => q.status === "Available")
                          .map((q) => (
                          <option key={q.id} value={q.name}>
                            {q.name}
                          </option>
                        ))}
                      </select>

                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 ml-1">Availability</label>
                      <select
                        name="status"
                        value={product.status}
                        onChange={handleChange}
                        disabled={modalMode === "view"}
                        className={`w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none disabled:bg-slate-50 transition-all appearance-none font-bold ${product.status === 'Available' ? 'text-green-600' : 'text-red-500'}`}
                      >
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 flex gap-10">
                    <div>
<label className="text-xs font-semibold text-slate-600 ml-1">Godown Access</label>
                    <div className="flex gap-4">
                      {["KKW", "TCS"].map((g) => (
                        <label key={g} className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all cursor-pointer ${product.godown.includes(g) ? 'bg-[#FA9C42] border-[#FA9C42] text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={product.godown.includes(g)}
                            disabled={modalMode === "view"}
                            onChange={() => handleGodownSelect(g)}
                          />
                          <span className="text-xs font-bold uppercase tracking-widest">{g}</span>
                        </label>
                      ))}
                    </div>

                      </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 ml-1"> Product Cov </label>
                      <input
                        name="cov"
                        type="number"
                        value={product.cov}
                        onChange={handleChange}
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none disabled:bg-slate-50 transition-all font-bold text-[#FA9C42]"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION: BATCH DETAILS */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#FA9C42]/10 pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#FA9C42]">Stock Batches</h3>
                    {modalMode !== "view" && (
                      <button
                        type="button"
                        onClick={addBatchRow}
                        className="text-[10px] bg-slate-800 text-white px-3 py-1 rounded-full hover:bg-black transition-colors"
                      >
                        + Add Batch
                      </button>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Batch No</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Quantity</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Location</th>
                          {modalMode !== "view" && <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-400 uppercase">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {batchList.map((batch, index) => (
                          <tr key={index}>
                            <td className="p-2">
                              <input
                                className="w-full bg-transparent p-2 outline-none text-sm"
                                value={batch.batchNo}
                                placeholder="B-001"
                                disabled={modalMode === "view"}
                                onChange={(e) => handleBatchChange(index, "batchNo", e.target.value)}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                className="w-full bg-transparent p-2 outline-none text-sm"
                                value={batch.qty}
                                placeholder="100"
                                disabled={modalMode === "view"}
                                onChange={(e) => handleBatchChange(index, "qty", e.target.value)}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                className="w-full bg-transparent p-2 outline-none text-sm"
                                value={batch.location}
                                placeholder="Aisle 4"
                                disabled={modalMode === "view"}
                                onChange={(e) => handleBatchChange(index, "location", e.target.value)}
                              />
                            </td>
                            {modalMode !== "view" && (
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  className="p-2 text-red-300 hover:text-red-500 transition-colors"
                                  onClick={() => removeBatchRow(index)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* STICKY FOOTER */}
              <div className="flex items-center justify-end gap-4 mt-10 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => Handleclose()}
                  className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button
                    type="submit"
                    className="px-12 py-3 rounded-xl bg-[#FA9C42] text-white font-bold shadow-lg shadow-[#FA9C42]/30 hover:shadow-[#FA9C42]/40 hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    {modalMode === "edit" ? "Update Product" : "Save Product"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARCODE MODAL */}
      {showBarcodeModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#FFF7EF] p-6 rounded-xl shadow-xl text-center w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Product Barcode</h2>

            <div className="flex justify-center bg-white p-6 rounded-lg mb-4" id="barcode-ref">
              <Barcode value={selectedBarcode || "Product"} height={60} width={2} fontSize={14} />
            </div>

            <p className="text-xs text-gray-500 mb-4 font-mono">
              {selectedBarcode}
            </p>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  const canvas = document.querySelector('#barcode-ref svg');
                  if (canvas) {
                    const svgData = new XMLSerializer().serializeToString(canvas);
                    const canvasElement = document.createElement('canvas');
                    const ctx = canvasElement.getContext('2d');
                    const img = new Image();
                    img.onload = () => {
                      canvasElement.width = img.width;
                      canvasElement.height = img.height;
                      ctx.fillStyle = 'white';
                      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
                      ctx.drawImage(img, 0, 0);
                      const link = document.createElement('a');
                      link.href = canvasElement.toDataURL('image/png');
                      link.download = `${selectedBarcode}-barcode.png`;
                      link.click();
                    };
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                  }
                }}
                className="flex-1 bg-green-600 text-white px-2 py-1 rounded-lg font-bold hover:bg-green-700 transition-all"
              >
                Download PNG
              </button>
              <button
                onClick={() => setShowBarcodeModal(false)}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-500 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showBatchModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-opacity p-4">
          <div className="w-full max-w-[650px] bg-[#FFF7EF] rounded-[24px] shadow-2xl overflow-hidden border border-white/20 flex flex-col animate-in fade-in zoom-in duration-200">

            {/* HEADER */}
            <div className="px-8 pt-6 pb-4 flex items-center justify-between border-b border-[#FA9C42]/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FA9C42]/10 rounded-lg text-[#FA9C42]">
                  <Layers size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Batch Inventory</h3>
                  <p className="text-xs text-slate-500 font-medium">Detailed stock breakdown for this product</p>
                </div>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>

            {/* BODY / TABLE */}
            <div className="p-6">
              <div className="max-h-[350px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Batch Number</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Available Qty</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage Location</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {selectedBatches.length > 0 ? (
                      selectedBatches.map((b, index) => (
                        <tr key={index} className="group hover:bg-[#FA9C42]/5 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-700 font-mono">
                              {b.batch_no || b.batchNo}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                              {b.qty} units
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin size={14} className="text-slate-400" />
                              <span className="font-medium">{b.location}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <PackageOpen size={40} className="text-slate-200" />
                            <p className="text-slate-400 text-sm italic font-medium">No batch data available for this item</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-8 py-5 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Total Batches: {selectedBatches.length}
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-6 py-2 rounded-xl bg-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-black transition-all active:scale-95"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrintModal && printProduct && (
        /* 1. Backdrop: Fixed h-[200px] to inset-0 to allow full screen centering */
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 print:p-0 print:bg-white">

          {/* 2. Main Container: Added fixed height and overflow scroll */}
          <div className="bg-[#FFF7EF] w-full max-w-[850px] rounded-3xl shadow-2xl flex flex-col max-h-[700px] print:max-h-none print:shadow-none print:bg-white print:w-full">

            {/* MODAL HEADER (STAYS FIXED AT TOP) */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-center shrink-0 print:hidden">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Printer size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Print Preview</h2>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={22} className="text-slate-400" />
              </button>
            </div>

            {/* 3. SCROLLABLE AREA: Added overflow-y-auto and custom scrollbar */}
            <div className="px-8 pb-4 overflow-y-auto flex-grow custom-scrollbar print:overflow-visible print:p-0">

              {/* ================= PRINT AREA ================= */}
              <div id="print-area" className="bg-white p-8 rounded-2xl border border-slate-100 print:border-none print:p-0 text-slate-900">

                {/* FORMAL COMPANY HEADER */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                  <div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                      Your Company Name
                    </h1>
                    <div className="mt-2 text-sm text-slate-500 space-y-0.5 font-medium">
                      <p>Industrial Estate, Phase II, Nashik – 422001</p>
                      <p>Email: contact@company.com | GSTIN: 27AAAAA0000A1Z5</p>
                      <p>Phone: +91 98765 43210</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="bg-slate-900 text-white px-4 py-1 text-xs font-bold uppercase tracking-widest mb-2 inline-block">
                      Product Specifications
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* PRIMARY DETAILS GRID */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-12 mb-10">
                  {[
                    ["Product Name", printProduct.name],
                    ["Dimensions / Size", printProduct.size || "Standard"],
                    ["Brand / Manufacturer", printProduct.brand],
                    ["Product Category", printProduct.category],
                    ["Quality Grade", printProduct.quality],
                    ["Standard Rate", `₹ ${printProduct.rate} /-`],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between items-end border-b border-slate-100 pb-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{label}</span>
                      <span className="text-sm font-bold text-slate-800">{value}</span>
                    </div>
                  ))}
                </div>

                {/* BATCH INVENTORY SECTION */}
                {printProduct.batches?.length > 0 ? (
                  <div className="mb-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-[#FA9C42]"></div>
                      Current Inventory Batches
                    </h3>

                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="border-y border-slate-200 p-3 text-left text-[10px] font-bold uppercase text-slate-500">Batch No.</th>
                          <th className="border-y border-slate-200 p-3 text-center text-[10px] font-bold uppercase text-slate-500">Quantity</th>
                          <th className="border-y border-slate-200 p-3 text-left text-[10px] font-bold uppercase text-slate-500">Storage Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {printProduct.batches.map((b, i) => (
                          <tr key={i} className="font-mono text-sm">
                            <td className="p-3 font-bold text-slate-700">{b.batch_no || b.batchNo}</td>
                            <td className="p-3 text-center font-bold text-blue-600">{b.qty}</td>
                            <td className="p-3 text-slate-600 uppercase">{b.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-6 border-2 border-dashed border-slate-100 text-center mb-10">
                    <p className="text-slate-400 text-sm italic">No batch assignments found for this product.</p>
                  </div>
                )}

                {/* FORMAL FOOTER */}
                <div className="mt-20 flex justify-between items-end">
                  <div className="text-[10px] text-slate-400 max-w-[250px]">
                    <p className="font-bold uppercase mb-1">Terms & Notes:</p>
                    <p>This is a computer-generated stock sheet. Verify stock physically before dispatch.</p>
                  </div>

                  <div className="text-center min-w-[180px]">
                    <div className="h-12 w-full border-b border-slate-300 mb-2"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </div>
            {/* ================= END SCROLLABLE AREA ================= */}

            {/* ACTION BUTTONS (STAYS FIXED AT BOTTOM) */}
            <div className="p-8 border-t border-slate-100 shrink-0 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-10 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95"
              >
                <Printer size={18} />
                Confirm & Print
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
