import React, { useState, useEffect, useMemo } from 'react';
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
    DialogTitle,
    Box,
    TableContainer
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import config from '../config.json';
import { useUserConnected } from '../Hook/userConnected';
import SignaturePreviewDialog from './SignaturePreviewDialog';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '../Hook/ThemeContext';
import { TabletMac } from '@mui/icons-material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { blueGrey } from '@mui/material/colors';

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
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const { darkMode } = useTheme();
    const rowColors = useMemo(() =>
        darkMode
            ? ['#7a7a7a', '#979797']
            : ['#e62a5625', '#95519b25'],
        [darkMode]
    );

    const COLORS = {
        DARK: {
            BG: '#424242',
            BG_HOVER: '#505050',
            TEXT: '#fff',
            CHECKBOX: '#4CAF50',
            CHECKBOX_CHECKED: '#81C784'
        },
        LIGHT: {
            BG: '#ee742d59',
            BG_HOVER: '#ee742d80',
            TEXT: 'inherit',
            CHECKBOX: '#257525',
            CHECKBOX_CHECKED: '#257525'
        }
    };

    const FORM_CONTROL_STYLES = {
        DARK: {
            bg: '#424242',
            border: 'rgba(255,255,255,0.3)',
            hoverBorder: 'rgba(255,255,255,0.5)',
            text: '#fff',
            shadow: '0 3px 6px rgba(255,255,255,0.1)',
            hoverShadow: '0 6px 12px rgba(255,255,255,0.2)'
        },
        LIGHT: {
            bg: '#ee742d59',
            border: 'rgba(0,0,0,0.23)',
            hoverBorder: 'rgba(0,0,0,0.5)',
            text: 'inherit',
            shadow: 3,
            hoverShadow: 6
        }
    };


    const getFormControlStyles = useMemo(() => (isDark) => ({
        width: '40%',
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        backgroundColor: isDark ? FORM_CONTROL_STYLES.DARK.bg : FORM_CONTROL_STYLES.LIGHT.bg,
        boxShadow: isDark ? FORM_CONTROL_STYLES.DARK.shadow : FORM_CONTROL_STYLES.LIGHT.shadow,
        '&:hover': {
            boxShadow: isDark ? FORM_CONTROL_STYLES.DARK.hoverShadow : FORM_CONTROL_STYLES.LIGHT.hoverShadow,
            transform: 'translateY(-2px)'
        },
        '& .MuiOutlinedInput-root': {
            color: isDark ? FORM_CONTROL_STYLES.DARK.text : FORM_CONTROL_STYLES.LIGHT.text,
            '& fieldset': {
                borderColor: isDark ? FORM_CONTROL_STYLES.DARK.border : FORM_CONTROL_STYLES.LIGHT.border,
                transition: 'border-color 0.2s ease-in-out'
            },
            '&:hover fieldset': {
                borderColor: isDark ? FORM_CONTROL_STYLES.DARK.hoverBorder : FORM_CONTROL_STYLES.LIGHT.hoverBorder
            }
        },
        '& .MuiInputLabel-root, & .MuiSvgIcon-root': {
            color: isDark ? FORM_CONTROL_STYLES.DARK.text : FORM_CONTROL_STYLES.LIGHT.text
        }
    }), []);

    const getMenuItemStyles = useMemo(() => (isDark) => ({
        backgroundColor: isDark ? COLORS.DARK.BG : COLORS.LIGHT.BG,
        color: isDark ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT,
        '&:hover': {
            backgroundColor: isDark ? COLORS.DARK.BG_HOVER : COLORS.LIGHT.BG_HOVER
        },
        '&.Mui-selected': {
            backgroundColor: `${isDark ? COLORS.DARK.BG : COLORS.LIGHT.BG} !important`
        },
        '&.Mui-selected:hover': {
            backgroundColor: `${isDark ? COLORS.DARK.BG_HOVER : COLORS.LIGHT.BG_HOVER} !important`
        }
    }), []);

    const buttonStyle = {
        backgroundColor: '#01aeac',
        '&:hover': { backgroundColor: '#95519b' },
        mr: 1,
        whiteSpace: 'nowrap',
    };
    const handleSignClick = (doc) => {
        setSelectedDocument(doc);
        setSignatureDialogOpen(true);
    };

    const handlePreviewClick = (doc) => {
        setSelectedDocument(doc);
        setPreviewDialogOpen(true);
    };

    const handleSignatureComplete = async (closeDialog = true) => {
        await loadDocuments();
        if (closeDialog) {
            setSignatureDialogOpen(false);
            setSelectedDocument(null);
        }
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
        <div style={{ margin: '0 20px' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '2rem 0',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '150px',
                    height: '4px',
                    background: darkMode
                        ? 'linear-gradient(90deg, rgba(122,142,28,0.2) 0%, rgba(122,142,28,1) 50%, rgba(122,142,28,0.2) 100%)'
                        : 'linear-gradient(90deg, rgba(238,117,45,0.2) 0%, rgba(238,117,45,1) 50%, rgba(238,117,45,0.2) 100%)',
                    borderRadius: '2px'
                }
            }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#2D3748',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        textAlign: 'center',
                        textShadow: darkMode
                            ? '2px 2px 4px rgba(0,0,0,0.3)'
                            : '2px 2px 4px rgba(0,0,0,0.1)',
                        '&::first-letter': {
                            color: darkMode ? '#7a8e1c' : '#ee752d',
                            fontSize: '120%'
                        },
                        position: 'relative',
                        padding: '0 20px'
                    }}
                >
                    Gestion des Signatures Électroniques
                </Typography>
            </Box>

            <CardContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    onClick={() => document.getElementById('fileUpload').click()}
                    disabled={loading}
                    sx={{
                        ...buttonStyle,
                        transition: 'all 0.1s ease-in-out',
                        '&:hover': {
                            backgroundColor: '#95ad22',
                            transform: 'scale(1.08)',
                            boxShadow: 6
                        }
                    }}
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
                <TableContainer
                    className="frameStyle-style"
                    style={{
                        maxHeight: '900px',
                        overflowY: 'auto',
                        backgroundColor: darkMode ? '#6e6e6e' : '#ffffff',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                style={{
                                    backgroundColor: darkMode ? '#535353' : '#0098f950',
                                }}>
                                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Document</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Date d'ajout</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Sélection des Signataires</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Signataires</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Signer</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Visualiser</TableCell>
                                <TableCell style={{ fontWeight: 'bold', padding: 0, width: '70px' }}>Supprimer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.map((doc, index) => (
                                <TableRow key={doc._id}
                                    className={`table-row-separatormenu ${darkMode ? 'dark-separator' : ''}`}
                                    style={{
                                        backgroundColor: rowColors[index % rowColors.length],
                                    }}>
                                    <TableCell>
                                        <Chip
                                            label={
                                                doc.status === 'pending' ? 'En attente' :
                                                    doc.status === 'in_progress' ? 'En cours' :
                                                        doc.status === 'completed' ? 'Terminé' : doc.status
                                            }
                                            color={
                                                doc.status === 'pending' ? 'warning' :
                                                    doc.status === 'in_progress' ? 'info' :
                                                        doc.status === 'completed' ? 'success' : 'default'
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{doc.filename}</TableCell>
                                    <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FormControl sx={getFormControlStyles(darkMode)}>
                                                <Select
                                                    displayEmpty
                                                    value=""
                                                    onChange={(e) => assignUser(doc._id, e.target.value)}
                                                    sx={{
                                                        '& .MuiSelect-icon': {
                                                            color: darkMode ? '#fff' : 'inherit'
                                                        }
                                                    }}
                                                >
                                                    <MenuItem
                                                        value="" disabled
                                                        sx={getMenuItemStyles(darkMode)}
                                                    >
                                                        Ajouter un signataire ({users.length} utilisateurs)
                                                    </MenuItem>
                                                    {users.map((user) => (
                                                        <MenuItem 
                                                        key={user._id} 
                                                        value={user._id}
                                                        sx={getMenuItemStyles(darkMode)}
                                                        >
                                                            {user.userName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {doc.signers.map((signer) => (
                                            <Chip
                                                key={signer._id}
                                                label={signer.userId?.userName}
                                                onDelete={signer.signed ? undefined : () => removeSigner(doc._id, signer._id)}
                                                color={signer.signed ? "success" : "warning"}
                                                sx={{ m: 0.5 }}
                                            />
                                        ))}
                                    </TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        {doc.status !== 'completed' && (
                                            <Tooltip title="Signer le document">
                                                <Button
                                                    sx={{
                                                        backgroundColor: darkMode ? blueGrey[700] : blueGrey[500],
                                                        transition: 'all 0.1s ease-in-out',
                                                        '&:hover': {
                                                            backgroundColor: darkMode ? blueGrey[900] : blueGrey[700],
                                                            transform: 'scale(1.08)',
                                                            boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: darkMode ? '#fff' : 'inherit'
                                                        }
                                                    }}
                                                    color="primary"
                                                    variant="contained"
                                                    onClick={() => handleSignClick(doc)}
                                                >
                                                    <AutoGraphIcon />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Visualiser le fichier">
                                            <Button
                                                sx={{
                                                    transition: 'all 0.1s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'scale(1.08)',
                                                        boxShadow: 6
                                                    }
                                                }}
                                                color="secondary"
                                                onClick={() => handlePreviewClick(doc)}
                                                variant="contained"
                                            >
                                                <VisibilityIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell style={{ padding: 0, width: '70px' }}>
                                        <Tooltip title="Supprimer le document">
                                            <Button sx={{
                                                backgroundColor: darkMode ? '#b71c1c' : '#d32f2f',
                                                transition: 'all 0.1s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: darkMode ? '#d32f2f' : '#b71c1c',
                                                    transform: 'scale(1.08)',
                                                    boxShadow: darkMode ? '0 6px 12px rgba(255,255,255,0.2)' : 6
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: darkMode ? '#fff' : 'inherit'
                                                }
                                            }}
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDeleteClick(doc)}
                                            >
                                                <DeleteForeverIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>


            {/* Dialog de confirmation de suppression */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer le document "{documentToDelete?.filename}" ?
                        Cette action est irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
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

            {/* Dialog de signature */}
            <SignaturePreviewDialog
                open={signatureDialogOpen}
                onClose={() => setSignatureDialogOpen(false)}
                document={selectedDocument}
                apiUrl={apiUrl}
                userInfo={userInfo}
                onSignatureComplete={handleSignatureComplete}
            />

            {/* Dialog de prévisualisation */}
            <DocumentPreviewDialog
                open={previewDialogOpen}
                onClose={() => {
                    setPreviewDialogOpen(false);
                    setSelectedDocument(null);
                }}
                document={selectedDocument}
                apiUrl={apiUrl}
            />
        </div>
    );
};

export default SignaturesManager;