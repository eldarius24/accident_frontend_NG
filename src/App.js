import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Formulaire from './pageFormulaire/Formulaire';
import AdminPanelSettings from './pageAdmin/AdminPanelSettings';
import AdminPanelSettingsAction from './pageAdmin/AdminPanelSettingsaction';
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
          <Route path="/admin" element={<AdminPanelSettings />} />
          <Route path="/adminaction" element={<AdminPanelSettingsAction />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
