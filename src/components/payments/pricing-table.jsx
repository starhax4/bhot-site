import React, { useState, useEffect } from "react";
import { usePlan } from "../../context/plan-context";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/auth/AuthContext";
import {
  createStripeSubscription,
  getCurrentPlanPrices,
  validatePromotionCode,
} from "../../api/serices/api_utils";

// SVG Check Icon (dark grey as in the image)
const CheckIcon = () => (
  <img
    src="/tick.svg"
    alt="tick"
  />
);

// Default pricing data - will be overridden by API data
const defaultPricingData = {
  features: [
    { id: "properties", label: "Number of Properties" },
    { id: "benchmarking", label: "Neighbourhood Benchmarking" },
    { id: "efficiency", label: "Energy Efficiency Recommendations" },
    {
      id: "uplift",
      label: "Estimated Value Uplift from Implementing Recommendations",
    },
  ],
  plans: [
    {
      id: "free",
      name: "Free",
      frequency: "",
      buttonText: "Existing plan",
      buttonLink: "#",
      values: {
        properties: "1",
        benchmarking: true,
        efficiency: true,
        uplift: false,
      },
    },
    {
      id: "basic",
      name: "£9.99", // Will be updated from API
      frequency: "",
      buttonText: "Choose Basic Plan",
      buttonLink: "/checkout/cart?package=basic",
      values: {
        properties: "1",
        benchmarking: true,
        efficiency: true,
        uplift: true,
      },
    },
    {
      id: "pro",
      name: "£59.99", // Will be updated from API
      frequency: "",
      buttonText: "Choose Pro Plan",
      buttonLink: "/checkout/cart?package=pro",
      values: {
        properties: "Unlimited",
        benchmarking: true,
        efficiency: true,
        uplift: true,
      },
    },
  ],
};

