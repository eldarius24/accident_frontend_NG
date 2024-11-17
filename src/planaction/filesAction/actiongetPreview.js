import axios from 'axios';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as XLSX from 'xlsx';

const getPreview = async (fileId, fileName) => {
  try {
    const response = await axios.get(`http://localhost:3100/api/getFileAction/${fileId}`, {
      responseType: 'blob',
    });

    const fileBlob = response.data;
    const fileType = fileName.split('.').pop().toLowerCase();

    switch (fileType) {
      case 'xlsx':
      case 'xls':
      case 'csv': {
        const arrayBuffer = await fileBlob.arrayBuffer();
        let workbook;

        if (fileType === 'csv') {
          const text = await fileBlob.text();
          workbook = XLSX.read(text, { type: 'string' });
        } else {
          workbook = XLSX.read(arrayBuffer, { type: 'array' });
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Generate thumbnail (first few lines)
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const previewRange = {
          s: { r: range.s.r, c: range.s.c },
          e: { r: Math.min(range.s.r + 5, range.e.r), c: Math.min(range.s.c + 4, range.e.c) } // Limit columns for better preview
        };

        // Create temporary worksheet for preview
        const previewData = [];
        for (let r = previewRange.s.r; r <= previewRange.e.r; r++) {
          const row = [];
          for (let c = previewRange.s.c; c <= previewRange.e.c; c++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
            row.push(cell ? cell.v : undefined);
          }
          previewData.push(row);
        }

        const previewSheet = XLSX.utils.aoa_to_sheet(previewData);
        const previewHtml = XLSX.utils.sheet_to_html(previewSheet, {
          editable: false,
          header: `
              <style>
                table { 
                  border-collapse: collapse; 
                  width: 100%;
                  font-family: Arial, sans-serif;
                  font-size: 12px;
                  margin-bottom: 10px;
                }
                th, td { 
                  border: 1px solid #ddd; 
                  padding: 6px;
                  text-align: left;
                  max-width: 150px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                th {
                  background-color: #f5f5f5;
                  font-weight: bold;
                }
                tr:nth-child(even) { 
                  background-color: #f9f9f9; 
                }
                tr:hover {
                  background-color: #f0f0f0;
                }
                .preview-note {
                  color: #666;
                  font-style: italic;
                  font-size: 11px;
                  margin-top: 5px;
                }
              </style>
            `
        });

        const hasMoreData = range.e.r > previewRange.e.r || range.e.c > previewRange.e.c;
        const previewNote = hasMoreData ?
          '<div class="preview-note">Preview showing first 6 rows and 5 columns...</div>' : '';

        return {
          type: fileType,
          preview: previewHtml + previewNote
        };
      }

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
          preview: result.value.substring(0, 200) + '...'
        }

      case 'txt':
        const text = await fileBlob.text();

        return {
          type: 'txt',
          preview: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
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
