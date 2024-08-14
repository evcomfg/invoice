import React, { useState, useEffect } from "react";
import '../App.css'; // Ensure you have the App.css imported for styling

function InvoiceForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    address1: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
    cartModel: "Fleet (2 Seater) Golf Cart",
    basePrice: 6875,
    battery: "AMG batteries 150A-48 V (Standard)",
    battery_price: 0,
    addOns: [],
    totalPrice: 6875 * 1.05,
  });

  const [message, setMessage] = useState(""); // State to hold the response message

  const initialAddOns = [
    { name: "Extra Speakers", price: 96 },
    { name: "Front Basket", price: 60 },
    { name: "Cooler", price: 72 },
    { name: "Sand and seed bottles", price: 24 },
    { name: "Ball Washer", price: 66 },
    { name: "Led Light Set", price: 264 },
    { name: "LED Front hood lights", price: 48 },
    { name: "Feature Steering Wheel", price: 96 },
    { name: "3 point seat belt per row", price: 60 },
    { name: "Running Boards", price: 108 },
    { name: "DOT Fold down Windshield & Lighted Tag Brkt", price: 108 },
    { name: "Subwoofer", price: 108 },
    { name: "Metallic/Matte Painting", price: 60 },
    { name: "Seats with folding armrest per row", price: 120 },
    { name: "Welcome Light and Stainless steel plate", price: 156 },
    { name: "Carbon Fiber", price: 162 },
  ];

  const [availableAddOns, setAvailableAddOns] = useState([]);

  // Filter add-ons based on the default selected model when the component mounts
  useEffect(() => {
    if (formData.cartModel === "Fleet (2 Seater) Golf Cart") {
      setAvailableAddOns(
        initialAddOns.filter(addOn =>
          addOn.name === "Cooler" ||
          addOn.name === "Sand and seed bottles" ||
          addOn.name === "Ball Washer"
        )
      );
    } else {
      setAvailableAddOns(initialAddOns);
    }
  }, [formData.cartModel]);

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    let basePrice;

    switch (selectedModel) {
      case "Fleet (2 Seater) Golf Cart":
        basePrice = 6875;
        break;
      case "Personal (2+2 Seater) Non Lifted Golf Cart":
        basePrice = 10867.80;
        break;
      case "Personal (2+2 Seater) Lifted Golf Cart":
        basePrice = 11347.80;
        break;
      case "Personal (4+2 Seater) Non Lifted Golf Cart":
        basePrice = 11317.80;
        break;
      case "Personal (4+2 Seater) Lifted Golf Cart":
        basePrice = 11947.80;
        break;
      default:
        basePrice = 6875;
    }

    let updatedAddOns;
    if (selectedModel === "Fleet (2 Seater) Golf Cart") {
      updatedAddOns = initialAddOns.filter(addOn =>
        addOn.name === "Cooler" ||
        addOn.name === "Sand and seed bottles" ||
        addOn.name === "Ball Washer"
      );
    } else {
      updatedAddOns = initialAddOns.map((addOn) =>
        addOn.name === "Carbon Fiber"
          ? { ...addOn, price: selectedModel.includes("4+2") ? 180 : 162 }
          : addOn
      );
    }

    // Calculate total price with tax
    const totalPrice = basePrice * 1.05;

    // Reset the formData's addOns array to an empty array (no add-ons selected)
    setFormData({
      ...formData,
      cartModel: selectedModel,
      basePrice: basePrice,
      addOns: [], // Reset addOns to empty array
      totalPrice: totalPrice, // Update totalPrice to include tax
    });

    // Update the availableAddOns state to reflect updated options
    setAvailableAddOns(updatedAddOns);
  };

  const handleBatteryChange = (e) => {
    const selectedBattery = e.target.value;
    let batteryPrice = 0;

    if (selectedBattery === "Lithium 48V 5KW 105AH") {
      batteryPrice = 720;
    } else if (selectedBattery === "Lithium 72V 6.3 KW 105AH") {
      batteryPrice = 1320;
    }

    const subtotal = formData.basePrice + batteryPrice + formData.addOns.reduce((acc, addOn) => acc + addOn.price, 0);
    const taxAmount = subtotal * 0.05;
    const totalPrice = subtotal + taxAmount;

    setFormData({
      ...formData,
      battery: selectedBattery,
      battery_price: batteryPrice,
      totalPrice: totalPrice,
    });
  };

  const handleAddOnChange = (e, addOnName, addOnPrice) => {
    const checked = e.target.checked;
    let newAddOns = formData.addOns;

    if (checked) {
      newAddOns.push({ name: addOnName, price: addOnPrice });
    } else {
      newAddOns = newAddOns.filter((addOn) => addOn.name !== addOnName);
    }

    const subtotal = formData.basePrice + newAddOns.reduce((acc, addOn) => acc + addOn.price, 0) + (formData.battery === "Lithium 48V 5KW 105AH" ? 720 : formData.battery === "Lithium 72V 6.3 KW 105AH" ? 1320 : 0);
    const taxAmount = subtotal * 0.05;
    const totalPrice = subtotal + taxAmount;

    setFormData({
      ...formData,
      addOns: newAddOns,
      totalPrice: totalPrice,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous message

    try {
      const response = await fetch("https://invoice-backend-wheat.vercel.app/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        window.open(url); // Open the PDF in a new tab
        window.location.reload();
      } else {
        setMessage("Failed to generate the invoice.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while generating the invoice.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Golf Cart Invoice Form</h1>
      <label>
        Customer Name:
        <input
          type="text"
          name="customerName"
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        />
      </label>
      <label>
        Address 1:
        <input
          type="text"
          name="address1"
          onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
        />
      </label>
      <label>
        Unit:
        <input
          type="text"
          name="unit"
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          name="city"
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
      </label>
      <label>
        State:
        <input
          type="text"
          name="state"
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        />
      </label>
      <label>
        ZIP Code:
        <input
          type="text"
          name="zipCode"
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
        />
      </label>
      <label>
        Cart Model:
        <select name="cartModel" onChange={handleModelChange} value={formData.cartModel}>
        <option value="Fleet (2 Seater) Golf Cart">Fleet (2 Seater) Golf Cart - $6,875.00</option>
        <option value="Personal (2+2 Seater) Non Lifted Golf Cart">Personal (2+2 Seater) Non Lifted Golf Cart - $10,867.80</option>
        <option value="Personal (2+2 Seater) Lifted Golf Cart">Personal (2+2 Seater) Lifted Golf Cart - $11,347.80</option>
        <option value="Personal (4+2 Seater) Non Lifted Golf Cart">Personal (4+2 Seater) Non Lifted Golf Cart - $11,317.80</option>
        <option value="Personal (4+2 Seater) Lifted Golf Cart">Personal (4+2 Seater) Lifted Golf Cart - $11,947.80</option>
        </select>
      </label>
      <label>
        Battery:
        <select name="battery" onChange={handleBatteryChange} value={formData.battery}>
          <option value="AMG batteries 150A-48 V (Standard)">AMG batteries 150A-48 V (Standard)</option>
          <option value="Lithium 48V 5KW 105AH">Lithium 48V 5KW 105AH - $720.00</option>
          <option value="Lithium 72V 6.3 KW 105AH">Lithium 72V 6.3 KW 105AH - $1,320.00</option>
        </select>
      </label>
      <div>
        <h3>Add-ons</h3>
        <div className="addons">
          {availableAddOns.map((addOn, index) => (
            <div key={index} className="addon-item">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handleAddOnChange(e, addOn.name, addOn.price)}
                />
                {addOn.name}
              </label>
              <span>${addOn.price}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="total-price">Total Price (incl. Tax): ${formData.totalPrice.toFixed(2)}</p>
      <button type="submit">Generate Invoice</button>
      {message && <p className={`message ${message.startsWith('Failed') ? 'error' : 'success'}`}>{message}</p>}
    </form>
  );
}

export default InvoiceForm;
