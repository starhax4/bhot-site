"use client";
import { Check, CreditCard } from "lucide-react";

const PaymentCard = ({
  card,
  isSelected,
  onSelect,
  showFullDetails = false,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center p-4 ${
        isSelected && !showFullDetails ? "bg-white" : "bg-white"
      } ${className}`}
      onClick={() => onSelect && onSelect(card)}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${
          isSelected ? "bg-green-500" : "border border-gray-300"
        }`}
      >
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>

      <div className="flex flex-1 items-center">
        <div className="flex items-center w-1/4">
          <CreditCard className="w-5 h-5 text-gray-700 mr-2" />
          <span className="text-sm font-medium">{card.bankName}</span>
        </div>

        <div className="w-1/4 text-sm text-gray-600">{card.lastFourDigits}</div>

        <div className="w-1/4 text-sm text-gray-600">{card.cardholderName}</div>

        <div className="w-1/4 text-sm text-gray-600">{card.expiryDate}</div>
      </div>
    </div>
  );
};

export default PaymentCard;
