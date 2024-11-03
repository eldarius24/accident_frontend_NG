import axios from 'axios';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/webpack';

const getPreview = async (fileId, fileName) => {
  try {
    const response = await axios.get(`http://localhost:3100/api/getFileAction/${fileId}`, {
      responseType: 'blob',
    });

    const fileBlob = response.data;

    const fileType = fileName.split('.').pop().toLowerCase();

    switch (fileType) {
      case 'pdf':
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(fileBlob)).promise;
        const page = await pdf.getPage(1);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        return {
          type: 'pdf',
          url: canvas.toDataURL(),
        };

      case 'docx':
        const arrayBuffer = await fileBlob.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });

        return {
          type: 'docx',
          text: result.value.substring(0, 200) + '...',
        };

      case 'txt':
        const text = await fileBlob.text();

        return {
          type: 'txt',
          text: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
        };

      default:
        return {
          type: 'image',
          url: URL.createObjectURL(fileBlob),
        };
    }
  } catch (error) {
    return null;
  }
};

export default getPreview;
