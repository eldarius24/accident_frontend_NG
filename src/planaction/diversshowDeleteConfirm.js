import React from 'react';
import { Tooltip } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

/**
 * Affiche une boîte de dialogue de confirmation de suppression personnalisée
 * @param {Object} config Configuration de la boîte de dialogue
 * @param {string} config.message Message de confirmation à afficher
 * @param {Function} config.onConfirm Fonction à exécuter si l'utilisateur confirme
 * @param {string} [config.title='Supprimer'] Titre de la boîte de dialogue
 * @param {string} [config.confirmButtonText='Oui'] Texte du bouton de confirmation
 * @param {string} [config.cancelButtonText='Non'] Texte du bouton d'annulation
 * @param {string} [config.confirmTooltip='Cliquez sur OUI pour supprimer'] Texte de l'infobulle du bouton de confirmation
 * @param {string} [config.cancelTooltip='Cliquez sur NON pour annuler la suppression'] Texte de l'infobulle du bouton d'annulation
 */
const showDeleteConfirmation = ({
    message = 'Êtes-vous sûr de vouloir supprimer cet élément?',
    onConfirm,
    title = 'Supprimer',
    confirmButtonText = 'Oui',
    cancelButtonText = 'Non',
    confirmTooltip = 'Cliquez sur OUI pour supprimer',
    cancelTooltip = 'Cliquez sur NON pour annuler la suppression'
}) => {
    confirmAlert({
        customUI: ({ onClose }) => (
            <div className="custom-confirm-dialog">
                <h1 className="custom-confirm-title">{title}</h1>
                <p className="custom-confirm-message">{message}</p>
                <div className="custom-confirm-buttons">
                    <Tooltip title={confirmTooltip} arrow>
                        <button
                            className="custom-confirm-button"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            {confirmButtonText}
                        </button>
                    </Tooltip>
                    <Tooltip title={cancelTooltip} arrow>
                        <button
                            className="custom-confirm-button custom-confirm-no"
                            onClick={onClose}
                        >
                            {cancelButtonText}
                        </button>
                    </Tooltip>
                </div>
            </div>
        )
    });
};

export default showDeleteConfirmation;