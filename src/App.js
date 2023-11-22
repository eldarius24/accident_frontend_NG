// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './Home';
import Formulaire from './pageFormulaire/Formulaire';

const App = () => (
    <Router>
        <div>
            {/* Navigation */}
            <nav>
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/formulaire">Formulaire</Link></li>
                </ul>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/formulaire" element={<Formulaire />} />
            </Routes>
        </div>
    </Router>
);

export default App;