const PricingTable = () => {
  const [pricingData, setPricingData] = useState(defaultPricingData);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const { features, plans } = pricingData;
  const { setSelectedPlan } = usePlan();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(null); // Track which plan is loading
  const [error, setError] = useState("");

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoValidation, setPromoValidation] = useState(null);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Function to fetch plan prices
  const fetchPlanPrices = async () => {
    setLoadingPrices(true);
    try {
      const response = await getCurrentPlanPrices();
      if (response.success && response.data?.plans) {
        const prices = response.data.plans;

        // Update pricing data with fetched prices
        setPricingData((prevData) => ({
          ...prevData,
          plans: prevData.plans.map((plan) => {
            if (plan.id === "basic") {
              return { ...plan, name: `£${prices.basic.toFixed(2)}` };
            } else if (plan.id === "pro") {
              return { ...plan, name: `£${prices.pro.toFixed(2)}` };
            }
            return plan;
          }),
        }));
      }
    } catch (error) {
      console.error("Failed to fetch plan prices:", error);
      // Use default prices if API fails
    } finally {
      setLoadingPrices(false);
    }
  };

  // Fetch current plan prices on component mount and listen for updates
  useEffect(() => {
    fetchPlanPrices();

    // Listen for price update events from admin dashboard
    const handlePriceUpdate = () => {
      fetchPlanPrices();
    };

    window.addEventListener("pricesUpdated", handlePriceUpdate);

    return () => {
      window.removeEventListener("pricesUpdated", handlePriceUpdate);
    };
  }, []);

  // Promo code validation with debounce
  useEffect(() => {
    const validatePromo = async () => {
      if (!promoCode.trim() || promoCode.length < 3) {
        setPromoValidation(null);
        return;
      }

      setValidatingPromo(true);
      try {
        const response = await validatePromotionCode(promoCode);
        if (response.success) {
          setPromoValidation(response.data);
        } else {
          setPromoValidation({ valid: false, error: response.message });
        }
      } catch (error) {
        setPromoValidation({ valid: false, error: "Validation failed" });
      } finally {
        setValidatingPromo(false);
      }
    };

    const timeoutId = setTimeout(validatePromo, 500);
    return () => clearTimeout(timeoutId);
  }, [promoCode]);

  // Handle pending plan selection after login
  useEffect(() => {
    const handlePendingPlanSelection = async () => {
      if (isAuthenticated && user?.id) {
        const pendingPlan = localStorage.getItem("pendingPlanSelection");
        if (pendingPlan) {
          try {
            const plan = JSON.parse(pendingPlan);
            localStorage.removeItem("pendingPlanSelection");

            if (plan.id !== "free") {
              setLoading(plan.id);
              setSelectedPlan(plan);

              // Use the appropriate subscription function based on whether we have a promo code
              let res;
              if (plan.promoCode) {
                const { createSubscriptionWithPromo } = await import(
                  "../../api/serices/api_utils"
                );
                res = await createSubscriptionWithPromo(
                  user.id,
                  plan.id,
                  plan.promoCode
                );
              } else {
                res = await createStripeSubscription(plan.id, user.id);
              }

              setLoading(null);

              if (res.success && res.url) {
                window.location.href = res.url;
              } else {
                setError(
                  res.message || "Failed to initiate payment. Please try again."
                );
              }
            }
          } catch (e) {
            console.error("Error processing pending plan selection:", e);
            localStorage.removeItem("pendingPlanSelection");
          }
        }
      }
    };

    handlePendingPlanSelection();
  }, [isAuthenticated, user, setSelectedPlan]);

  const handleSelectPlan = async (plan) => {
    setError("");

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store which plan they wanted to select
      const planWithPromo = {
        ...plan,
        ...(promoValidation?.valid && { promoCode: promoCode }),
      };
      localStorage.setItem(
        "pendingPlanSelection",
        JSON.stringify(planWithPromo)
      );
      // Trigger login modal
      window.dispatchEvent(new CustomEvent("open-login-modal"));
      return;
    }

    // For paid plans, proceed with Stripe
    if (plan.id !== "free") {
      setLoading(plan.id);
      setSelectedPlan(plan);

      // Use the appropriate subscription function based on whether we have a valid promo code
      let res;
      if (promoValidation?.valid && promoCode) {
        // Import the function with promo code
        const { createSubscriptionWithPromo } = await import(
          "../../api/serices/api_utils"
        );
        res = await createSubscriptionWithPromo(user.id, plan.id, promoCode);
      } else {
        res = await createStripeSubscription(plan.id, user.id);
      }

      setLoading(null);

      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        setError(
          res.message || "Failed to initiate payment. Please try again."
        );
      }
    } else {
      // For free plan, just navigate normally
      setSelectedPlan(plan);
      navigate("/dashboard");
    }
  };

  const getDiscountedPrice = (originalPrice, promoValidation) => {
    if (!promoValidation?.valid || !promoValidation.promotionCode) {
      return originalPrice;
    }

    const coupon = promoValidation.promotionCode.coupon;
    if (coupon.percent_off) {
      return originalPrice * (1 - coupon.percent_off / 100);
    } else if (coupon.amount_off) {
      return Math.max(0, originalPrice - coupon.amount_off / 100);
    }
    return originalPrice;
  };

  return (
    <div className="space-y-6">
      {/* Promo Code Section */}
      {/* <div className="max-w-md mx-auto">
        <div className="text-center">
          <button
            onClick={() => setShowPromoInput(!showPromoInput)}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            {showPromoInput ? "Hide promo code" : "Have a promo code?"}
          </button>
        </div>

        {showPromoInput && (
          <div className="mt-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {validatingPromo && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>

            {promoValidation && (
              <div
                className={`p-3 rounded-md text-sm ${
                  promoValidation.valid
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {promoValidation.valid ? (
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {promoValidation.promotionCode.coupon.percent_off
                        ? `${promoValidation.promotionCode.coupon.percent_off}% off applied!`
                        : `£${(
                            promoValidation.promotionCode.coupon.amount_off /
                            100
                          ).toFixed(2)} off applied!`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{promoValidation.error || "Invalid promo code"}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div> */}

      {/* Pricing Table */}
      <div className="w-[95vw] bg-white rounded-3xl outline  outline-offset-[-1px] outline-slate-200 max-w-7xl mx-auto my-8 overflow-hidden">
        {/* Wrapper to enable horizontal scrolling on smaller screens */}
        <div className="overflow-x-auto">
          {/* 
          The grid itself. It needs a minimum width to ensure content doesn't break
          and to trigger horizontal scroll when viewport is narrower.
          The grid-template-columns are defined to give more relative space to the first column (feature labels).
        */}
          <div
            className="min-w-[900px] lg:min-w-[1024px] grid gap-0" // Adjusted min-width
            style={{
              gridTemplateColumns: `minmax(220px, 1.5fr) repeat(${plans.length}, minmax(160px, 1fr))`,
            }}
          >
            {/* ----- ROW 1: "Compare Plans" Info & Plan Headers ----- */}

            {/* Cell 1.1: "Compare Plans" section */}
            <div className="p-5 md:p-6 md:pt-10">
              <div>
                <h2 className="text-xl font-bold md:text-2xl text-primary mb-1">
                  Compare plans
                </h2>
                <p className="text-xs md:text-sm text-gray-400">
                  Choose your plan according to your needs
                </p>
              </div>
            </div>

            {/* Cells 1.2, 1.3, 1.4: Plan Headers (Free, £9.99, £59.99) */}
            {plans.map((plan) => {
              // Calculate discounted price for paid plans
              const originalPrice =
                plan.id === "basic"
                  ? parseFloat(plan.name.replace("£", ""))
                  : plan.id === "pro"
                  ? parseFloat(plan.name.replace("£", ""))
                  : 0;

              const discountedPrice =
                plan.id !== "free" && promoValidation?.valid
                  ? getDiscountedPrice(originalPrice, promoValidation)
                  : originalPrice;

              const hasDiscount =
                plan.id !== "free" &&
                promoValidation?.valid &&
                discountedPrice < originalPrice;

              return (
                <div
                  key={plan.id}
                  className="p-3 md:p-6 text-center border-l border-gray-200"
                >
                  <div className="space-y-2">
                    {hasDiscount ? (
                      <>
                        <div className="text-lg text-gray-400 line-through">
                          £{originalPrice.toFixed(2)}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-primary">
                          £{discountedPrice.toFixed(2)}
                          {plan.frequency && (
                            <span className="text-xs md:text-sm text-gray-400 font-medium align-baseline ml-1">
                              {plan.frequency}
                            </span>
                          )}
                        </h3>
                        <div className="text-xs text-green-600 font-medium">
                          {promoValidation.promotionCode.coupon.percent_off
                            ? `${promoValidation.promotionCode.coupon.percent_off}% off`
                            : `£${(originalPrice - discountedPrice).toFixed(
                                2
                              )} off`}
                        </div>
                      </>
                    ) : (
                      <h3 className="text-3xl md:text-4xl font-bold text-primary">
                        {plan.name}
                        {plan.frequency && (
                          <span className="text-xs md:text-sm text-gray-400 font-medium align-baseline ml-1">
                            {plan.frequency}
                          </span>
                        )}
                      </h3>
                    )}
                  </div>
                  {plan.id === "free" ? (
                    <a
                      href={plan.buttonLink}
                      className="mt-4 inline-block w-full bg-primary text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                    >
                      {plan.buttonText}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={loading === plan.id}
                      className="mt-4 inline-block w-full bg-primary text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading === plan.id ? "Processing..." : plan.buttonText}
                    </button>
                  )}
                </div>
              );
            })}

            {/* Error message row */}
            {error && (
              <div className="col-span-full p-4 text-center">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}

            {/* ----- FEATURE ROWS ----- */}
            {features.map((feature, featureIndex) => (
              <React.Fragment key={feature.id}>
                {/* Column 1: Feature Label */}
                <div
                  className={`p-3 md:p-4 text-sm md:text-base text-zinc-800 flex items-center min-h-[45px] md:min-h-[55px] border-t 
                            ${
                              featureIndex === 0
                                ? "border-gray-300 font-medium"
                                : "border-gray-200 font-medium"
                            }`}
                  // The first feature row's top border is slightly more prominent in the image.
                  // The image does not make the first feature label bold, so removing font-medium.
                  // The border above first feature row is the same as others based on crops.
                >
                  {feature.label}
                </div>

                {/* Columns 2, 3, 4: Feature values for each plan */}
                {plans.map((plan) => (
                  <div
                    key={`${plan.id}-${feature.id}`}
                    className={`p-2 md:p-3 border-t border-l border-gray-200 flex justify-center items-center min-h-[45px] md:min-h-[55px]
                              ${
                                featureIndex === 0
                                  ? "border-gray-300"
                                  : "border-gray-200"
                              }`}
                  >
                    {typeof plan.values[feature.id] === "boolean" ? (
                      plan.values[feature.id] ? (
                        <CheckIcon />
                      ) : null // Render nothing if false, as per image
                    ) : (
                      <span className="text-sm text-gray-800">
                        {plan.values[feature.id]}
                      </span>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
