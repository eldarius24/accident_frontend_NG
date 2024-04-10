const smb2 = require('@marsaud/smb2');

const client = new smb2({
    share: '\\localhost\\storage',
    domain: 'WORKGROUP',
    username: 'samba',
    password: 'Ammo1234!',
});

try {
    client.readdir('', (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du répertoire :', err);
        } else {
            console.log('Fichiers :', files);
        }
    });
} catch (error) {
    console.error('Une erreur s\'est produite :', error);
}