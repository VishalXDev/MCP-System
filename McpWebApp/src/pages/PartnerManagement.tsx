import { useEffect, useState, FormEvent } from "react";
import API from "../utils/axios";

interface Partner {
  _id: string;
  name: string;
  email: string;
  commission: number;
  isOnline: boolean;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  commission: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  commission?: number;
  isOnline?: boolean;
}

export default function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    commission: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPartners = async () => {
    try {
      const res = await API.get<User[]>("/users");
      const users = res.data;

      const partnerList: Partner[] = users
        .filter((u) => u.role === "partner")
        .map((u) => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          commission: u.commission || 0,
          isOnline: u.isOnline ?? false,
        }));

      setPartners(partnerList);
    } catch (err) {
      console.error("Failed to fetch partners", err);
    }
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/users/partner", form);
      setForm({ name: "", email: "", password: "", commission: 0 });
      fetchPartners();
    } catch (err) {
      console.error("Error adding partner", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return;

    try {
      await API.delete(`/users/${id}`);
      fetchPartners();
    } catch (err) {
      console.error("Error deleting partner", err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Pickup Partner Management</h1>

      {/* Add Partner Form */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Add New Partner</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            type="number"
            placeholder="Commission (%)"
            value={form.commission}
            onChange={(e) =>
              setForm({ ...form, commission: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Partner"}
        </button>
      </form>

      {/* Partner List */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Current Partners</h2>
        {partners.length === 0 ? (
          <p className="text-gray-500">No partners found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-center">Commission (%)</th>
                <th className="p-3 text-center">Online</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p._id} className="border-t text-sm hover:bg-gray-50">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3 text-center">{p.commission}</td>
                  <td className="p-3 text-center">{p.isOnline ? "✅" : "❌"}</td>
                  <td className="p-3 text-right">
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => handleDelete(p._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
