import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Formulaire from './pageFormulaire/Formulaire';
import AdminAddUser from './pageAdmin/AdminAddUser';
import AdminPanelSettingsAction from './pageAdmin/AdminPanelSettingsaction';
import AdminAddEntreprise from './pageAdmin/AdminAddEntreprise';
import AdminUser from './pageAdmin/AdminUser';
import AdminEntreprises from './pageAdmin/AdminEntreprises';
import ResponsiveAppBar from './toolbar';
import Deviation from './pageFormulaire/codeDeviation'; // Utilisez le même nom ici
import Agentmateriel from './pageFormulaire/codeAgentMateriel';
import Naturelesion from './pageFormulaire/codeNatureLesion';
import Siegelesion from './pageFormulaire/codeSiegeLesion';
import Fichierdll from './pageFormulaire/fichierdll';
import PlanAction from './planaction/planaction';
import Fichierdllaction from './pageFormulaire/fichierdllaction';


const App = () => {
  const [isFormVisible, setFormVisible] = useState(true);

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
          <Route path="/admin" element={<AdminAddUser />} />
          <Route path="/adminaction" element={<AdminPanelSettingsAction />} />
          <Route path="/addEntreprise" element={<AdminAddEntreprise />} />
          <Route path="/adminEntreprises" element={<AdminEntreprises />} />
          <Route path="/deviation" element={<Deviation />} />
          <Route path="/agentmateriel" element={<Agentmateriel />} />
          <Route path="/naturelesion" element={<Naturelesion />} />
          <Route path="/siegelesion" element={<Siegelesion />} />
          <Route path="/fichierdll" element={<Fichierdll />} />
          <Route path="/adminUser" element={<AdminUser />} />
          <Route path="/planAction" element={<PlanAction />} />
          <Route path="/fichierdllaction" element={<Fichierdllaction />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;