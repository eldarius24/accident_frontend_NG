import React from 'react';
import './formulaire.css';

const agentmateriel = () => {
    return (
        <div>
            <h6></h6>
            <div className="line-separated">
                <h6 className="yellow-background">00.00 Pas d’agent matériel ou pas d’information</h6>
                <h6>00.01 Pas d'agent matériel</h6>
                <h6>00.02 Pas d'information</h6>
                <h6>00.99 Autre situation connue du groupe 00 mais non listée ci-dessus</h6>
                <h6 className="yellow-background">01.00 Bâtiments, constructions, surfaces – à niveau (intérieur ou extérieur, fixes ou mobiles, temporaires ou non) – Non précisé</h6>
                <h6>01.01 Éléments de bâtiments, de constructions - portes, murs, cloisons … et obstacles pardestination (fenêtres, baies vitrées, …)</h6>
                <h6>01.02 Surfaces ou circulation à niveau - sols (intérieur ou extérieur, terrains agricoles, terrains desport, sols glissants, sols encombrés, planche à clous, …)</h6>
                <h6>01.03 Surfaces ou circulation à niveau - flottantes</h6>
                <h6>01.99 Autres bâtiments, constructions, surfaces à niveau connus du groupe 01 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">02.00 Bâtiments, constructions, surfaces – en hauteur (intérieur ou extérieur) - Non précisé</h6>
                <h6>02.01 Parties de bâtiment en hauteur - fixes (toitures, terrasses, ouvertures, escaliers, quais)</h6>
                <h6>02.02 Constructions, surfaces en hauteur - fixes (comprend les passerelles, échelles fixes, pylônes)</h6>
                <h6>02.03 Constructions, surfaces en hauteur - mobiles (comprend échafaudages, échelles mobiles, nacelle, plate-forme élévatrice)</h6>
                <h6>02.04 Constructions, surfaces en hauteur - temporaires (comprend les échafaudages temporaires, harnais, balançoires)</h6>
                <h6>02.05 Constructions, surfaces en hauteur - flottantes (comprend les plates-formes de forage, les échafaudages sur barges)</h6>
                <h6>02.99 Autres bâtiments, constructions, surfaces en hauteur connus du groupe 02 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">03.00 Bâtiments, constructions, surfaces – en profondeur (intérieur ou extérieur) - Non précisé</h6>
                <h6>03.01 Fouilles, tranchées, puits, fosses, escarpements, fosses de garage</h6>
                <h6>03.02 Souterrains, galeries</h6>
                <h6>03.03 Milieux sous-marins</h6>
                <h6>03.99 Autres bâtiments, constructions, surfaces en profondeur connus du groupe 03 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">04.00 Dispositifs de distribution de matière, d’alimentation, canalisations - Non précisé</h6>
                <h6>04.01 Dispositifs de distribution de matière, d'alimentation, canalisations - fixes - pour gaz, air, liquides, solides - y compris les trémies</h6>
                <h6>04.02 Dispositifs de distribution de matière, d'alimentation, canalisations - mobiles</h6>
                <h6>04.03 Égouts, drainages</h6>
                <h6>04.99 Autres dispositifs de distribution de matières, d'alimentation, canalisations connus du groupe</h6>
                <h6>04 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">05.00 Moteurs, dispositifs de transmission et de stockage d’énergie - Non précisé</h6>
                <h6>05.01 Moteurs, générateurs d'énergie (thermique, électrique, rayonnement) y compris les compresseurs, les pompes</h6>
                <h6>05.02 Dispositifs de transmission et stockage d'énergie (mécanique, pneumatique, hydraulique, électrique y compris batteries et accumulateurs)</h6>
                <h6>05.99 Autres moteurs, dispositifs de transmission et de stockage d'énergie connus du groupe 05 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">06.00 Outils à main, non motorisés - Non précisé</h6>
                <h6>06.01 Outils à main non motorisés - pour scier</h6>
                <h6>06.02 Outils à main non motorisés - pour couper, séparer (comprend ciseaux, cisailles, sécateurs)</h6>
                <h6>06.03 Outils à main non motorisés - pour tailler, mortaiser, ciseler, rogner, tondre</h6>
                <h6>06.04 Outils à main non motorisés - pour gratter, polir, poncer</h6>
                <h6>06.05 Outils à main non motorisés - pour percer, tourner, visser</h6>
                <h6>06.06 Outils à main non motorisés - pour clouer, riveter, agrafer</h6>
                <h6>06.07 Outils à main non motorisés - pour coudre, tricoter</h6>
                <h6>06.08 Outils à main non motorisés - pour souder, coller</h6>
                <h6>06.09 Outils à main non motorisés - pour extraction de matériaux et travail du sol (comprend les outils agricoles)</h6>
                <h6>06.10 Outils à main non motorisés - pour cirer, lubrifier, laver, nettoyer</h6>
                <h6>06.11 Outils à main non motorisés - pour peindre</h6>
                <h6>06.12 Outils à main non motorisés - pour maintenir, saisir</h6>
                <h6>06.13 Outils à main non motorisés - pour travaux de cuisine (sauf couteaux)</h6>
                <h6>06.14 Outils à main non motorisés - pour travaux médicaux et chirurgicaux - piquants, coupants</h6>
                <h6>06.15 Outils à main non motorisés - pour travaux médicaux et chirurgicaux - non coupants, autres</h6>
                <h6>06.99 Autres outils à main non motorisés connus du groupe 06 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">07.00 Outils tenus ou guidés à la main, mécaniques - Non précisé</h6>
                <h6>07.01 Outils mécaniques à main - pour scier</h6>
                <h6>07.02 Outils mécaniques à main - pour couper, séparer (comprend ciseaux, cisailles, sécateurs)</h6>
                <h6>07.03 Outils mécaniques à main - pour tailler, mortaiser, ciseler (taille haies voir 09.02), rogner, tondre</h6>
                <h6>07.04 Outils mécaniques à main - pour gratter, polir, poncer (comprend tronçonneuse à disque)</h6>
                <h6>07.05 Outils mécaniques à main - pour percer, tourner, visser</h6>
                <h6>07.06 Outils mécaniques à main - pour clouer, riveter, agrafer</h6>
                <h6>07.07 Outils mécaniques à main - pour coudre, tricoter</h6>
                <h6>07.08 Outils mécaniques à main - pour souder, coller</h6>
                <h6>07.09 Outils mécaniques à main - pour extraction de matériaux et travail du sol (comprend les outils agricoles, les brise-béton)</h6>
                <h6>07.10 Outils mécaniques à main - pour cirer, lubrifier, laver, nettoyer (comprend aspirateur nettoyeur haute pression)</h6>
                <h6>07.11 Outils mécaniques à main - pour peindre</h6>
                <h6>07.12 Outils mécaniques à main - pour maintenir, saisir</h6>
                <h6>07.13 Outils mécaniques à main - pour travaux de cuisine (sauf couteaux)</h6>
                <h6>07.14 Outils mécaniques à main - pour chauffer (comprend séchoir, décapeur thermique, fer à repasser)</h6>
                <h6>07.15 Outils mécaniques à main - pour travaux médicaux et chirurgicaux - piquants, coupants</h6>
                <h6>07.16 Outils mécaniques à main - pour travaux médicaux et chirurgicaux - non coupants, autres</h6>
                <h6>07.17 Pistolets pneumatiques (sans précision de l'outil)</h6>
                <h6>07.99 Autres outils mécaniques tenus ou guidés à main connus du groupe 07 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">08.00 Outils à main – sans précision sur la motorisation – Non précisé</h6>
                <h6>08.01 Outils à main sans précision sur la motorisation - pour scier</h6>
                <h6>08.02 Outils à main sans précision sur la motorisation - pour couper, séparer (comprend ciseaux, cisailles, sécateurs)</h6>
                <h6>08.03 Outils à main sans précision sur la motorisation - pour tailler, mortaiser, ciseler, rogner, tondre</h6>
                <h6>08.04 Outils à main sans précision sur la motorisation - pour gratter, polir, poncer</h6>
                <h6>08.05 Outils à main sans précision sur la motorisation - pour percer, tourner, visser</h6>
                <h6>08.06 Outils à main sans précision sur la motorisation - pour clouer, riveter, agrafer</h6>
                <h6>08.07 Outils à main sans précision sur la motorisation - pour coudre, tricoter</h6>
                <h6>08.08 Outils à main sans précision sur la motorisation - pour souder, coller</h6>
                <h6>08.09 Outils à main sans précision sur la motorisation - pour extraction de matériaux et travail du sol (comprend les outils agricoles)</h6>
                <h6>08.10 Outils à main sans précision sur la motorisation - pour cirer, lubrifier, laver, nettoyer</h6>
                <h6>08.11 Outils à main sans précision sur la motorisation - pour peindre</h6>
                <h6>08.12 Outils à main sans précision sur la motorisation - pour maintenir, saisir</h6>
                <h6>08.13 Outils à main sans précision sur la motorisation - pour travaux de cuisine (sauf couteaux)</h6>
                <h6>08.14 Outils à main sans précision sur la motorisation - pour travaux médicaux et chirurgicaux - piquants, coupants</h6>
                <h6>08.15 Outils à main sans précision sur la motorisation - pour travaux médicaux et chirurgicaux – non coupants, autres</h6>
                <h6>08.99 Autres outils à main sans précision sur la motorisation connus du groupe 08 mais non listés ci- dessus</h6>
                <h6 className="yellow-background">09.00 Machines et équipements - portables ou mobiles – Non précisé</h6>
                <h6>09.01 Machines portables ou mobiles d'extraction et de travail du sol - mines, carrières et engins de bâtiment, travaux publics</h6>
                <h6>09.02 Machines portables ou mobiles - de travail du sol, agriculture</h6>
                <h6>09.03 Machines portables ou mobiles (hors travail du sol) - de chantier de construction</h6>
                <h6>09.04 Machines mobiles de nettoyage des sols</h6>
                <h6>09.99 Autres machines et équipement portables ou mobiles connus du groupe 09 mais non listés ci- dessus</h6>
                <h6 className="yellow-background">10.00 Machines et équipements - fixes – Non précisé</h6>
                <h6>10.01 Machines fixes d'extraction et de travail du sol</h6>
                <h6>10.02 Machines pour la préparation des matériaux, concasser, pulvériser, filtrer, séparer, mélanger, malaxer</h6>
                <h6>10.03 Machines pour la transformation des matériaux - procédés chimiques (réacteurs, fermenteurs)</h6>
                <h6>10.04 Machines pour la transformation des matériaux - procédés à chaud (four, séchoirs, étuves)</h6>
                <h6>10.05 Machines pour la transformation des matériaux - procédés à froid (production de froid)</h6>
                <h6>10.06 Machines pour la transformation des matériaux - autres procédés</h6>
                <h6>10.07 Machines à former - par pressage, écrasement</h6>
                <h6>10.08 Machines à former - par calandrage, laminage, machines à cylindres (y compris machine de papeterie)</h6>
                <h6>10.09 Machines à former - par injection, extrusion, soufflage, filage, moulage, fusion, coulée</h6>
                <h6>10.10 Machines d'usinage - pour raboter, fraiser, surfacer, meuler, polir, tourner, percer</h6>
                <h6>10.11 Machines d'usinage - pour scier</h6>
                <h6>10.12 Machines d'usinage - pour couper, fendre, rogner (comprend presse à découper, cisaille, massicot, oxycoupage)</h6>
                <h6>10.13 Machines pour le traitement des surfaces - nettoyer, laver, sécher, peindre, imprimer</h6>
                <h6>10.14 Machines pour le traitement des surfaces - galvanisation, traitement électrolytique des surfaces</h6>
                <h6>10.15 Machines à assembler (souder, coller, clouer, visser, riveter, filer, câbler, coudre, agrafer)</h6>
                <h6>10.16 Machines à conditionner, emballer (remplir, étiqueter, fermer...)</h6>
                <h6>10.17 Autres machines d'industries spécifiques (machines diverses de contrôle, d'essais)</h6>
                <h6>10.18 Machines spécifiques utilisées en agriculture ne se rattachant pas aux machines ci-dessus</h6>
                <h6>10.99 Autres machines et équipements fixes connus du groupe 10 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">11.00 Dispositifs de convoyage, de transport et de stockage – Non précisé</h6>
                <h6>11.01 Convoyeurs fixes, matériels et systèmes de manutention continue - à tapis, escaliers roulants, téléphériques, transporteurs, …</h6>
                <h6>11.02 Élévateurs, ascenseurs, matériels de mise à niveau - monte-charge, élévateurs à godets, vérin, cric, …</h6>
                <h6>11.03 Grues fixes, mobiles, embarquées sur véhicules, ponts roulants, matériels d'élévation à charge suspendue</h6>
                <h6>11.04 Dispositifs mobiles de manutention, chariots de manutention (chariots motorisés ou non) - brouette, transpalettes, …</h6>
                <h6>11.05 Apparaux de levage, amarrage, préhension et matériels divers de manutention (comprend élingues, crochets, cordages...)</h6>
                <h6>11.06 Dispositifs de stockage, emballage, conteneurs (silos, réservoirs) - fixes - citernes, bassins, réservoirs, …</h6>
                <h6>11.07 Dispositifs de stockage, emballage, conteneurs - mobiles</h6>
                <h6>11.08 Accessoires de stockage, rayonnages, pelletiers, palettes</h6>
                <h6>11.09 Emballages divers, petits et moyens, mobiles (bennes, récipients divers, bouteilles, caisses, extincteurs...)</h6>
                <h6>11.99 Autres dispositifs de convoyage, de transport et de stockage connus du groupe 11 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">12.00 Véhicules terrestres – Non précisé</h6>
                <h6>12.01 Véhicules - poids lourds: camions de charges, bus et autocars (transport de passagers)</h6>
                <h6>12.02 Véhicules – légers: charges ou passagers</h6>
                <h6>12.03 Véhicules - deux, trois roues, motorisés ou non</h6>
                <h6>12.04 Autres véhicules terrestres: skis, patins à roulettes, …</h6>
                <h6>12.99 Autres véhicules terrestres connus du groupe 12 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">13.00 Autres véhicules de transport – Non précisé</h6>
                <h6>13.01 Véhicules - sur rails y compris monorails suspendus: charges</h6>
                <h6>13.02 Véhicules - sur rails y compris monorails suspendus: passagers</h6>
                <h6>13.03 Véhicules – nautiques: charges</h6>
                <h6>13.04 Véhicules – nautiques: passagers</h6>
                <h6>13.05 Véhicules – nautiques: pêche</h6>
                <h6>13.06 Véhicules – aériens: charges</h6>
                <h6>13.07 Véhicules – aériens: passagers</h6>
                <h6>13.99 Autres véhicules de transport connus du groupe 13 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">14.00 Matériaux, objets, produits, éléments constitutifs de machines, bris, poussières – Non précisé</h6>
                <h6>14.01 Matériaux de construction - gros et petits: agent préfabriqué, coffrage, poutrelle, brique, tuile, ….</h6>
                <h6>14.02 Éléments de construction ou éléments constitutifs de machine, de véhicule: châssis, carter, manivelle, roue, …</h6>
                <h6>14.03 Pièces travaillées ou éléments, outils de machines (y compris les fragments et éclats en provenance de ces Agents matériels)</h6>
                <h6>14.04 Éléments d'assemblage: visserie, clou, boulon, …</h6>
                <h6>14.05 Particules, poussières, éclats, morceaux, projections, échardes et autres éléments brisés</h6>
                <h6>14.06 Produits - de l'agriculture (comprend grains, paille, autres productions agricoles)</h6>
                <h6>14.07 Produits - pour l'agriculture, l'élevage (comprend engrais, aliments pour le bétail)</h6>
                <h6>14.08 Produits stockés - comprend les objets et emballages disposés dans un stockage</h6>
                <h6>14.09 Produits stockés - en rouleaux, bobines</h6>
                <h6>14.10 Charges - transportées sur dispositif de manutention mécanique, de transport</h6>
                <h6>14.11 Charges - suspendues à dispositif de mise à niveau, une grue</h6>
                <h6>14.12 Charges - manutentionnées à la main</h6>
                <h6>14.99 Autres matériaux, objets, produits, éléments de machines connus du groupe 14 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">15.00 Substances chimiques, explosives, radioactives, biologiques – Non précisé</h6>
                <h6>15.01 Matières - caustiques, corrosives (solides, liquides ou gazeuses)</h6>
                <h6>15.02 Matières - nocives, toxiques (solides, liquides ou gazeuses)</h6>
                <h6>15.03 Matières - inflammables (solides, liquides ou gazeuses)</h6>
                <h6>15.04 Matières - explosives, réactives (solides, liquides ou gazeuses)</h6>
                <h6>15.05 Gaz, vapeurs sans effets spécifiques (inertes pour la vie, asphyxiants)</h6>
                <h6>15.06 Substances - radioactives</h6>
                <h6>15.07 Substances - biologiques</h6>
                <h6>15.08 Substances, matières - sans danger spécifique (eau, matières inertes...)</h6>
                <h6>15.99 Autres substances chimiques, explosives, radioactives, biologiques connues du groupe 15 mais non listées ci-dessus</h6>
                <h6 className="yellow-background">16.00 Dispositifs et équipements de sécurité – Non précisé</h6>
                <h6>16.01 Dispositifs de sécurité - sur machine</h6>
                <h6>16.02 Dispositifs de protection - individuels</h6>
                <h6>16.03 Dispositifs et appareils - de secours</h6>
                <h6>16.99 Autres dispositifs et équipements de sécurité connus du groupe 16 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">17.00 Équipements de bureau et personnels, matériel de sport, armes, appareillage domestique – Non précisé</h6>
                <h6>17.01 Mobilier</h6>
                <h6>17.02 Équipements - informatiques, bureautique, reprographie, communication</h6>
                <h6>17.03 Équipements - pour enseignement, écriture, dessin – comprend: machine à écrire, timbrer, agrandisseur, horodateur, …</h6>
                <h6>17.04 Objets et équipements pour le sport et les jeux</h6>
                <h6>17.05 Armes</h6>
                <h6>17.06 Objets personnels, vêtements</h6>
                <h6>17.07 Instruments de musique</h6>
                <h6>17.08 Appareillage, ustensiles, objets, linge de type domestique (usage professionnel)</h6>
                <h6>17.99 Autres équipements de bureau et personnels, matériel de sport, armes connus du groupe 17 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">18.00 Organismes vivants et êtres humains - Non précisé</h6>
                <h6>18.01 Arbres, plantes, cultures</h6>
                <h6>18.02 Animaux - domestiques et d'élevage</h6>
                <h6>18.03 Animaux - sauvages, insectes, serpents</h6>
                <h6>18.04 Micro-organismes</h6>
                <h6>18.05 Agents infectieux viraux</h6>
                <h6>18.06 Humains</h6>
                <h6>18.99 Autres organismes vivants connus du groupe 18 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">19.00 Déchets en vrac – Non précisé</h6>
                <h6>19.01 Déchets en vrac - de matières, produits, matériaux, objets</h6>
                <h6>19.02 Déchets en vrac - de substances chimiques</h6>
                <h6>19.03 Déchets en vrac - de substances biologiques, végétaux, animaux</h6>
                <h6>19.99 Autres déchets en vrac connus du groupe 19 mais non listés ci-dessus</h6>
                <h6 className="yellow-background">20.00 Phénomènes physiques et éléments naturels – Non précisé</h6>
                <h6>20.01 Phénomènes physiques - bruit, radiation naturelle, lumière, arc lumineux, pressurisation, dépressurisation, pression</h6>
                <h6>20.02 Éléments naturels et atmosphériques (comprend étendues d'eau, boue, pluie, grêle, neige, verglas, coup de vent,...)</h6>
                <h6>20.03 Catastrophes naturelles (comprend inondation, volcanisme, tremblement de terre, raz de marée, feu, incendie, …)</h6>
                <h6>20.99 Autres phénomènes physiques et éléments connus du groupe 20 mais non listés ci-dessus</h6>
                <h6>99.00 Autres agents matériels non listés dans cette classificatio</h6>
            </div>
            <h6></h6>
        </div>
    );
}

export default agentmateriel;