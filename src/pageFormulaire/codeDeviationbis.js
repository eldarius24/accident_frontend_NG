import React from 'react';
import './formulaire.css';

/**
 * Retourne un JSX contenant la liste des déviations
 */
const deviation = () => {
    return (
        <div>
            <h6></h6>
            <div className="line-separated">
                <h6 className="yellow-background">0 Pas d'information</h6>
                <h6 className="yellow-background">10 Déviation par problème électrique, explosion, feu - Non précisé</h6>
                <h6>11 Problème électrique par défaillance dans l'installation - entraînant un contact indirect</h6>
                <h6>12 Problème électrique - entraînant un contact direct</h6>
                <h6>13 Explosion</h6>
                <h6>14 Incendie, embrasement</h6>
                <h6>19 Autre Déviation connue du groupe 10 mais non listée ci-dessus</h6>
                <h6 className="yellow-background">20 Déviation par débordement, renversement, fuite, écoulement, vaporisation dégagement - Non précisé</h6>
                <h6>21 A l'état de solide - débordement, renversement</h6>
                <h6>22 A l'état de liquide - fuite, suintement, écoulement, éclaboussure, aspersion</h6>
                <h6>23 A l'état gazeux - vaporisation, formation d'aérosol, formation de gaz</h6>
                <h6>24 Pulvérulent - génération de fumée, émission de poussières, particules</h6>
                <h6>29 Autre Déviation connue du groupe 20 mais non listée ci-dessus</h6>
                <h6 className="yellow-background">30 Rupture, bris, éclatement, glissade, chute, effondrement d'Agent matériel - Non précisé</h6>
                <h6>31 Rupture de matériel, aux joints, aux connexions</h6>
                <h6>32 Rupture, éclatement, causant des éclats (bois, verre, métal, pierre, plastique, autres)</h6>
                <h6>33 Glissade, chute, effondrement d'Agent matériel - supérieur (tombant sur la victime)</h6>
                <h6>34 Glissade, chute, effondrement d'Agent matériel - inférieur (entraînant la victime)</h6>
                <h6>35 Glissade, chute, effondrement d'Agent matériel - de plain-pied</h6>
                <h6>39 Autre Déviation connue du groupe 30 mais non listée ci-dessus</h6>
                <h6 className="yellow-background">40 Perte, totale ou partielle, de contrôle de machine, moyen de transport - équipement de manutention, outil à main, objet, animal - Non précisé</h6>
                <h6>41 Perte, totale ou partielle, de contrôle - de machine (y compris le démarrage intempestif) ainsi que de la matière travaillée par la machine</h6>
                <h6>42 Perte, totale ou partielle, de contrôle de moyen de transport - d'équipement de manutention (motorisé ou non)</h6>
                <h6>43 Perte, totale ou partielle, de contrôle d'outil à main (motorisé ou non) ainsi que de la matière travaillée par l'outil</h6>
                <h6>44 Perte, totale ou partielle, de contrôle d'objet (porté, déplacé, manipulé, etc.)</h6>
                <h6>45 Perte, totale ou partielle, de contrôle d'animal</h6>
                <h6>49 Autre Déviation connue du groupe 40 mais non listée ci-dessus</h6>
                <h6 className="yellow-background">50 Glissade ou trébuchement avec chute, chute de personne - Non précisé</h6>
                <h6>51 Chute de personne - de hauteur</h6>
                <h6>52 Glissade ou trébuchement avec chute, chute de personne - de plain-pied</h6>
                <h6>59 Autre Déviation connue du groupe 50 mais non listée ci-dessus</h6>
                <h6 className="yellow-background">60 Mouvement du corps sans contrainte physique (conduisant généralement à une blessure externe) - Non précisé</h6>
                <h6>61 En marchant sur un objet coupant</h6>
                <h6>62 En s'agenouillant, s'asseyant, s'appuyant contre</h6>
                <h6>63 En étant attrapé, entraîné, par quelque chose ou par son élan</h6>
                <h6>64 Mouvements non coordonnés, gestes intempestifs, inopportuns</h6>
                <h6>69 Autre Déviation connue du groupe 60 mais non listée ci-dessus</h6>
                <h6 className="yellow-background">70 Mouvement du corps sous ou avec contrainte physique (conduisant généralement à une blessure interne) - Non précisé</h6>
                <h6>71 En soulevant, en portant, en se levant</h6>
                <h6>72 En poussant, en tractant</h6>
                <h6>73 En déposant, en se baissant</h6>
                <h6>74 En torsion, en rotation, en se tournant</h6>
                <h6>75 En marchant lourdement, faux pas, glissade - sans chute</h6>
                <h6>79 Autre Déviation connue du groupe 70 mais non listée ci-dessus</h6>
                <h6 className="yellow-background">80 Surprise, frayeur, violence, agression, menace, présence - Non précisé</h6>
                <h6>81 Surprise, frayeur</h6>
                <h6>82 Violence, agression, menace entre membres de l'entreprise soumis à l'autorité de l'employeur</h6>
                <h6>83 Violence, agression, menace - provenant de personnes externes à l'entreprise envers les victimes dans le cadre de leur fonction (attaque de banque, chauffeurs de bus, etc.)</h6>
                <h6>84 Agression, bousculade - par animal</h6>
                <h6>85 Présence de la victime ou d'un tiers créant en soi un danger pour elle/lui-même et le cas échéant pour autrui</h6>
                <h6>89 Autre Déviation connue du groupe 80 mais non listée ci-dessus</h6>
                <h6 className="yellow-background">99 Autre Déviation non listée dans cette classificatio</h6>
            </div>
            <h6></h6>
        </div>
    );
}

export default deviation;