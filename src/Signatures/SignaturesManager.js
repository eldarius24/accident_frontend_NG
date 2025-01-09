import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Alert,
    FormControl,
    Select,
    MenuItem,
    Paper,
    CircularProgress,
    IconButton,
    Chip,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import config from '../config.json';
import { useUserConnected } from '../Hook/userConnected';
import SignaturePreviewDialog from './SignaturePreviewDialog';
const SignaturesManager = () => {
    const [documents, setDocuments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const { userInfo } = useUserConnected();
    const apiUrl = config.apiUrl;
    const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);


    const handleSignClick = (doc) => {
        setSelectedDocument(doc);
        setSignatureDialogOpen(true);
    };

    const handleSignatureComplete = async () => {
        await loadDocuments();
        setSignatureDialogOpen(false);
        setSelectedDocument(null);
    };

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://${apiUrl}:3100/api/signatures/documents`);
            setDocuments(response.data);
        } catch (error) {
            console.error('Erreur loadDocuments:', error);
            setError("Erreur lors du chargement des documents");
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const response = await axios.get(`http://${apiUrl}:3100/api/users`);
            if (response.data && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                throw new Error('Format de données utilisateurs invalide');
            }
        } catch (error) {
            console.error('Erreur loadUsers:', error);
            setError("Erreur lors du chargement des utilisateurs");
        }
    };

    useEffect(() => {
        loadUsers();
        loadDocuments();
    }, []);

    const assignUser = async (documentId, userId) => {
        try {
            setError(null);
            await axios.post(`http://${apiUrl}:3100/api/signatures/assign`, {
                documentId,
                userId
            });
            await loadDocuments();
        } catch (error) {
            console.error('Erreur assignUser:', error);
            setError("Erreur lors de l'attribution du signataire");
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!userInfo || !userInfo._id) {
            setError("Erreur : Utilisateur non identifié");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploadedBy', userInfo._id);

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `http://${apiUrl}:3100/api/signatures/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            if (response.data.success) {
                await loadDocuments();
            } else {
                throw new Error(response.data.message || 'Erreur lors de l\'upload');
            }
        } catch (error) {
            console.error('Erreur upload:', error);
            setError(error.response?.data?.message || "Erreur lors de l'upload du document");
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (documentId) => {
        try {
            setError(null);
            setLoading(true);
            await axios.delete(`http://${apiUrl}:3100/api/signatures/${documentId}`);
            setDeleteDialogOpen(false);
            setDocumentToDelete(null);
            await loadDocuments();
        } catch (error) {
            console.error('Erreur suppression document:', error);
            setError("Erreur lors de la suppression du document");
        } finally {
            setLoading(false);
        }
    };

    const removeSigner = async (documentId, signerId) => {
        try {
            setError(null);
            await axios.post(`http://${apiUrl}:3100/api/signatures/remove-signer`, {
                documentId,
                signerId
            });
            await loadDocuments();
        } catch (error) {
            console.error('Erreur suppression signataire:', error);
            setError("Erreur lors de la suppression du signataire");
        }
    };

    const handleDeleteClick = (document) => {
        setDocumentToDelete(document);
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setDocumentToDelete(null);
    };

    if (!userInfo) {
        return (
            <Paper elevation={3} sx={{ p: 3, m: 3 }}>
                <Typography>Veuillez vous connecter pour accéder à cette fonctionnalité.</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3, m: 3 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Gestion des Signatures Électroniques
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        variant="contained"
                        onClick={() => document.getElementById('fileUpload').click()}
                        disabled={loading}
                        sx={{ mb: 3 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Ajouter un Document'}
                    </Button>
                    <input
                        id="fileUpload"
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />

                    {loading && <CircularProgress />}

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Document</TableCell>
                                <TableCell>Date d'ajout</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Signataires</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc._id}>
                                    <TableCell>{doc.filename}</TableCell>
                                    <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {doc.status === 'pending' ? 'En attente' :
                                            doc.status === 'in_progress' ? 'En cours' :
                                                doc.status === 'completed' ? 'Terminé' : doc.status}
                                    </TableCell>
                                    <TableCell>
                                        {doc.signers.map((signer) => (
                                            <Chip
                                                key={signer._id}
                                                label={signer.userId?.userName}
                                                onDelete={() => removeSigner(doc._id, signer._id)}
                                                color={signer.signed ? "success" : "warning"}
                                                sx={{ m: 0.5 }}
                                            />
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <FormControl sx={{ minWidth: 200, mr: 2 }}>
                                            <Select
                                                displayEmpty
                                                value=""
                                                onChange={(e) => assignUser(doc._id, e.target.value)}
                                            >
                                                <MenuItem value="" disabled>
                                                    Ajouter un signataire ({users.length} utilisateurs)
                                                </MenuItem>
                                                {users && users.length > 0 && users.map((user) => (
                                                    <MenuItem key={user._id} value={user._id}>
                                                        {user.userName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {doc.status !== 'completed' && (
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleSignClick(doc)}
                                            >
                                                Signer
                                            </Button>
                                        )}

                                        <Tooltip title="Supprimer le document">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteClick(doc)}
                                                sx={{ ml: 1 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog de confirmation de suppression */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer le document "{documentToDelete?.filename}" ?
                        Cette action est irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Annuler
                    </Button>
                    <Button
                        onClick={() => deleteDocument(documentToDelete?._id)}
                        color="error"
                        variant="contained"
                    >
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
            <SignaturePreviewDialog
                open={signatureDialogOpen}
                onClose={() => setSignatureDialogOpen(false)}
                document={selectedDocument}
                apiUrl={apiUrl}
                userInfo={userInfo}
                onSignatureComplete={handleSignatureComplete}
            />
        </Paper>
    );
};

export default SignaturesManager;