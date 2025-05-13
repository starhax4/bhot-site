"use client";

import { useState } from "react";
import { Check, CreditCard } from "lucide-react";

const AddCardForm = ({ onAddCard, onCancel }) => {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    setAsDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData({
      ...cardData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format the data for submission
    const formattedCard = {
      bankName: determineBankFromCardNumber(cardData.cardNumber),
      lastFourDigits: cardData.cardNumber.slice(-4),
      cardholderName: cardData.cardholderName,
      expiryDate: `${cardData.expiryMonth}/${cardData.expiryYear}`,
      isDefault: cardData.setAsDefault,
    };

    onAddCard(formattedCard);
  };

  // Simple function to determine bank name (in a real app, this would be more sophisticated)
  const determineBankFromCardNumber = (cardNumber) => {
    // This is just a placeholder logic
    if (cardNumber.startsWith("4")) return "Visa Bank";
    if (cardNumber.startsWith("5")) return "Master Bank";
    return "Credit Bank";
  };

  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-4">
          <Check className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium">Add new card</span>

        <div className="ml-auto flex space-x-2">
          <img
            src="/Master Card.svg"
            alt="Mastercard"
            className="h-6"
          />
          <img
            src="/visa.svg"
            alt="Visa"
            className="h-6"
          />
          <img
            src="/troy.svg"
            alt="Troy"
            className="hidden md:block h-6"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Card number
          </label>
          <div className="flex">
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleChange}
              placeholder="Enter the 16-digit card number on the card"
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500"
              maxLength="16"
              required
            />
            <div className="bg-white p-2 border border-l-0 border-gray-300 rounded-r-md">
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Card owner</label>
          <input
            type="text"
            name="cardholderName"
            value={cardData.cardholderName}
            onChange={handleChange}
            placeholder="Enter the name on the card"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm text-gray-700 mb-1">
              Expiry date
            </label>
            <div className="flex">
              <input
                type="text"
                name="expiryMonth"
                value={cardData.expiryMonth}
                onChange={handleChange}
                placeholder="MM"
                className="w-16 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500"
                maxLength="2"
                required
              />
              <div className="flex items-center justify-center px-2 border-t border-b border-gray-300">
                /
              </div>
              <input
                type="text"
                name="expiryYear"
                value={cardData.expiryYear}
                onChange={handleChange}
                placeholder="YY"
                className="w-16 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-green-500"
                maxLength="2"
                required
              />
            </div>
          </div>

          <div className="w-1/2">
            <label className="block text-sm text-gray-700 mb-1">CVV2</label>
            <input
              type="text"
              name="cvv"
              value={cardData.cvv}
              onChange={handleChange}
              placeholder="Security code"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              maxLength="3"
              required
            />
          </div>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="setAsDefault"
            name="setAsDefault"
            checked={cardData.setAsDefault}
            onChange={handleChange}
            className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
          />
          <label
            htmlFor="setAsDefault"
            className="ml-2 text-sm text-gray-700"
          >
            Set as default
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 transition-colors"
        >
          Review your order
        </button>
      </form>
    </div>
  );
};

export default AddCardForm;
