import React, { useState, useEffect } from "react";
import {
  getCurrentPlanPrices,
  updateAllPlanPrices,
  updateSinglePlanPrice,
  createCoupon,
  createPromotionCode,
  getPromotionCodes,
  validatePromotionCode,
} from "../../api/serices/api_utils";

const PaymentControls = () => {
  const [activeTab, setActiveTab] = useState("plans");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Plan Management State
  const [planPrices, setPlanPrices] = useState({ basic: 0, pro: 0 });
  const [originalPrices, setOriginalPrices] = useState({ basic: 0, pro: 0 });

  // Coupon Creation State
  const [couponForm, setCouponForm] = useState({
    id: "",
    discountType: "percent", // 'percent' or 'amount'
    percentOff: "",
    amountOff: "",
    duration: "once",
    durationInMonths: "",
    maxRedemptions: "",
    redeemBy: "",
  });

  // Promotion Code Creation State
  const [promoForm, setPromoForm] = useState({
    couponId: "",
    code: "",
    maxRedemptions: "",
    expiresAt: "",
    firstTimeTransaction: false,
    minimumAmount: "",
  });

  // Promotion Codes List State
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoFilters, setPromoFilters] = useState({
    active: true,
    limit: 20,
  });

  // Validation State
  const [validationCode, setValidationCode] = useState("");
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    fetchPlanPrices();
    fetchPromotionCodes();
  }, []);

  const fetchPlanPrices = async () => {
    try {
      const response = await getCurrentPlanPrices();
      if (response.success) {
        const prices = response.data.plans;
        setPlanPrices(prices);
        setOriginalPrices(prices);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Failed to fetch plan prices");
    }
  };

  const fetchPromotionCodes = async () => {
    try {
      const response = await getPromotionCodes(promoFilters);
      if (response.success) {
        setPromoCodes(response.data.promotionCodes || []);
      } else {
        console.error("Failed to fetch promotion codes:", response.message);
      }
    } catch (error) {
      console.error("Error fetching promotion codes:", error);
    }
  };

  const handleUpdatePrices = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateAllPlanPrices(planPrices);
      if (response.success) {
        setSuccess("Plan prices updated successfully!");
        setOriginalPrices(planPrices);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Failed to update plan prices");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const couponData = {
        id: couponForm.id,
        duration: couponForm.duration,
        ...(couponForm.discountType === "percent"
          ? { percentOff: parseFloat(couponForm.percentOff) }
          : { amountOff: Math.round(parseFloat(couponForm.amountOff) * 100) }), // Convert to pence
        ...(couponForm.duration === "repeating" && {
          durationInMonths: parseInt(couponForm.durationInMonths),
        }),
        ...(couponForm.maxRedemptions && {
          maxRedemptions: parseInt(couponForm.maxRedemptions),
        }),
        ...(couponForm.redeemBy && { redeemBy: couponForm.redeemBy }),
      };

      const response = await createCoupon(couponData);
      if (response.success) {
        setSuccess("Coupon created successfully!");
        setCouponForm({
          id: "",
          discountType: "percent",
          percentOff: "",
          amountOff: "",
          duration: "once",
          durationInMonths: "",
          maxRedemptions: "",
          redeemBy: "",
        });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const promoData = {
        couponId: promoForm.couponId,
        code: promoForm.code.toUpperCase(),
        active: true,
        ...(promoForm.maxRedemptions && {
          maxRedemptions: parseInt(promoForm.maxRedemptions),
        }),
        ...(promoForm.expiresAt && { expiresAt: promoForm.expiresAt }),
        ...(promoForm.firstTimeTransaction && {
          firstTimeTransaction: promoForm.firstTimeTransaction,
        }),
        ...(promoForm.minimumAmount && {
          minimumAmount: Math.round(parseFloat(promoForm.minimumAmount) * 100),
        }),
      };

      const response = await createPromotionCode(promoData);
      if (response.success) {
        setSuccess("Promotion code created successfully!");
        setPromoForm({
          couponId: "",
          code: "",
          maxRedemptions: "",
          expiresAt: "",
          firstTimeTransaction: false,
          minimumAmount: "",
        });
        fetchPromotionCodes(); // Refresh the list
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Failed to create promotion code");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateCode = async () => {
    if (!validationCode.trim()) {
      setValidationResult(null);
      return;
    }

    try {
      const response = await validatePromotionCode(validationCode);
      if (response.success) {
        setValidationResult(response.data);
      } else {
        setValidationResult({ valid: false, error: response.message });
      }
    } catch (error) {
      setValidationResult({ valid: false, error: "Validation failed" });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB");
  };

  const hasUnsavedChanges = () => {
    return (
      planPrices.basic !== originalPrices.basic ||
      planPrices.pro !== originalPrices.pro
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,0,0,0.20)] p-6  md:w-[93vw] md:mx-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Payment Controls
        </h2>
        <p className="text-gray-600 mt-1">
          Manage subscription plans, coupons, and promotion codes
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: "plans", label: "Plan Pricing" },
            { id: "coupons", label: "Create Coupon" },
            { id: "promos", label: "Promotion Codes" },
            { id: "validate", label: "Validate Code" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Plan Pricing Tab */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Plan Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Plan Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={planPrices.basic}
                    onChange={(e) =>
                      setPlanPrices({
                        ...planPrices,
                        basic: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pro Plan Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={planPrices.pro}
                    onChange={(e) =>
                      setPlanPrices({
                        ...planPrices,
                        pro: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Current prices: Basic {formatCurrency(originalPrices.basic)},
                  Pro {formatCurrency(originalPrices.pro)}
                </div>
                <button
                  onClick={handleUpdatePrices}
                  disabled={loading || !hasUnsavedChanges()}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || !hasUnsavedChanges()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-green-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  }`}
                >
                  {loading ? "Updating..." : "Update Prices"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Coupon Tab */}
        {activeTab === "coupons" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Coupon
            </h3>
            <form
              onSubmit={handleCreateCoupon}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={couponForm.id}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, id: e.target.value })
                    }
                    placeholder="e.g., SAVE20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        discountType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="percent">Percentage Off</option>
                    <option value="amount">Fixed Amount Off</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {couponForm.discountType === "percent" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage Off (1-100) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={couponForm.percentOff}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          percentOff: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Off (£) *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0.01"
                      value={couponForm.amountOff}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          amountOff: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={couponForm.duration}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="once">Once</option>
                    <option value="repeating">Repeating</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {couponForm.duration === "repeating" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration in Months
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={couponForm.durationInMonths}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          durationInMonths: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={couponForm.maxRedemptions}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        maxRedemptions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redeem By Date
                  </label>
                  <input
                    type="datetime-local"
                    value={couponForm.redeemBy}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, redeemBy: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-green-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  }`}
                >
                  {loading ? "Creating..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Promotion Codes Tab */}
        {activeTab === "promos" && (
          <div className="space-y-6">
            {/* Create Promotion Code Form */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create Promotion Code
              </h3>
              <form
                onSubmit={handleCreatePromoCode}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={promoForm.couponId}
                      onChange={(e) =>
                        setPromoForm({ ...promoForm, couponId: e.target.value })
                      }
                      placeholder="e.g., SAVE20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promotion Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={promoForm.code}
                      onChange={(e) =>
                        setPromoForm({
                          ...promoForm,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g., WELCOME20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Redemptions
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={promoForm.maxRedemptions}
                      onChange={(e) =>
                        setPromoForm({
                          ...promoForm,
                          maxRedemptions: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expires At
                    </label>
                    <input
                      type="datetime-local"
                      value={promoForm.expiresAt}
                      onChange={(e) =>
                        setPromoForm({
                          ...promoForm,
                          expiresAt: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Amount (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={promoForm.minimumAmount}
                      onChange={(e) =>
                        setPromoForm({
                          ...promoForm,
                          minimumAmount: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={promoForm.firstTimeTransaction}
                      onChange={(e) =>
                        setPromoForm({
                          ...promoForm,
                          firstTimeTransaction: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Restrict to first-time customers only
                    </span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-green-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    }`}
                  >
                    {loading ? "Creating..." : "Create Promotion Code"}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Promotion Codes List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Existing Promotion Codes
              </h3>
              {promoCodes.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid gap-4">
                    {promoCodes.map((promo) => (
                      <div
                        key={promo.id}
                        className="bg-white p-4 rounded-md border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {promo.code}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Coupon: {promo.coupon.id} •{" "}
                              {promo.coupon.percent_off
                                ? `${promo.coupon.percent_off}% off`
                                : `£${promo.coupon.amount_off / 100} off`}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                promo.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {promo.active ? "Active" : "Inactive"}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              Used: {promo.times_redeemed || 0}
                              {promo.max_redemptions
                                ? ` / ${promo.max_redemptions}`
                                : ""}
                            </p>
                          </div>
                        </div>
                        {promo.expires_at && (
                          <p className="text-sm text-gray-600 mt-2">
                            Expires: {formatDate(promo.expires_at)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No promotion codes found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Validate Code Tab */}
        {activeTab === "validate" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Validate Promotion Code
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={validationCode}
                    onChange={(e) =>
                      setValidationCode(e.target.value.toUpperCase())
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleValidateCode()
                    }
                    placeholder="Enter promotion code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  <button
                    onClick={handleValidateCode}
                    disabled={!validationCode.trim()}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      !validationCode.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-green-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    }`}
                  >
                    Validate
                  </button>
                </div>
              </div>

              {validationResult && (
                <div
                  className={`p-4 rounded-md border ${
                    validationResult.valid
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {validationResult.valid ? (
                    <div>
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-400 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <h4 className="text-lg font-medium text-green-900">
                          Valid Promotion Code
                        </h4>
                      </div>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          <strong>Code:</strong>{" "}
                          {validationResult.promotionCode.code}
                        </p>
                        <p>
                          <strong>Discount:</strong>{" "}
                          {validationResult.promotionCode.coupon.percent_off
                            ? `${validationResult.promotionCode.coupon.percent_off}% off`
                            : `£${
                                validationResult.promotionCode.coupon
                                  .amount_off / 100
                              } off`}
                        </p>
                        <p>
                          <strong>Used:</strong>{" "}
                          {validationResult.promotionCode.times_redeemed || 0}
                          {validationResult.promotionCode.max_redemptions
                            ? ` / ${validationResult.promotionCode.max_redemptions}`
                            : ""}
                        </p>
                        {validationResult.promotionCode.expires_at && (
                          <p>
                            <strong>Expires:</strong>{" "}
                            {formatDate(
                              validationResult.promotionCode.expires_at
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-red-400 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <h4 className="text-lg font-medium text-red-900">
                          Invalid Promotion Code
                        </h4>
                      </div>
                      <p className="mt-2 text-sm text-red-700">
                        {validationResult.error ||
                          "Code is not valid or has expired"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentControls;
