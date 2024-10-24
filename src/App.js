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
import Fichierdllaction from './planaction/fichierdllaction';
import ProtectedRoute from './Model/protectedRoute';
import ProtectedRouteAdmin from './Model/protectedRouteAdmin';
import Adminuser from './pageAdmin/user/AdminUser';
import AddUser from './pageAdmin/user/addUser/AddUser';
import ProtectedRouteAdminOrConseiller from './Model/protectedRouteConseillerPrevention'; // Importer le nouveau composant
import FormulaireAction from './planaction/FormulaireAction';
import { ThemeProvider } from './pageAdmin/user/ThemeContext'; // Importez ThemeProvider
/**
 * App est le composant principal de l'application. Il contient les routes 
 * ainsi que la barre de navigation.
 * 
 * Les routes sont divis es en 3 parties :
 * - Les routes accessibles par tous (login, home)
 * - Les routes accessibles uniquement par les admins (adminUser, adminaction, addEntreprise, addSecteur, adminEntreprises, addUser)
 * - Les routes accessibles par les admins et les conseillers (formulaireAction, formulaire, deviation, agentmateriel, naturelesion, siegelesion, fichierdll, planAction, fichierdllaction, statistiques)
 * 
 * Toutes les routes sont prot ge s par des composants de type ProtectedRoute, 
 * qui redirigent vers la page de connexion si l'utilisateur n'a pas les droits 
 * n cessaires.
 */
const App = () => {
  return (
    <ThemeProvider>
    <Router>
      <div>
        <ResponsiveAppBar />
        <Routes>
          {/* Routes accessibles uniquement par usernormal */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          
          {/* Routes accessibles uniquement par isAdmin */}
          <Route path="/adminUser" element={<ProtectedRouteAdmin><Adminuser /></ProtectedRouteAdmin>} />
          <Route path="/adminaction" element={<ProtectedRouteAdmin><AdminPanelSettingsAction /></ProtectedRouteAdmin>} />
          <Route path="/addEntreprise" element={<ProtectedRouteAdmin><AdminAddEntreprise /></ProtectedRouteAdmin>} />
          <Route path="/addSecteur" element={<ProtectedRouteAdmin><AddSecteur /></ProtectedRouteAdmin>} />
          <Route path="/adminEntreprises" element={<ProtectedRouteAdmin><AdminEntreprises /></ProtectedRouteAdmin>} />
          <Route path="/addUser" element={<ProtectedRouteAdmin><AddUser /></ProtectedRouteAdmin>} />
          
          {/* Routes accessibles par isAdmin ou Conseiller */}
          <Route path="/formulaireAction" element={<ProtectedRouteAdminOrConseiller><FormulaireAction /></ProtectedRouteAdminOrConseiller>} />
          <Route path="/formulaire" element={<ProtectedRouteAdminOrConseiller><Formulaire /></ProtectedRouteAdminOrConseiller>} />
          <Route path="/deviation" element={<ProtectedRouteAdminOrConseiller><Deviation /></ProtectedRouteAdminOrConseiller>} />
          <Route path="/agentmateriel" element={<ProtectedRouteAdminOrConseiller><Agentmateriel /></ProtectedRouteAdminOrConseiller>} />
          <Route path="/naturelesion" element={<ProtectedRouteAdminOrConseiller><Naturelesion /></ProtectedRouteAdminOrConseiller>} />
          <Route path="/siegelesion" element={<ProtectedRouteAdminOrConseiller><Siegelesion /></ProtectedRouteAdminOrConseiller>} />
          <Route path="/fichierdll" element={<ProtectedRouteAdminOrConseiller><Fichierdll /></ProtectedRouteAdminOrConseiller>} />
          <Route path="/planAction" element={<ProtectedRouteAdminOrConseiller><PlanAction /></ProtectedRouteAdminOrConseiller>} />
          <Route path="/fichierdllaction" element={<ProtectedRouteAdminOrConseiller><Fichierdllaction /></ProtectedRouteAdminOrConseiller>} />
          <Route path="/statistiques" element={<ProtectedRouteAdminOrConseiller><Statistiques /></ProtectedRouteAdminOrConseiller>} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
};

export default App;
