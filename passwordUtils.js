// passwordUtils.js
import bcrypt from 'bcrypt';

const saltRounds = 10;

// Fonction pour hacher un mot de passe
export async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Erreur lors du hachage du mot de passe : ' + error.message);
    }
}

// Fonction pour vérifier un mot de passe
export async function verifyPassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Erreur lors de la vérification du mot de passe : ' + error.message);
    }
}
