import React from "react";
import InvoiceForm from "./components/InvoiceForm";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Golf Cart Invoice Generator</h1>
      </header>
      <main>
        <InvoiceForm />
      </main>
    </div>
  );
}

export default App;
