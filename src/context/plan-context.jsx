import React, { createContext, useContext, useState, useEffect } from "react";

const PlanContext = createContext();

/**
 * PlanProvider - Manages selected plan state throughout the payment flow
 * Persists plan selection to localStorage to survive page refreshes during payment
 */
export const PlanProvider = ({ children }) => {
  // Initialize from localStorage if available
  const [selectedPlan, setSelectedPlanState] = useState(() => {
    try {
      const stored = localStorage.getItem("selectedPlan");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error loading selected plan from localStorage:", error);
      return null;
    }
  });

  // Wrapper function to persist to localStorage
  const setSelectedPlan = (plan) => {
    try {
      if (plan) {
        localStorage.setItem("selectedPlan", JSON.stringify(plan));
      } else {
        localStorage.removeItem("selectedPlan");
      }
      setSelectedPlanState(plan);
    } catch (error) {
      console.error("Error saving selected plan to localStorage:", error);
      setSelectedPlanState(plan);
    }
  };

  // Clear selected plan after successful payment
  const clearSelectedPlan = () => {
    setSelectedPlan(null);
  };

  const value = {
    selectedPlan,
    setSelectedPlan,
    clearSelectedPlan,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

/**
 * usePlan - Hook to access plan context
 * @returns {Object} Plan context with selectedPlan, setSelectedPlan, clearSelectedPlan
 */

export const usePlan = () => useContext(PlanContext);
