import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Accidents from './Accidents/Accident';
import Formulaire from './pageFormulaire/Formulaire';
import Statistiques from './statistique/statistiques';
import AdminPanelSettingsAction from './pageAdmin/AdminPanelSettingsaction';
import AdminAddEntreprise from './pageAdmin/AdminAddEntreprise';
import AddSecteur from './pageAdmin/AdminAddSecteur';
import AdminEntreprises from './pageAdmin/AdminEntreprises';
import ResponsiveAppBar from './toolbar';
import Deviation from './pageFormulaire/codeDeviation';
import Agentmateriel from './pageFormulaire/codeAgentMateriel';
import Naturelesion from './pageFormulaire/codeNatureLesion';
import Siegelesion from './pageFormulaire/codeSiegeLesion';
import Fichierdll from './Accidents/FileManagement/fichierdll';
import PlanAction from './planaction/planaction';
import Actionfichierdll from './planaction/filesAction/actionfichierdll';
import ProtectedRoute from './Model/protectedRoute';
import ProtectedRouteAdmin from './Model/protectedRouteAdmin';
import Adminuser from './pageAdmin/user/AdminUser';
import AddUser from './pageAdmin/user/addUser/AddUser';
import ProtectedRouteAdminOrConseiller from './Model/protectedRouteConseillerPrevention';
import ProtectedRouteAdminOrGesionaireVehicule from './Model/protectedRoutegetiovechi';
import ProtectedRouteAdminOrsignataires from './Model/protectedRoutesignataire';
import FormulaireAction from './planaction/FormulaireAction';
import { ThemeProvider } from './Hook/ThemeContext';
import LogView from './Logs/logView';
import Entreprise from './entrepriseDivers/entreprise';
import QuesEntrep from './entrepriseDivers/quesEntrep';
import MessSupport from './Dialog/messSupport';
import Archivage from './Archives/archivages';
import Archives from './Archives/archives';
import Home from './Home/Home';
import Footer from './_composants/Footer';
import AdminVehicule from './pageAdmin/AdminVehicule';
import AdminAddVehicule from './pageAdmin/AdminAddVehicule';
import GetionVehicle from './Getionvehicules/GestionVehicule';
import VehiculeDetails from './Getionvehicules/VehicleDetails';
import ModifVehicule from './Getionvehicules/ModifVehicule';
import StatistiquesVehicules from './Getionvehicules/StatistiquesVehicules';
import AccidentCounterPage from './CompteurAccidentUnique/AccidentCounterPage';
import SignaturesManager from './Signatures/SignaturesManager';

const App = () => {
  return (
    <div className="app-container">
      <ThemeProvider>
        <Router>
          <div className="content-wrapper">
            <ResponsiveAppBar />
            <main className="main-content">
              <Routes>

                {/* Routes accessibles par tous */}
                <Route path="/login" element={<Login />} />
                <Route path="/accidentCounter" element={<AccidentCounterPage />} />

                {/* Routes accessibles uniquement par usernormal */}
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

                {/* Routes accessibles uniquement par isAdminordev */}
                <Route path="/logView" element={<ProtectedRouteAdmin><LogView /></ProtectedRouteAdmin>} />
                <Route path="/adminUser" element={<ProtectedRouteAdmin><Adminuser /></ProtectedRouteAdmin>} />
                <Route path="/adminaction" element={<ProtectedRouteAdmin><AdminPanelSettingsAction /></ProtectedRouteAdmin>} />
                <Route path="/addEntreprise" element={<ProtectedRouteAdmin><AdminAddEntreprise /></ProtectedRouteAdmin>} />
                <Route path="/addSecteur" element={<ProtectedRouteAdmin><AddSecteur /></ProtectedRouteAdmin>} />
                <Route path="/adminEntreprises" element={<ProtectedRouteAdmin><AdminEntreprises /></ProtectedRouteAdmin>} />
                <Route path="/addUser" element={<ProtectedRouteAdmin><AddUser /></ProtectedRouteAdmin>} />
                <Route path="/messSupport" element={<ProtectedRouteAdmin><MessSupport /></ProtectedRouteAdmin>} />
                <Route path="/archivages" element={<ProtectedRouteAdmin><Archivage /></ProtectedRouteAdmin>} />
                <Route path="/archives" element={<ProtectedRouteAdmin> <Archives /></ProtectedRouteAdmin>} />
                <Route path="/adminVehicule" element={<ProtectedRouteAdmin><AdminVehicule /></ProtectedRouteAdmin>} />
                <Route path="/adminAddVehicule" element={<ProtectedRouteAdmin><AdminAddVehicule /></ProtectedRouteAdmin>} />
                <Route path="/vehiculeDetails" element={<ProtectedRouteAdmin><VehiculeDetails /></ProtectedRouteAdmin>} />
                <Route path="/modifVehicule" element={<ProtectedRouteAdmin><ModifVehicule /></ProtectedRouteAdmin>} />

                {/* Routes accessibles par isAdminordev ou Conseiller */}
                <Route path="/quesEntrep" element={<ProtectedRouteAdminOrConseiller><QuesEntrep /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/entreprise" element={<ProtectedRouteAdminOrConseiller><Entreprise /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/formulaireAction" element={<ProtectedRouteAdminOrConseiller><FormulaireAction /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/formulaire" element={<ProtectedRouteAdminOrConseiller><Formulaire /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/deviation" element={<ProtectedRouteAdminOrConseiller><Deviation /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/agentmateriel" element={<ProtectedRouteAdminOrConseiller><Agentmateriel /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/naturelesion" element={<ProtectedRouteAdminOrConseiller><Naturelesion /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/siegelesion" element={<ProtectedRouteAdminOrConseiller><Siegelesion /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/fichierdll" element={<ProtectedRouteAdminOrConseiller><Fichierdll /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/planAction" element={<ProtectedRouteAdminOrConseiller><PlanAction /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/actionfichierdll" element={<ProtectedRouteAdminOrConseiller><Actionfichierdll /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/Accident" element={<ProtectedRouteAdminOrConseiller><Accidents /></ProtectedRouteAdminOrConseiller>} />
                <Route path="/statistiques" element={<ProtectedRouteAdminOrConseiller><Statistiques /></ProtectedRouteAdminOrConseiller>} />

                {/* Routes accessibles par isAdminordev ou GestionnaireVehicule */}
                <Route path="/gestionVehicules" element={<ProtectedRouteAdminOrGesionaireVehicule><GetionVehicle /></ProtectedRouteAdminOrGesionaireVehicule>} />
                <Route path="/vehiculeDetails" element={<ProtectedRouteAdminOrGesionaireVehicule><VehiculeDetails /></ProtectedRouteAdminOrGesionaireVehicule>} />
                <Route path="/modifVehicule" element={<ProtectedRouteAdminOrGesionaireVehicule><ModifVehicule /></ProtectedRouteAdminOrGesionaireVehicule>} />
                <Route path="/statistiquesVehicules" element={<ProtectedRouteAdminOrGesionaireVehicule><StatistiquesVehicules /></ProtectedRouteAdminOrGesionaireVehicule>} />

                {/* Routes accessibles par isAdminordev ou signataire*/}
                <Route path="/signatures" element={<ProtectedRouteAdminOrsignataires><SignaturesManager /> </ProtectedRouteAdminOrsignataires>} />

              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
