import React, { useState } from "react";
import '../App.css'; // Ensure you have the App.css imported for styling

function InvoiceForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    address1: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
    cartModel: "Base Cost (2) Golf Cart",
    basePrice: 3850,
    battery: "AMG batteries 150A-48 V (Standard)",
    battery_price: 0,
    addOns: [],
    totalPrice: 3850,
  });

  const [message, setMessage] = useState(""); // State to hold the response message

  const [availableAddOns, setAvailableAddOns] = useState([
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
  ]);

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    let basePrice;

    switch (selectedModel) {
      case "Fleet (2 Seater) Golf Cart":
        basePrice = 3850;
        break;
      case "Personal (2+2 Seater) Non Lifted Golf Cart":
        basePrice = 4150;
        break;
      case "Personal (2+2 Seater) Lifted Golf Cart":
        basePrice = 4630;
        break;
      case "Personal (4+2 Seater) Non Lifted Golf Cart":
        basePrice = 4600;
        break;
      case "Personal (4+2 Seater) Lifted Golf Cart":
        basePrice = 5230;
        break;
      default:
        basePrice = 3850;
    }

    const updatedAddOns = availableAddOns.map((addOn) =>
      addOn.name === "Carbon Fiber"
        ? { ...addOn, price: selectedModel.includes("4+2") ? 180 : 162 }
        : addOn
    );

    setAvailableAddOns(updatedAddOns);
    const subtotal = basePrice + formData.battery_price + updatedAddOns.reduce((acc, addOn) => acc + addOn.price, 0);
    const totalPrice = subtotal * 1.05;

    setFormData({
        ...formData,
        cartModel: selectedModel,
        basePrice: basePrice,
        addOns: updatedAddOns,
        totalPrice: totalPrice,
    });
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
      const response = await fetch("https://invoice-inky.vercel.app/api/invoice", {
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
        <option value="Fleet (2 Seater) Golf Cart">Fleet (2 Seater) Golf Cart - $3,850.00</option>
        <option value="Personal (2+2 Seater) Non Lifted Golf Cart">Personal (2+2 Seater) Non Lifted Golf Cart - $4,150.00</option>
        <option value="Personal (2+2 Seater) Lifted Golf Cart">Personal (2+2 Seater) Lifted Golf Cart - $4,630.00</option>
        <option value="Personal (4+2 Seater) Non Lifted Golf Cart">Personal (4+2 Seater) Non Lifted Golf Cart - $4,600.00</option>
        <option value="Personal (4+2 Seater) Lifted Golf Cart">Personal (4+2 Seater) Lifted Golf Cart - $5,230.00</option>
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
      <p className="total-price">Total Price: ${formData.totalPrice.toFixed(2)}</p>
      <button type="submit">Generate Invoice</button>
      {message && <p className={`message ${message.startsWith('Failed') ? 'error' : 'success'}`}>{message}</p>}
    </form>
  );
}

export default InvoiceForm;
