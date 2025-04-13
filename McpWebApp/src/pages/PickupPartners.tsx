import React, { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

// === Types ===
interface PickupPartner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  commission?: number;
  walletBalance?: number;
  assignedOrders?: unknown[]; // Replace with a specific type if available
}

type NewPartnerField = "name" | "email" | "phone" | "password" | "commission";

interface NewPartner {
  name: string;
  email: string;
  phone: string;
  password: string;
  commission: number;
}

// === API Handlers ===
const fetchPartners = async (): Promise<PickupPartner[]> => {
  const res = await API.get<PickupPartner[]>("/partners");
  return res.data;
};

const deletePartner = async (id: string): Promise<void> => {
  await API.delete(`/partners/${id}`);
};

const updateCommission = async (id: string, commission: number): Promise<void> => {
  await API.patch(`/partners/${id}/commission`, { commission });
};

// === Component ===
const PickupPartners: React.FC = () => {
  const [partners, setPartners] = useState<PickupPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPartner, setNewPartner] = useState<NewPartner>({
    name: "",
    email: "",
    phone: "",
    password: "",
    commission: 0,
  });

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await fetchPartners();
      setPartners(data);
    } catch (error: unknown) {
      console.error("Load Error:", error);
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deletePartner(id);
      toast.success("Partner deleted");
      loadPartners();
    } catch (error: unknown) {
      console.error("Delete Error:", error);
      toast.error("Error deleting partner");
    }
  };

  const handleCommissionChange = async (id: string, value: number) => {
    try {
      await updateCommission(id, value);
      toast.success("Commission updated");
      loadPartners();
    } catch (error: unknown) {
      console.error("Commission Update Error:", error);
      toast.error("Failed to update commission");
    }
  };

  const handleAddPartner = async () => {
    try {
      const res = await API.post<PickupPartner>("/partners", newPartner);
      toast.success("Partner added!");
      setPartners([...partners, res.data]);
      setNewPartner({ name: "", email: "", phone: "", password: "", commission: 0 });
      setShowAddModal(false);
    } catch (error: unknown) {
      console.error("Add Partner Error:", error);
      toast.error("Failed to add partner");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pickup Partners</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Partner
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white shadow rounded-xl overflow-hidden text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Commission (%)</th>
              <th className="px-4 py-2">Wallet (₹)</th>
              <th className="px-4 py-2">Assigned Orders</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner._id} className="border-b">
                <td className="px-4 py-2">{partner.name}</td>
                <td className="px-4 py-2">{partner.email}</td>
                <td className="px-4 py-2">{partner.phone}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={partner.commission || 0}
                    onBlur={(e) =>
                      handleCommissionChange(partner._id, Number(e.target.value))
                    }
                    className="w-20 border p-1 text-sm rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  ₹{partner.walletBalance?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-2">{partner.assignedOrders?.length || 0}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(partner._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Partner</h3>
            <div className="space-y-3">
              {(Object.keys(newPartner) as NewPartnerField[]).map((field) => (
                <input
                  key={field}
                  type={
                    field === "commission"
                      ? "number"
                      : field === "password"
                      ? "password"
                      : "text"
                  }
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  value={String(newPartner[field])}
                  onChange={(e) =>
                    setNewPartner({
                      ...newPartner,
                      [field]:
                        field === "commission" ? Number(e.target.value) : e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPartner}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Add Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupPartners;
