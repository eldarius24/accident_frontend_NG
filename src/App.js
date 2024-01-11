import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Formulaire from './pageFormulaire/Formulaire';
import ResponsiveAppBar from './toolbar';

const App = () => {
  const [isFormVisible, setFormVisible] = useState(false);

  return (
    <Router>
      <div>
        {isFormVisible && <ResponsiveAppBar />}
        <Routes>
          <Route
            path="/"
            element={<Login isFormVisible={isFormVisible} setFormVisible={setFormVisible} />}
          />
          <Route path="/accueil" element={<Home />} />
          <Route path="/formulaire" element={<Formulaire />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
