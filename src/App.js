import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Home from './Home/Home';
import Formulaire from './pageFormulaire/Formulaire';
import Statistiques from './pageFormulaire/statistiques';
import AdminPanelSettingsAction from './pageAdmin/AdminPanelSettingsaction';
import AdminAddEntreprise from './pageAdmin/AdminAddEntreprise';
import AddSecteur from './pageAdmin/AdminAddSecteur';
import AdminEntreprises from './pageAdmin/AdminEntreprises';
import ResponsiveAppBar from './toolbar';
import Deviation from './pageFormulaire/codeDeviation';
import Agentmateriel from './pageFormulaire/codeAgentMateriel';
import Naturelesion from './pageFormulaire/codeNatureLesion';
import Siegelesion from './pageFormulaire/codeSiegeLesion';
import Fichierdll from './pageFormulaire/FileManagement/fichierdll';
import PlanAction from './planaction/planaction';
import Fichierdllaction from './pageFormulaire/fichierdllaction';
import ProtectedRoute from './Model/protectedRoute';
import ProtectedRouteAdmin from './Model/protectedRouteAdmin';
import Adminuser from './pageAdmin/user/AdminUser';
import AddUser from './pageAdmin/user/addUser/AddUser';

const App = () => {
  return (
    <Router>
      <div>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/formulaire" element={<ProtectedRouteAdmin><Formulaire /></ProtectedRouteAdmin>} />
          <Route path="/adminUser" element={<ProtectedRouteAdmin><Adminuser /></ProtectedRouteAdmin>} />
          <Route path="/deviation" element={<ProtectedRouteAdmin><Deviation /></ProtectedRouteAdmin>} />
          <Route path="/agentmateriel" element={<ProtectedRouteAdmin><Agentmateriel /></ProtectedRouteAdmin>} />
          <Route path="/naturelesion" element={<ProtectedRouteAdmin><Naturelesion /></ProtectedRouteAdmin>} />
          <Route path="/siegelesion" element={<ProtectedRouteAdmin><Siegelesion /></ProtectedRouteAdmin>} />
          <Route path="/fichierdll" element={<ProtectedRouteAdmin><Fichierdll /></ProtectedRouteAdmin>} />
          <Route path="/planAction" element={<ProtectedRouteAdmin><PlanAction /></ProtectedRouteAdmin>} />
          <Route path="/fichierdllaction" element={<ProtectedRouteAdmin><Fichierdllaction /></ProtectedRouteAdmin>} />
          <Route path="/addUser" element={<ProtectedRouteAdmin><AddUser /></ProtectedRouteAdmin>} />
          <Route path="/adminaction" element={<ProtectedRouteAdmin><AdminPanelSettingsAction /></ProtectedRouteAdmin>} />
          <Route path="/addEntreprise" element={<ProtectedRouteAdmin><AdminAddEntreprise /></ProtectedRouteAdmin>} />
          <Route path="/addSecteur" element={<ProtectedRouteAdmin><AddSecteur /></ProtectedRouteAdmin>} />
          <Route path="/adminEntreprises" element={<ProtectedRouteAdmin><AdminEntreprises /></ProtectedRouteAdmin>} />
          <Route path="/statistiques" element={<ProtectedRouteAdmin><Statistiques /></ProtectedRouteAdmin>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;