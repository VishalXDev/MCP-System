import { useEffect, useState, FormEvent } from "react";
import API from "../utils/axios.ts";

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

  const fetchPartners = async () => {
    const res = await API.get("/users");
    const users: User[] = res.data;

    // Filter and cast to Partner[]
    const partnerList: Partner[] = users
      .filter((u) => u.role === "partner")
      .map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        commission: u.commission || 0,
        isOnline: u.isOnline ?? false, // default false if undefined
      }));

    setPartners(partnerList);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    await API.post("/users/partner", form);
    setForm({ name: "", email: "", password: "", commission: 0 });
    fetchPartners();
  };

  const handleDelete = async (id: string) => {
    await API.delete(`/users/${id}`);
    fetchPartners();
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Pickup Partner Management</h1>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold text-lg">Add New Partner</h2>
        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          type="number"
          placeholder="Commission (%)"
          value={form.commission}
          onChange={(e) =>
            setForm({ ...form, commission: parseFloat(e.target.value) })
          }
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Partner
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-3">Current Partners</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Commission (%)</th>
              <th>Online?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p._id} className="border-t">
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.commission}</td>
                <td>{p.isOnline ? "✅" : "❌"}</td>
                <td>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(p._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
