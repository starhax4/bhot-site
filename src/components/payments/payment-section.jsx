

import { useState } from "react";
import PaymentCard from "./payment-card";
import AddCardForm from "./add-card-form";
import { ArrowLeft, Check } from "lucide-react";

const PaymentSection = ({ onProceed, onBack }) => {
  const [savedCards, setSavedCards] = useState([
    {
      id: 1,
      bankName: "Ziraat Bankası",
      lastFourDigits: "1234",
      cardholderName: "Hızır Kocaman",
      expiryDate: "12/34",
      isDefault: true,
    },
    {
      id: 2,
      bankName: "T. İş Bankası",
      lastFourDigits: "1234",
      cardholderName: "Jane Cooper",
      expiryDate: "12/34",
      isDefault: false,
    },
  ]);

  const [selectedCardId, setSelectedCardId] = useState(1);
  const [showAddCardForm, setShowAddCardForm] = useState(false);

  const handleSelectCard = (card) => {
    setSelectedCardId(card.id);
    setShowAddCardForm(false);
  };

  const handleAddCard = (newCard) => {
    const newCardWithId = {
      ...newCard,
      id: savedCards.length + 1,
    };

    setSavedCards([...savedCards, newCardWithId]);

    if (newCard.isDefault) {
      // Update all other cards to not be default
      const updatedCards = savedCards.map((card) => ({
        ...card,
        isDefault: false,
      }));
      setSavedCards([...updatedCards, newCardWithId]);
    } else {
      setSavedCards([...savedCards, newCardWithId]);
    }

    setSelectedCardId(newCardWithId.id);
    setShowAddCardForm(false);
  };

  const selectedCard = savedCards.find((card) => card.id === selectedCardId);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Selected Card */}
      {selectedCard && !showAddCardForm && (
        <div className="mb-6">
          <PaymentCard
            card={selectedCard}
            isSelected={true}
            showFullDetails={true}
          />
        </div>
      )}

      {/* Saved Cards Section */}
      <div className="border border-gray-200 rounded-lg mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="font-medium">Registered cards</span>
          </div>
        </div>

        <div>
          {savedCards.map((card) => (
            <PaymentCard
              key={card.id}
              card={card}
              isSelected={card.id === selectedCardId && !showAddCardForm}
              onSelect={handleSelectCard}
              className="border-b border-gray-200 last:border-b-0"
            />
          ))}
        </div>
      </div>

      {/* Add New Card */}
      {showAddCardForm ? (
        <AddCardForm
          onAddCard={handleAddCard}
          onCancel={() => setShowAddCardForm(false)}
        />
      ) : (
        <div
          className="bg-green-50 p-4 rounded-lg mb-6 cursor-pointer"
          onClick={() => setShowAddCardForm(true)}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-4">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Add new card</span>
          </div>
        </div>
      )}

      {/* Review Order Button */}
      {!showAddCardForm && (
        <button
          onClick={onProceed}
          className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 transition-colors mb-6"
        >
          Review your order
        </button>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-gray-700"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Addresses
      </button>
    </div>
  );
};

export default PaymentSection;
