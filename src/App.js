// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './Home';
import Formulaire from './pageFormulaire/Formulaire';
import ResponsiveAppBar from './toolbar';

const App = () => (
    <Router>
        <div>
            {/* Utilisation de ResponsiveAppBar avec la navigation */}
            <ResponsiveAppBar  />

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/formulaire" element={<Formulaire />} />
            </Routes>
        </div>
    </Router>
);

export default App;
