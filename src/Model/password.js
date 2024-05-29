import bcrypt from "bcryptjs";

/**
Fonction qui permet de comparer un mot de passe avec un hash.
@param {string} pass - Le mot de passe en claire
@param {string} hash - Le hash à comparer au mot de passe
@returns {boolean} True si le mot de passe correspond au hash
*/
export const comparePassword = async (pass, hash) => {
    return await bcrypt.compare(pass, hash);
}

/**
Fonction qui permet de hasher un mot de passe.
@param {string} pass - Le mot de passe en claire
@returns {string} Le mot de passe hashé.
*/
export const generatePasswordHash = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    const transformedPass = await transformPassword(pass);
    return await bcrypt.hash(transformedPass, salt);
}

/**
 
Fonction qui permet de rendre le mot de passe plus robuste en ajoutant le sel et le poivre.
@param {string} pass - Le mot de passe original
@returns {string} Le mot de passe rendu plus robuste.
*/
export const transformPassword = async (pass) => {
    const salt = 'c88d998169db7354bc8c292974772d23eca0b9417fcdb01144ef51e1cc22a55a608b3ff77750cdaa99106117017efc2dfd946e63e6d71b20d5f5db5b191cddf7'; 
    const pepper = '9a7e55e8bca675b3d5a13caf74da8b2b8ad41e7c83011f620500d1339eb78d440bba73ead80ef587695f54419e23bbe769a3617bc105f9011fd27cda8fc17842';

    let transformedPass = `${salt}${pass}${pepper}`;
    transformedPass = transformedPass.split('').reverse().join('');

    const quarterLength = Math.ceil(transformedPass.length / 4);
    const quarter = [
        transformedPass.substring(0, quarterLength),
        transformedPass.substring(quarterLength, quarterLength),
        transformedPass.substring(2 * quarterLength, quarterLength),
        transformedPass.substring(3 * quarterLength)
    ];
    transformedPass = quarter.reverse().join('');

    return transformedPass;
}