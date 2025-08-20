import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Converter from './components/Converter';
import CliDocs from './components/CliDocs';
import DtoExamples from './components/DtoExamples';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Converter />} />
            <Route path="/cli" element={<CliDocs />} />
            <Route path="/examples" element={<DtoExamples />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;