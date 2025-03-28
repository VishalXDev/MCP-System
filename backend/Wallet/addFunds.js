router.post("/wallet/addFunds", authMiddleware, async (req, res) => {
    const { partnerId, amount } = req.body;
    const partner = await PickupPartner.findById(partnerId);
    partner.walletBalance += amount;
    await partner.save();
    res.json({ success: true, balance: partner.walletBalance });
});
