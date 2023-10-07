// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './Home';
import Contact from './Contact';

const App = () => (
    <Router>
        <div>
            {/* Navigation */}
            <nav>
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </div>
    </Router>
);

export default App;
