import React from 'react';
import './formulaire.css';
import { Tooltip } from '@mui/material';
import { useTheme } from '../pageAdmin/user/ThemeContext';

const AgentMateriel = () => {
  const { darkMode } = useTheme();

  const darkModeStyles = {
    backgroundColor: darkMode ? '#1a1a1a' : '#f3f4f6',
    color: darkMode ? '#ffffff' : '#1f2937',
  };

  const cardStyles = {
    backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
    color: darkMode ? '#ffffff' : '#1f2937',
  };

  const headerStyles = {
    backgroundColor: darkMode ? '#4a5568' : '#3b82f6',
    color: '#ffffff',
  };

  const itemStyles = {
    '&:hover': {
      backgroundColor: darkMode ? '#3a3a3a' : '#f3f4f6',
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6" style={darkModeStyles}>
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: darkMode ? '#60a5fa' : '#1e40af' }}>
        Liste des codes agent matériel
      </h1>
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg shadow-md overflow-hidden" style={cardStyles}>
            <h2 className="text-xl font-semibold p-4" style={headerStyles}>
              {category.id} - {category.title}
            </h2>
            <ul className="divide-y divide-gray-200">
              {category.items.map((item) => (
                <li key={item.id} className="p-4" style={itemStyles}>
                  <span className="font-medium" style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}>{item.id}</span> - {item.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="image-cortigroupe"></div>
      <Tooltip title="Développé par Remy et Benoit pour Le Cortigroupe." arrow>
        <h5 style={{ marginBottom: '40px', color: darkMode ? '#9ca3af' : '#4b5563' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '300%',
                height: '100%',
                background: darkMode
                  ? 'linear-gradient(90deg, transparent, rgba(122,142,28,0.1), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(238,117,45,0.1), transparent)',
                animation: 'shine 3s infinite linear',
                '@keyframes shine': {
                  to: {
                    transform: 'translateX(50%)'
                  }
                }
              }
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                fontWeight: 500,
                letterSpacing: '0.1em',
                padding: '0.5rem 1.5rem',
                borderRadius: '50px',
                background: darkMode
                  ? 'linear-gradient(145deg, rgba(122,142,28,0.1), rgba(122,142,28,0.05))'
                  : 'linear-gradient(145deg, rgba(238,117,45,0.1), rgba(238,117,45,0.05))',
                backdropFilter: 'blur(5px)',
                border: darkMode
                  ? '1px solid rgba(122,142,28,0.2)'
                  : '1px solid rgba(238,117,45,0.2)',
                color: darkMode ? '#ffffff' : '#2D3748',
                boxShadow: darkMode
                  ? '0 4px 6px rgba(0,0,0,0.1)'
                  : '0 4px 6px rgba(238,117,45,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode
                    ? '0 6px 12px rgba(0,0,0,0.2)'
                    : '0 6px 12px rgba(238,117,45,0.2)',
                  '& .highlight': {
                    color: darkMode ? '#7a8e1c' : '#ee752d'
                  }
                }
              }}
            >
              <span>Développé par </span>
              <span className="highlight" style={{
                transition: 'color 0.3s ease',
                fontWeight: 700
              }}>
                Remy
              </span>
              <span> & </span>
              <span className="highlight" style={{
                transition: 'color 0.3s ease',
                fontWeight: 700
              }}>
                Benoit
              </span>
              <span> pour </span>
              <span style={{
                background: darkMode
                  ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                  : 'linear-gradient(45deg, #ee752d, #f4a261)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: 700
              }}>
                Le Cortigroupe
              </span>
              <span style={{
                fontSize: '1.2em',
                marginLeft: '4px',
                background: darkMode
                  ? 'linear-gradient(45deg, #7a8e1c, #a4bd24)'
                  : 'linear-gradient(45deg, #ee752d, #f4a261)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                ®
              </span>
            </Typography>
          </Box>
        </h5>
      </Tooltip>
    </div>
  );
};

const categories = [
  {
    id: '00',
    title: "Pas d'agent matériel ou pas d'information",
    items: [
      { id: '00.01', title: "Pas d'agent matériel" },
      { id: '00.02', title: "Pas d'information" },
      { id: '00.99', title: "Autre situation connue du groupe 00 mais non listée ci-dessus" }
    ]
  },
  {
    id: '01',
    title: "Bâtiments, constructions, surfaces – à niveau (intérieur ou extérieur, fixes ou mobiles, temporaires ou non)",
    items: [
      { id: '01.01', title: "Éléments de bâtiments, de constructions - portes, murs, cloisons … et obstacles par destination (fenêtres, baies vitrées, …)" },
      { id: '01.02', title: "Surfaces ou circulation à niveau - sols (intérieur ou extérieur, terrains agricoles, terrains de sport, sols glissants, sols encombrés, planche à clous, …)" },
      { id: '01.03', title: "Surfaces ou circulation à niveau - flottantes" },
      { id: '01.99', title: "Autres bâtiments, constructions, surfaces à niveau connus du groupe 01 mais non listés ci-dessus" }
    ]
  },

  {
    id: '02',
    title: "Bâtiments, constructions, surfaces – en hauteur (intérieur ou extérieur)",
    items: [
      { id: '02.01', title: "Parties de bâtiment en hauteur - fixes (toitures, terrasses, ouvertures, escaliers, quais)" },
      { id: '02.02', title: "Constructions, surfaces en hauteur - fixes (comprend les passerelles, échelles fixes, pylônes)" },
      { id: '02.03', title: "Constructions, surfaces en hauteur - mobiles (comprend échafaudages, échelles mobiles, nacelle, plate-forme élévatrice)" },
      { id: '02.04', title: "Constructions, surfaces en hauteur - temporaires (comprend les échafaudages temporaires, harnais, balançoires)" },
      { id: '02.05', title: "Constructions, surfaces en hauteur - flottantes (comprend les plates-formes de forage, les échafaudages sur barges)" },
      { id: '02.99', title: "Autres bâtiments, constructions, surfaces en hauteur connus du groupe 02 mais non listés ci-dessus" }
    ]
  },

  {
    id: '03',
    title: "Bâtiments, constructions, surfaces – en profondeur (intérieur ou extérieur)",
    items: [
      { id: '03.01', title: "Fouilles, tranchées, puits, fosses, escarpements, fosses de garage" },
      { id: '03.02', title: "Souterrains, galeries" },
      { id: '03.03', title: "Milieux sous-marins" },
      { id: '03.99', title: "Autres bâtiments, constructions, surfaces en profondeur connus du groupe 03 mais non listés ci-dessus" }
    ]
  },
  {
    id: '04',
    title: "Dispositifs de distribution de matière, d'alimentation, canalisations",
    items: [
      { id: '04.01', title: "Dispositifs de distribution de matière, d'alimentation, canalisations - fixes - pour gaz, air, liquides, solides - y compris les trémies" },
      { id: '04.02', title: "Dispositifs de distribution de matière, d'alimentation, canalisations - mobiles" },
      { id: '04.03', title: "Égouts, drainages" },
      { id: '04.99', title: "Autres dispositifs de distribution de matières, d'alimentation, canalisations connus du groupe 04 mais non listés ci-dessus" }
    ]
  },
  {
    id: '05',
    title: "Moteurs, dispositifs de transmission et de stockage d'énergie",
    items: [
      { id: '05.01', title: "Moteurs, générateurs d'énergie (thermique, électrique, rayonnement) y compris les compresseurs, les pompes" },
      { id: '05.02', title: "Dispositifs de transmission et stockage d'énergie (mécanique, pneumatique, hydraulique, électrique y compris batteries et accumulateurs)" },
      { id: '05.99', title: "Autres moteurs, dispositifs de transmission et de stockage d'énergie connus du groupe 05 mais non listés ci-dessus" }
    ]
  },

  {
    id: '06',
    title: "Outils à main, non motorisés",
    items: [
      { id: '06.01', title: "Outils à main non motorisés - pour scier" },
      { id: '06.02', title: "Outils à main non motorisés - pour couper, séparer (comprend ciseaux, cisailles, sécateurs)" },
      { id: '06.03', title: "Outils à main non motorisés - pour tailler, mortaiser, ciseler, rogner, tondre" },
      { id: '06.04', title: "Outils à main non motorisés - pour gratter, polir, poncer" },
      { id: '06.05', title: "Outils à main non motorisés - pour percer, tourner, visser" },
      { id: '06.06', title: "Outils à main non motorisés - pour clouer, riveter, agrafer" },
      { id: '06.07', title: "Outils à main non motorisés - pour coudre, tricoter" },
      { id: '06.08', title: "Outils à main non motorisés - pour souder, coller" },
      { id: '06.09', title: "Outils à main non motorisés - pour extraction de matériaux et travail du sol (comprend les outils agricoles)" },
      { id: '06.10', title: "Outils à main non motorisés - pour cirer, lubrifier, laver, nettoyer" },
      { id: '06.11', title: "Outils à main non motorisés - pour peindre" },
      { id: '06.12', title: "Outils à main non motorisés - pour maintenir, saisir" },
      { id: '06.13', title: "Outils à main non motorisés - pour travaux de cuisine (sauf couteaux)" },
      { id: '06.14', title: "Outils à main non motorisés - pour travaux médicaux et chirurgicaux - piquants, coupants" },
      { id: '06.15', title: "Outils à main non motorisés - pour travaux médicaux et chirurgicaux - non coupants, autres" },
      { id: '06.99', title: "Autres outils à main non motorisés connus du groupe 06 mais non listés ci-dessus" }
    ]
  },
  {
    id: '07',
    title: "Outils tenus ou guidés à la main, mécaniques",
    items: [
      { id: '07.01', title: "Outils mécaniques à main - pour scier" },
      { id: '07.02', title: "Outils mécaniques à main - pour couper, séparer (comprend ciseaux, cisailles, sécateurs)" },
      { id: '07.03', title: "Outils mécaniques à main - pour tailler, mortaiser, ciseler (taille haies voir 09.02), rogner, tondre" },
      { id: '07.04', title: "Outils mécaniques à main - pour gratter, polir, poncer (comprend tronçonneuse à disque)" },
      { id: '07.05', title: "Outils mécaniques à main - pour percer, tourner, visser" },
      { id: '07.06', title: "Outils mécaniques à main - pour clouer, riveter, agrafer" },
      { id: '07.07', title: "Outils mécaniques à main - pour coudre, tricoter" },
      { id: '07.08', title: "Outils mécaniques à main - pour souder, coller" },
      { id: '07.09', title: "Outils mécaniques à main - pour extraction de matériaux et travail du sol (comprend les outils agricoles, les brise-béton)" },
      { id: '07.10', title: "Outils mécaniques à main - pour cirer, lubrifier, laver, nettoyer (comprend aspirateur nettoyeur haute pression)" },
      { id: '07.11', title: "Outils mécaniques à main - pour peindre" },
      { id: '07.12', title: "Outils mécaniques à main - pour maintenir, saisir" },
      { id: '07.13', title: "Outils mécaniques à main - pour travaux de cuisine (sauf couteaux)" },
      { id: '07.14', title: "Outils mécaniques à main - pour chauffer (comprend séchoir, décapeur thermique, fer à repasser)" },
      { id: '07.15', title: "Outils mécaniques à main - pour travaux médicaux et chirurgicaux - piquants, coupants" },
      { id: '07.16', title: "Outils mécaniques à main - pour travaux médicaux et chirurgicaux - non coupants, autres" },
      { id: '07.17', title: "Pistolets pneumatiques (sans précision de l'outil)" },
      { id: '07.99', title: "Autres outils mécaniques tenus ou guidés à main connus du groupe 07 mais non listés ci-dessus" }
    ]
  },
  {
    id: '08',
    title: "Outils à main – sans précision sur la motorisation",
    items: [
      { id: '08.01', title: "Outils à main sans précision sur la motorisation - pour scier" },
      { id: '08.02', title: "Outils à main sans précision sur la motorisation - pour couper, séparer (comprend ciseaux, cisailles, sécateurs)" },
      { id: '08.03', title: "Outils à main sans précision sur la motorisation - pour tailler, mortaiser, ciseler, rogner, tondre" },
      { id: '08.04', title: "Outils à main sans précision sur la motorisation - pour gratter, polir, poncer" },
      { id: '08.05', title: "Outils à main sans précision sur la motorisation - pour percer, tourner, visser" },
      { id: '08.06', title: "Outils à main sans précision sur la motorisation - pour clouer, riveter, agrafer" },
      { id: '08.07', title: "Outils à main sans précision sur la motorisation - pour coudre, tricoter" },
      { id: '08.08', title: "Outils à main sans précision sur la motorisation - pour souder, coller" },
      { id: '08.09', title: "Outils à main sans précision sur la motorisation - pour extraction de matériaux et travail du sol (comprend les outils agricoles)" },
      { id: '08.10', title: "Outils à main sans précision sur la motorisation - pour cirer, lubrifier, laver, nettoyer" },
      { id: '08.11', title: "Outils à main sans précision sur la motorisation - pour peindre" },
      { id: '08.12', title: "Outils à main sans précision sur la motorisation - pour maintenir, saisir" },
      { id: '08.13', title: "Outils à main sans précision sur la motorisation - pour travaux de cuisine (sauf couteaux)" },
      { id: '08.14', title: "Outils à main sans précision sur la motorisation - pour travaux médicaux et chirurgicaux - piquants, coupants" },
      { id: '08.15', title: "Outils à main sans précision sur la motorisation - pour travaux médicaux et chirurgicaux – non coupants, autres" },
      { id: '08.99', title: "Autres outils à main sans précision sur la motorisation connus du groupe 08 mais non listés ci-dessus" }
    ]
  },
  {
    id: '09',
    title: "Machines et équipements - portables ou mobiles",
    items: [
      { id: '09.01', title: "Machines portables ou mobiles d'extraction et de travail du sol - mines, carrières et engins de bâtiment, travaux publics" },
      { id: '09.02', title: "Machines portables ou mobiles - de travail du sol, agriculture" },
      { id: '09.03', title: "Machines portables ou mobiles (hors travail du sol) - de chantier de construction" },
      { id: '09.04', title: "Machines mobiles de nettoyage des sols" },
      { id: '09.99', title: "Autres machines et équipement portables ou mobiles connus du groupe 09 mais non listés ci-dessus" }
    ]
  },
  {
    id: '10',
    title: "Machines et équipements - fixes",
    items: [
      { id: '10.01', title: "Machines fixes d'extraction et de travail du sol" },
      { id: '10.02', title: "Machines pour la préparation des matériaux, concasser, pulvériser, filtrer, séparer, mélanger, malaxer" },
      { id: '10.03', title: "Machines pour la transformation des matériaux - procédés chimiques (réacteurs, fermenteurs)" },
      { id: '10.04', title: "Machines pour la transformation des matériaux - procédés à chaud (four, séchoirs, étuves)" },
      { id: '10.05', title: "Machines pour la transformation des matériaux - procédés à froid (production de froid)" },
      { id: '10.06', title: "Machines pour la transformation des matériaux - autres procédés" },
      { id: '10.07', title: "Machines à former - par pressage, écrasement" },
      { id: '10.08', title: "Machines à former - par calandrage, laminage, machines à cylindres (y compris machine de papeterie)" },
      { id: '10.09', title: "Machines à former - par injection, extrusion, soufflage, filage, moulage, fusion, coulée" },
      { id: '10.10', title: "Machines d'usinage - pour raboter, fraiser, surfacer, meuler, polir, tourner, percer" },
      { id: '10.11', title: "Machines d'usinage - pour scier" },
      { id: '10.12', title: "Machines d'usinage - pour couper, fendre, rogner (comprend presse à découper, cisaille, massicot, oxycoupage)" },
      { id: '10.13', title: "Machines pour le traitement des surfaces - nettoyer, laver, sécher, peindre, imprimer" },
      { id: '10.14', title: "Machines pour le traitement des surfaces - galvanisation, traitement électrolytique des surfaces" },
      { id: '10.15', title: "Machines à assembler (souder, coller, clouer, visser, riveter, filer, câbler, coudre, agrafer)" },
      { id: '10.16', title: "Machines à conditionner, emballer (remplir, étiqueter, fermer...)" },
      { id: '10.17', title: "Autres machines d'industries spécifiques (machines diverses de contrôle, d'essais)" },
      { id: '10.18', title: "Machines spécifiques utilisées en agriculture ne se rattachant pas aux machines ci-dessus" },
      { id: '10.99', title: "Autres machines et équipements fixes connus du groupe 10 mais non listés ci-dessus" }
    ]
  },
  {
    id: '11',
    title: "Dispositifs de convoyage, de transport et de stockage",
    items: [
      { id: '11.01', title: "Convoyeurs fixes, matériels et systèmes de manutention continue - à tapis, escaliers roulants, téléphériques, transporteurs, …" },
      { id: '11.02', title: "Élévateurs, ascenseurs, matériels de mise à niveau - monte-charge, élévateurs à godets, vérin, cric, …" },
      { id: '11.03', title: "Grues fixes, mobiles, embarquées sur véhicules, ponts roulants, matériels d'élévation à charge suspendue" },
      { id: '11.04', title: "Dispositifs mobiles de manutention, chariots de manutention (chariots motorisés ou non) - brouette, transpalettes, …" },
      { id: '11.05', title: "Apparaux de levage, amarrage, préhension et matériels divers de manutention (comprend élingues, crochets, cordages...)" },
      { id: '11.06', title: "Dispositifs de stockage, emballage, conteneurs (silos, réservoirs) - fixes - citernes, bassins, réservoirs, …" },
      { id: '11.07', title: "Dispositifs de stockage, emballage, conteneurs - mobiles" },
      { id: '11.08', title: "Accessoires de stockage, rayonnages, pelletiers, palettes" },
      { id: '11.09', title: "Emballages divers, petits et moyens, mobiles (bennes, récipients divers, bouteilles, caisses, extincteurs...)" },
      { id: '11.99', title: "Autres dispositifs de convoyage, de transport et de stockage connus du groupe 11 mais non listés ci-dessus" }
    ]
  },
  {
    id: '12',
    title: "Véhicules terrestres",
    items: [
      { id: '12.01', title: "Véhicules - poids lourds: camions de charges, bus et autocars (transport de passagers)" },
      { id: '12.02', title: "Véhicules – légers: charges ou passagers" },
      { id: '12.03', title: "Véhicules - deux, trois roues, motorisés ou non" },
      { id: '12.04', title: "Autres véhicules terrestres: skis, patins à roulettes, …" },
      { id: '12.99', title: "Autres véhicules terrestres connus du groupe 12 mais non listés ci-dessus" }
    ]
  },
  {
    id: '13',
    title: "Autres véhicules de transport",
    items: [
      { id: '13.01', title: "Véhicules - sur rails y compris monorails suspendus: charges" },
      { id: '13.02', title: "Véhicules - sur rails y compris monorails suspendus: passagers" },
      { id: '13.03', title: "Véhicules – nautiques: charges" },
      { id: '13.04', title: "Véhicules – nautiques: passagers" },
      { id: '13.05', title: "Véhicules – nautiques: pêche" },
      { id: '13.06', title: "Véhicules – aériens: charges" },
      { id: '13.07', title: "Véhicules – aériens: passagers" },
      { id: '13.99', title: "Autres véhicules de transport connus du groupe 13 mais non listés ci-dessus" }
    ]
  },
  {
    id: '14',
    title: "Matériaux, objets, produits, éléments constitutifs de machines, bris, poussières",
    items: [
      // ... (éléments précédents)
      { id: '14.05', title: "Particules, poussières, éclats, morceaux, projections, échardes et autres éléments brisés" },
      { id: '14.06', title: "Produits - de l'agriculture (comprend grains, paille, autres productions agricoles)" },
      { id: '14.07', title: "Produits - pour l'agriculture, l'élevage (comprend engrais, aliments pour le bétail)" },
      { id: '14.08', title: "Produits stockés - comprend les objets et emballages disposés dans un stockage" },
      { id: '14.09', title: "Produits stockés - en rouleaux, bobines" },
      { id: '14.10', title: "Charges - transportées sur dispositif de manutention mécanique, de transport" },
      { id: '14.11', title: "Charges - suspendues à dispositif de mise à niveau, une grue" },
      { id: '14.12', title: "Charges - manutentionnées à la main" },
      { id: '14.99', title: "Autres matériaux, objets, produits, éléments de machines connus du groupe 14 mais non listés ci-dessus" }
    ]
  },
  {
    id: '15',
    title: "Substances chimiques, explosives, radioactives, biologiques",
    items: [
      { id: '15.01', title: "Matières - caustiques, corrosives (solides, liquides ou gazeuses)" },
      { id: '15.02', title: "Matières - nocives, toxiques (solides, liquides ou gazeuses)" },
      { id: '15.03', title: "Matières - inflammables (solides, liquides ou gazeuses)" },
      { id: '15.04', title: "Matières - explosives, réactives (solides, liquides ou gazeuses)" },
      { id: '15.05', title: "Gaz, vapeurs sans effets spécifiques (inertes pour la vie, asphyxiants)" },
      { id: '15.06', title: "Substances - radioactives" },
      { id: '15.07', title: "Substances - biologiques" },
      { id: '15.08', title: "Substances, matières - sans danger spécifique (eau, matières inertes...)" },
      { id: '15.99', title: "Autres substances chimiques, explosives, radioactives, biologiques connues du groupe 15 mais non listées ci-dessus" }
    ]
  },
  {
    id: '16',
    title: "Dispositifs et équipements de sécurité",
    items: [
      { id: '16.01', title: "Dispositifs de sécurité - sur machine" },
      { id: '16.02', title: "Dispositifs de protection - individuels" },
      { id: '16.03', title: "Dispositifs et appareils - de secours" },
      { id: '16.99', title: "Autres dispositifs et équipements de sécurité connus du groupe 16 mais non listés ci-dessus" }
    ]
  },
  {
    id: '17',
    title: "Équipements de bureau et personnels, matériel de sport, armes, appareillage domestique",
    items: [
      { id: '17.01', title: "Mobilier" },
      { id: '17.02', title: "Équipements - informatiques, bureautique, reprographie, communication" },
      { id: '17.03', title: "Équipements - pour enseignement, écriture, dessin – comprend: machine à écrire, timbrer, agrandisseur, horodateur, …" },
      { id: '17.04', title: "Objets et équipements pour le sport et les jeux" },
      { id: '17.05', title: "Armes" },
      { id: '17.06', title: "Objets personnels, vêtements" },
      { id: '17.07', title: "Instruments de musique" },
      { id: '17.08', title: "Appareillage, ustensiles, objets, linge de type domestique (usage professionnel)" },
      { id: '17.99', title: "Autres équipements de bureau et personnels, matériel de sport, armes connus du groupe 17 mais non listés ci-dessus" }
    ]
  },
  {
    id: '18',
    title: "Organismes vivants et êtres humains",
    items: [
      { id: '18.01', title: "Arbres, plantes, cultures" },
      { id: '18.02', title: "Animaux - domestiques et d'élevage" },
      { id: '18.03', title: "Animaux - sauvages, insectes, serpents" },
      { id: '18.04', title: "Micro-organismes" },
      { id: '18.05', title: "Agents infectieux viraux" },
      { id: '18.06', title: "Humains" },
      { id: '18.99', title: "Autres organismes vivants connus du groupe 18 mais non listés ci-dessus" }
    ]
  },
  {
    id: '19',
    title: "Déchets en vrac",
    items: [
      { id: '19.01', title: "Déchets en vrac - de matières, produits, matériaux, objets" },
      { id: '19.02', title: "Déchets en vrac - de substances chimiques" },
      { id: '19.03', title: "Déchets en vrac - de substances biologiques, végétaux, animaux" },
      { id: '19.99', title: "Autres déchets en vrac connus du groupe 19 mais non listés ci-dessus" }
    ]
  },
  {
    id: '20',
    title: "Phénomènes physiques et éléments naturels",
    items: [
      { id: '20.01', title: "Phénomènes physiques - bruit, radiation naturelle, lumière, arc lumineux, pressurisation, dépressurisation, pression" },
      { id: '20.02', title: "Éléments naturels et atmosphériques (comprend étendues d'eau, boue, pluie, grêle, neige, verglas, coup de vent,...)" },
      { id: '20.03', title: "Catastrophes naturelles (comprend inondation, volcanisme, tremblement de terre, raz de marée, feu, incendie, …)" },
      { id: '20.99', title: "Autres phénomènes physiques et éléments connus du groupe 20 mais non listés ci-dessus" }
    ]
  },
  {
    id: '99',
    title: "Autres agents matériels non listés dans cette classification",
    items: [
      { id: '99.00', title: "Autres agents matériels non listés dans cette classification" }
    ]
  }
];

export default AgentMateriel;