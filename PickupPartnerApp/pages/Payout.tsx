import React, { useState } from "react";
import axios from "axios";

const Payout = () => {
  const [amount, setAmount] = useState("");

  const requestPayout = async () => {
    await axios.post("/api/wallet/request-payout", { amount: Number(amount) });
    alert("Payout request submitted");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Request Payout</h2>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="border p-2 w-full" />
      <button onClick={requestPayout} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Request Payout
      </button>
    </div>
  );
};

export default Payout;
