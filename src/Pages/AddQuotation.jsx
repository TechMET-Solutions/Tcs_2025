import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AddQuotation() {
  const editorHeader = useRef(null);
  const editorFooter = useRef(null);

  // ---------------- CLIENT STATES ----------------
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [attendedBy, setAttendedBy] = useState("");
  const [architect, setArchitect] = useState("");

  const [attendeeList, setAttendeeList] = useState([]);
  const [architectList, setArchitectList] = useState([]);
  const [products, setProducts] = useState([]);

  // ---------------- FETCH PRODUCT API ----------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/product/list");
        console.log("PRODUCT API RESPONSE:", res.data.products);
        setProducts(res.data.products);
      } catch (err) {
        console.log("PRODUCT API ERROR:", err);
      }
    };

    fetchProducts();
  }, []);

  // ---------------- DEFAULT SECTIONS ----------------
  const [headerSection, setHeaderSection] = useState(
   "This is with reference to our discussion with you regarding your requirement; here we quote our best price for your prestigious project as below:"
  );

  const [bottomSection, setBottomSection] = useState(`<p>Above rates are including GST @ 18%, Excluding unloading charge and this are Nashik warehouse rates.</p><table width="100%" style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; width: 1387.46px; font-size: 18px;"><tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><td width="20%" style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">Payment Term</strong></td><td width="5%" style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">:</strong></td><td width="70%" style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><em style="box-sizing: border-box;">100% Advance.</em></td></tr><tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">Delivery Period</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">:</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;">7 TO 8 Days from the date of order / dispatch schedule.</td></tr><tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">Billing</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">:</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;">GST Billing @ 18%</td></tr><tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">Validity of price</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">:</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;">30 Days from Date of Quotation</td></tr></tbody></table><p><strong style="box-sizing: border-box; font-weight: bolder;"><br></strong></p><p><strong style="box-sizing: border-box; font-weight: bolder;">BA</strong><strong style="box-sizing: border-box; font-weight: bolder;">NK DETAILS :</strong></p><p><strong style="box-sizing: border-box; font-weight: bolder;">Yes Bank :<span>&nbsp;</span></strong>THE CERAMIC STUDIO</p><p><strong style="box-sizing: border-box; font-weight: bolder;">A/c no. :<span>&nbsp;</span></strong>002163700002424</p><p><strong style="box-sizing: border-box; font-weight: bolder;">Branch :</strong><span>&nbsp;</span>Canada Corner</p><p><strong style="box-sizing: border-box; font-weight: bolder;">IFSC :<span>&nbsp;</span></strong>YESB0000021</p><p>We again express our gratitude for your esteemed organization and looking forward for a long and healthy business relationship. Assuring you of our best service all the times.</p><p>Thanking You&nbsp;</p><p><strong style="box-sizing: border-box; font-weight: bolder;">THE CERAMIC STUDIO-NASHIK</strong><strong style="box-sizing: border-box; font-weight: bolder;">.</strong></p><p><strong style="box-sizing: border-box; font-weight: bolder;">SALES (8847784888)</strong></p><p><strong style="box-sizing: border-box; font-weight: bolder;">ACCOUNT (8847785888)</strong></p><p><br></p><p><br></p>`);

  // ---------------- EMPTY PRODUCT ROW ----------------
  const emptyRow = {
    productId: "",
    productName: "",
    size: "",
    quality: "",
    rate: 0,
    cov: 1,
    box: 1,
    weight: 0,
    tWeight: 0,
    discount: 0,
    disAmt: 0,
    discountedRate: 0,
    total: 0,
    area: 0,
    batches: [],
  };

  const [rows, setRows] = useState([emptyRow]);

  // ---------------- CALCULATIONS ----------------
  const recalcRow = (row) => {
    const rate = Number(row.rate);
    const cov = Number(row.cov);
    const box = Number(row.box);
    const weight = Number(row.weight);
    const discount = Number(row.discount);

    const tWeight = box * weight;
    const disAmt = (rate * discount) / 100;
    const discountedRate = rate - disAmt;
    const total = discountedRate * cov * box;
    const area = cov * box;

    return { ...row, tWeight, disAmt, discountedRate, total, area };
  };

  // ---------------- SELECT PRODUCT ----------------
  const selectProduct = (i, productId) => {
    const p = products.find((x) => x.id == productId);
    if (!p) return;

    const updated = [...rows];

    updated[i] = recalcRow({
      ...updated[i],
      productId: p.id,
      productName: p.name,
      size: p.size,
      quality: p.quality,
      rate: Number(p.rate),
      weight: 0,
      cov: 1,
      box: 1,
      batches: p.batches,
    });

    setRows(updated);
  };

  // ---------------- UPDATE ANY FIELD ----------------
  const updateRowField = (i, key, value) => {
    const updated = [...rows];
    updated[i][key] = value;
    updated[i] = recalcRow(updated[i]);
    setRows(updated);
  };

  // ---------------- ADD/REMOVE ROW ----------------
  const addRow = () => setRows([...rows, emptyRow]);

  const removeRow = (i) => {
    if (rows.length === 1) return;
    const updated = rows.filter((_, index) => index !== i);
    setRows(updated);
  };

  // ---------------- GRAND TOTAL ----------------
  const grandTotal = rows.reduce((sum, r) => sum + Number(r.total), 0).toFixed(2);

  // ---------------- SAVE QUOTATION API ----------------
  const saveQuotation = async () => {
    try {
      const payload = {
        clientDetails: {
          name: clientName,
          contactNo: clientContact,
          email: clientEmail,
          address: clientAddress,
          attendedBy,
          architect,
        },
        headerSection,
        bottomSection,
        rows,
        grandTotal,
      };

      const res = await axios.post("http://localhost:5000/api/Quotation/saveQuotation", payload);

      if (res.data.success) {
        alert("Quotation Saved Successfully!");
      }
    } catch (err) {
      console.log("SAVE ERROR:", err);
      alert("Failed to save quotation!");
    }
  };

  return (
    <div className="p-6 font-['Lexend'] w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Add Quotation</h2>

      {/* ---------------- CLIENT DETAILS ---------------- */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border mb-8">
        <h3 className="text-xl font-semibold mb-4">Client Details</h3>

        <div className="grid grid-cols-2 gap-6">
          <input className="input" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <input className="input" placeholder="Contact No" value={clientContact} onChange={(e) => setClientContact(e.target.value)} />
          <input className="input" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
          <textarea className="input" placeholder="Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />

          <select className="input" onChange={(e) => setAttendedBy(e.target.value)}>
            <option>Select Attended By</option>
            {attendeeList.map((x) => <option key={x}>{x}</option>)}
          </select>

          <select className="input" onChange={(e) => setArchitect(e.target.value)}>
            <option>Select Architect</option>
            {architectList.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
      </div>

      {/* ---------------- PRODUCT TABLE ---------------- */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border">
        <h3 className="text-xl font-semibold mb-4">Product Details</h3>

        <div className="overflow-x-auto rounded-xl border shadow">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr className="text-center">
                {["Product", "Size", "Quality", "Rate", "Coverage", "Box", "TWGT", "Dis %", "Dis Amt", "D.Rate", "Total", "Area", "Action"].map((h) => (
                  <th key={h} className="border p-3">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border">
                  <td className="border p-2">
                    <select className="input" value={r.productId} onChange={(e) => selectProduct(i, e.target.value)}>
                      <option value="">SELECT</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </td>

                  <td className="border p-2 text-center">{r.size}</td>
                  <td className="border p-2 text-center">{r.quality}</td>

                  <td className="border p-2">
                    <input className="input" value={r.rate} onChange={(e) => updateRowField(i, "rate", e.target.value)} />
                  </td>

                  <td className="border p-2">
                    <input className="input" value={r.cov} onChange={(e) => updateRowField(i, "cov", e.target.value)} />
                  </td>

                  <td className="border p-2">
                    <input className="input" value={r.box} onChange={(e) => updateRowField(i, "box", e.target.value)} />
                  </td>

                  <td className="border p-2 text-center">{r.tWeight}</td>

                  <td className="border p-2">
                    <input className="input" value={r.discount} onChange={(e) => updateRowField(i, "discount", e.target.value)} />
                  </td>

                  <td className="border p-2 text-center">{r.disAmt}</td>
                  <td className="border p-2 text-center">{r.discountedRate}</td>
                  <td className="border p-2 text-center">{r.total}</td>
                  <td className="border p-2 text-center">{r.area}</td>

                  <td className="border p-2 text-center">
                    <button className="text-red-600" onClick={() => removeRow(i)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={addRow} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl">+ Add Row</button>

        <div className="mt-5 text-right text-xl font-bold">
          Grand Total: ₹ {grandTotal}
        </div>
      </div>

      {/* ---------------- SAVE BUTTON ---------------- */}
      <button onClick={saveQuotation} className="mt-6 bg-green-600 px-6 py-3 text-white rounded-xl text-lg">
        Save Quotation
      </button>

      {/* ---------------- INPUT CSS ---------------- */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          padding: 8px 10px;
          border-radius: 10px;
          background: #fff;
        }
      `}</style>
    </div>
  );
}
