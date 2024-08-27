/**
 * Convertit une date en format YYYY-MM-DD ou YYYY-MM-DD HH:MM:SS
 * 
 * @param {*} date date à convertir
 * @param {*} isHour la date contient-elle l'heure
 * @returns date convertie
 */
const dateConverter = (date, isHour = false) => {
    if (!date) 
        return "";

    const dateConvertit = new Date(date);

    return isHour ? 
        `${dateConvertit.getFullYear()}-${(dateConvertit.getMonth() + 1).toString().padStart(2, '0')}-${dateConvertit.getDate().toString().padStart(2, '0')} ${dateConvertit.getHours().toString().padStart(2, '0')}:${dateConvertit.getMinutes().toString().padStart(2, '0')}:${dateConvertit.getSeconds().toString().padStart(2, '0')}` :
        `${dateConvertit.getFullYear()}-${(dateConvertit.getMonth() + 1).toString().padStart(2, '0')}-${dateConvertit.getDate().toString().padStart(2, '0')}`;
}

export default dateConverter;