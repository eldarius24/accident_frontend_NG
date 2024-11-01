
import axios from 'axios';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/webpack';

const getPreview = async (fileId, fileName) => {
    try {
        const response = await axios.get(`http://localhost:3100/api/getFile/${fileId}`, {
            responseType: 'blob',
        }); 
        const blob = response.data;
        const fileType = fileName.split('.').pop().toLowerCase();

        if (fileType === 'pdf') {
            const pdf = await pdfjsLib.getDocument(URL.createObjectURL(blob)).promise;
            const page = await pdf.getPage(1);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;
            return { type: 'pdf', url: canvas.toDataURL() };
        } else if (fileType === 'docx') {
            const arrayBuffer = await blob.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            return { type: 'docx', text: result.value.substring(0, 200) + "..." };
        } else if (fileType === 'txt') {
            const text = await blob.text();
            return { type: 'txt', text: text.substring(0, 200) + (text.length > 200 ? "..." : "") };
        } else {
            return { type: 'image', url: URL.createObjectURL(blob) };
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la prévisualisation:', error);
        return null;
    }
};


export default getPreview;