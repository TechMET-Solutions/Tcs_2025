import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addPurchaseAPI, getSinglePurchaseAPI } from "../Component/API/inventoryApi";
import { getProductAPI } from "../Component/API/productApi";

export default function AddInventory() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const editId = state?.editId ?? null;

  const [products, setProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  const emptyRow = {
    productId: "",
    productName: "",
    size: "",
    quality: "",
    rate: "",
    cov: 1,
    batchNo: "",
    batches: [],
    availQty: 0,
    qty: "",
    total: 0,
    godown: "KKW",
  };

  const [rows, setRows] = useState([emptyRow]);

  const [purchaseMeta, setPurchaseMeta] = useState({
    purchaseDate: new Date().toISOString().slice(0, 10),
    billNo: "",
    clientName: "",
    clientContact: "",
  });

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    getProductAPI().then(res => setProducts(res.data.products));
  }, []);

  // ✅ EDIT MODE (LOAD AFTER PRODUCTS ARRIVE)
  useEffect(() => {
    if (!editId) return;
    if (products.length === 0) return; // ⛔ WAIT FOR PRODUCTS

    const loadData = async () => {
      const res = await getSinglePurchaseAPI(editId);
      const p = res.data.purchase;

      // META
      setPurchaseMeta({
        purchaseDate: p.purchase_date?.slice(0, 10),
        billNo: p.bill_no,
        clientName: p.client_name,
        clientContact: p.client_contact,
      });

      // ITEMS
      const loadedRows = p.items.map((item) => {
        const product = products.find((pr) => pr.id === item.product_id);

        return {
          productId: item.product_id,
          productName: product?.name || "",
          size: product?.size || "",
          quality: product?.quality || "",
          rate: Number(item.rate),
          cov: Number(item.cov),
          batchNo: item.batch_no,
          batches: product?.batches || [],
          availQty: product?.batches.find(b => b.batch_no == item.batch_no)?.qty || 0,
          qty: Number(item.qty),
          total: Number(item.total),
          godown: item.godown,
        };
      });

      setRows(loadedRows.length ? loadedRows : [emptyRow]);
    };

    loadData();
  }, [editId, products]);

  // 🔢 SUBTOTAL UPDATE
  useEffect(() => {
    const sum = rows.reduce((a, r) => a + (Number(r.total) || 0), 0);
    setSubTotal(sum);
  }, [rows]);

  // META CHANGE
  const handleMetaChange = (e) => {
    setPurchaseMeta({ ...purchaseMeta, [e.target.name]: e.target.value });
  };

  // PRODUCT SELECT
  const selectProduct = (i, id) => {
    const updated = [...rows];
    const product = products.find((p) => p.id == id);

    if (product) {
      updated[i] = {
        ...updated[i],
        productId: id,
        productName: product.name,
        size: product.size,
        quality: product.quality,
        rate: Number(product.rate),
        batches: product.batches || [],
        batchNo: "",
        availQty: 0,
        qty: "",
        cov: 1,
        total: 0,
      };
    }

    setRows(updated);
  };

  // BATCH SELECT
  const selectBatch = (i, batchNo) => {
    const updated = [...rows];
    const row = updated[i];

    row.batchNo = batchNo;

    const batch = row.batches.find(b => b.batch_no == batchNo);

    row.availQty = batch ? Number(batch.qty) : 0;
    row.total = Number(row.qty || 0) * Number(row.rate || 0) * Number(row.cov || 1);

    setRows(updated);
  };

  // UPDATE FIELDS
  const updateRowField = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;

    const r = updated[i];
    r.total = Number(r.qty || 0) * Number(r.rate || 0) * Number(r.cov || 1);

    setRows(updated);
  };

  const addRow = () => setRows([...rows, { ...emptyRow }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  // SAVE PURCHASE
  const savePurchase = async (e) => {
    e.preventDefault();

    const res = await addPurchaseAPI({
      ...purchaseMeta,
      items: rows,
      subTotal,
    });

    alert("Saved Successfully, Bill: " + res.data.billNo);
    navigate("/inventory/manage");
  };

  return (
    <form onSubmit={savePurchase} className="p-6 font-['Lexend']">
      <div className="bg-white p-6 shadow-xl rounded-2xl">

        {/* META SECTION */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {["purchaseDate", "billNo", "clientName", "clientContact"].map((f) => (
            <div key={f}>
              <label className="font-semibold">{f}</label>
              <input
                type={f === "purchaseDate" ? "date" : "text"}
                name={f}
                value={purchaseMeta[f]}
                onChange={handleMetaChange}
                className="mt-2 p-3 border rounded-xl w-full"
              />
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border rounded-xl">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "Product", "Size", "Quality", "Rate", "COV", "Batch",
                  "Avail", "Qty", "Total", "Godown", "Action",
                ].map((h) => (
                  <th key={h} className="p-3">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {/* PRODUCT */}
                  <td className="p-2">
                    <select
                      value={r.productId}
                      onChange={(e) => selectProduct(i, e.target.value)}
                      className="inputCell"
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </td>

                  <td className="p-2"><input readOnly value={r.size} className="inputCell bg-gray-100" /></td>
                  <td className="p-2"><input readOnly value={r.quality} className="inputCell bg-gray-100" /></td>

                  <td className="p-2">
                    <input
                      value={r.rate}
                      onChange={(e) => updateRowField(i, "rate", e.target.value)}
                      className="inputCell"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      value={r.cov}
                      onChange={(e) => updateRowField(i, "cov", e.target.value)}
                      className="inputCell"
                    />
                  </td>

                  {/* BATCH */}
                  <td className="p-2">
                    <select
                      value={r.batchNo}
                      onChange={(e) => selectBatch(i, e.target.value)}
                      className="inputCell"
                    >
                      <option value="">Select Batch</option>
                      {r.batches.map((b) => (
                        <option key={b.batch_no} value={b.batch_no}>
                          {b.batch_no} – {b.location}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-2">
                    <input readOnly value={r.availQty} className="inputCell bg-gray-100" />
                  </td>

                  <td className="p-2">
                    <input
                      value={r.qty}
                      onChange={(e) => updateRowField(i, "qty", e.target.value)}
                      className="inputCell"
                    />
                  </td>

                  <td className="p-2"><input readOnly value={r.total} className="inputCell bg-gray-100" /></td>

                  <td className="p-2">
                    <select
                      value={r.godown}
                      onChange={(e) => updateRowField(i, "godown", e.target.value)}
                      className="inputCell"
                    >
                      <option>KKW</option>
                      <option>MN</option>
                      <option>TCS</option>
                    </select>
                  </td>

                  <td className="p-2 text-center">
                    <button onClick={() => removeRow(i)} type="button">
                      <Trash2 className="text-red-600" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUBTOTAL */}
        <div className="flex justify-end mt-6">
          <input readOnly value={subTotal} className="p-3 border rounded-xl bg-gray-100" />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button type="button" onClick={addRow} className="px-5 py-2 bg-blue-600 text-white rounded-xl flex gap-2">
            <Plus size={18} /> Add Row
          </button>

          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-xl">
            Save
          </button>
        </div>
      </div>

      <style>{`
        .inputCell {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
      `}</style>
    </form>
  );
}
