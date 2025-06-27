import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchPendingSellers,approveSeller,rejectSeller } from "../api/auth";

export default function PendingSellers() {
  const [pending, setPending] = useState([]);

  const fetchPending = async () => {
    const res = await fetchPendingSellers();
    setPending(res.data);
  };

  const handleApprove = async (id) => {
    await approveSeller(id);
    toast.success("Seller approved");
    fetchPending();
  };

  const handleReject = async (id) => {
    await rejectSeller(id);
    toast("Seller rejected", { icon: "❌" });
    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Pending Sellers</h2>
      {pending.length === 0 ? (
        <p>No pending sellers</p>
      ) : (
        <div className="space-y-4">
          {pending.map((seller) => (
            <div
              key={seller._id.$oid}
              className="bg-white shadow-md p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{seller.name}</h3>
                <p>{seller.email} • {seller.phone}</p>
                <p>Store: {seller.store} • City: {seller.city}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleApprove(seller._id.$oid)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(seller._id.$oid)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
