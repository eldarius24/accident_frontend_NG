import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Home from './Home/Home';
import Formulaire from './pageFormulaire/Formulaire';
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
          <Route path="/formulaire" element={<ProtectedRoute><Formulaire /></ProtectedRoute>} />
          <Route path="/adminUser" element={<ProtectedRouteAdmin><Adminuser /></ProtectedRouteAdmin>} />
          <Route path="/deviation" element={<ProtectedRoute><Deviation /></ProtectedRoute>} />
          <Route path="/agentmateriel" element={<ProtectedRoute><Agentmateriel /></ProtectedRoute>} />
          <Route path="/naturelesion" element={<ProtectedRoute><Naturelesion /></ProtectedRoute>} />
          <Route path="/siegelesion" element={<ProtectedRoute><Siegelesion /></ProtectedRoute>} />
          <Route path="/fichierdll" element={<ProtectedRoute><Fichierdll /></ProtectedRoute>} />
          <Route path="/planAction" element={<ProtectedRoute><PlanAction /></ProtectedRoute>} />
          <Route path="/fichierdllaction" element={<ProtectedRoute><Fichierdllaction /></ProtectedRoute>} />
          <Route path="/addUser" element={<ProtectedRouteAdmin><AddUser /></ProtectedRouteAdmin>} />
          <Route path="/adminaction" element={<ProtectedRouteAdmin><AdminPanelSettingsAction /></ProtectedRouteAdmin>} />
          <Route path="/addEntreprise" element={<ProtectedRouteAdmin><AdminAddEntreprise /></ProtectedRouteAdmin>} />
          <Route path="/addSecteur" element={<ProtectedRouteAdmin><AddSecteur /></ProtectedRouteAdmin>} />
          <Route path="/adminEntreprises" element={<ProtectedRouteAdmin><AdminEntreprises /></ProtectedRouteAdmin>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;