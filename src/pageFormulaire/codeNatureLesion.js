import React from 'react';
import './formulaire.css';
import {Tooltip} from '@mui/material';

const NatureLesion = () => {
return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Liste des Natures de Lésions</h1>
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold bg-blue-600 text-white p-4">
              {category.id} - {category.title}
            </h2>
            <ul className="divide-y divide-gray-200">
              {category.items.map((item) => (
                <li key={item.id} className="p-4 hover:bg-gray-50">
                  <span className="font-medium text-blue-700">{item.id}</span> - {item.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="image-cortigroupe"></div>
            <Tooltip title="Si vous rencontrez un souci avec le site, envoyer un mail à l'adresse suivante : bgillet.lecortil@cortigroupe.be et expliquer le soucis rencontré" arrow>
                <h5 style={{ marginBottom: '40px' }}> Développé par Remy et Benoit pour Le Cortigroupe. Support: bgillet.lecortil@cortigroupe.be</h5>
            </Tooltip>
    </div>
  );
};
const categories = [
    {
        id: '00',
        title: "Nature de la blessure inconnue ou non précisée",
        items: []
    },
    {
        id: '10',
        title: "Plaies et blessures superficielles",
        items: [
            { id: '11', title: "Blessures superficielles" },
            { id: '12', title: "Plaies ouvertes" },
            { id: '13', title: "Plaies avec pertes de substances" },
            { id: '19', title: "Autres types de plaies et de blessures superficielles" }
        ]
    },
    {
        id: '20',
        title: "Fractures osseuses",
        items: [
            { id: '21', title: "Fractures fermées" },
            { id: '22', title: "Fractures ouvertes" },
            { id: '29', title: "Autres types de fractures osseuses" }
        ]
    },
    {
        id: '30',
        title: "Luxations, entorses et foulures",
        items: [
            { id: '31', title: "Luxations et sub-luxations" },
            { id: '32', title: "Entorses et foulures" },
            { id: '39', title: "Autres types de luxations, d'entorses et de foulures" }
        ]
    },
    {
        id: '40',
        title: "Amputations traumatiques (perte de parties du corps)",
        items: [
            { id: '41', title: "Amputations" }
        ]
    },
    {
        id: '50',
        title: "Commotions et traumatismes internes",
        items: [
            { id: '51', title: "Commotions et traumatismes internes" },
            { id: '52', title: "Traumatismes internes" },
            { id: '53', title: "Commotions et traumatismes internes qui, en l'absence de traitement, peuvent mettre la survie en cause" },
            { id: '54', title: "Effets nocifs de l'électricité" },
            { id: '59', title: "Autres types de commotions et de traumatismes internes" }
        ]
    },
    {
        id: '60',
        title: "Brûlures, brûlures par exposition à un liquide bouillant et gelures",
        items: [
            { id: '61', title: "Brûlures et brûlures par exposition à un liquide bouillant (thermiques)" },
            { id: '62', title: "Brûlures chimiques (corrosions)" },
            { id: '63', title: "Gelures" },
            { id: '69', title: "Autres types de brûlures, de brûlures par exposition à un liquide bouillant et de gelures" }
        ]
    },
    {
        id: '70',
        title: "Empoisonnements et infections",
        items: [
            { id: '71', title: "Empoisonnements aigus" },
            { id: '72', title: "Infections aiguës" },
            { id: '79', title: "Autres types d'empoisonnements et d'infections" }
        ]
    },
    {
        id: '80',
        title: "Noyade et asphyxie",
        items: [
            { id: '81', title: "Asphyxies" },
            { id: '82', title: "Noyades et submersions non mortelles" },
            { id: '89', title: "Autres types de noyades et d'asphyxies" }
        ]
    },
    {
        id: '90',
        title: "Effets du bruit, des vibrations et de la pression",
        items: [
            { id: '91', title: "Perte auditive aiguë" },
            { id: '92', title: "Effets de la pression (barotrauma)" },
            { id: '99', title: "Autres effets du bruit, des vibrations et de la pression" }
        ]
    },
    {
        id: '100',
        title: "Effets des extrêmes de température, de la lumière et des radiations",
        items: [
            { id: '101', title: "Chaleur et coups de soleil" },
            { id: '102', title: "Effets des radiations (non thermiques)" },
            { id: '103', title: "Effets du froid" },
            { id: '109', title: "Autres effets des extrêmes de température, de la lumière et des radiations" }
        ]
    },
    {
        id: '110',
        title: "Choc",
        items: [
            { id: '111', title: "Chocs consécutifs à des agressions et menaces" },
            { id: '112', title: "Chocs traumatiques" },
            { id: '119', title: "Autres types de chocs" }
        ]
    },
    {
        id: '120',
        title: "Blessures multiples",
        items: []
    },
    {
        id: '999',
        title: "Autres blessures déterminées non classées sous d'autres rubriques",
        items: []
    }
];

export default NatureLesion;