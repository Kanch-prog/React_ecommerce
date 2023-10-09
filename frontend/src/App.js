import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import './style.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Foodie Frenzy</h1>
        </header>
        <main>
          <Routes>
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/" element={<ProductList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
