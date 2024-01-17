

export default function dateConverter(date, isHour = false) {
    if (!date) {
        return ""; // Retourne une chaîne vide si la date est vide
    }

    const dateConvertit = new Date(date);

    if (isHour) {
        return `${dateConvertit.getFullYear()}-${(dateConvertit.getMonth() + 1).toString().padStart(2, '0')}-${dateConvertit.getDate().toString().padStart(2, '0')} : ${dateConvertit.getHours().toString().padStart(2, '0')}:${dateConvertit.getMinutes().toString().padStart(2, '0')}`;
    } else {
        return `${dateConvertit.getFullYear()}-${(dateConvertit.getMonth() + 1).toString().padStart(2, '0')}-${dateConvertit.getDate().toString().padStart(2, '0')}`;
    }
}