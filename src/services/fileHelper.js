/**
 * JAGOPORTO — UNIVERSAL FILE & DOWNLOAD UTILITIES
 * Provides robust file handling, Blob URL conversion, and download mechanisms
 */

/**
 * Downloads a file cleanly in any browser.
 * If dataUrl is provided (base64), converts to Blob URL first to prevent
 * browser popup blockers, truncation, or data-URI scheme length limits.
 */
export function downloadFile(fileUrl, defaultFileName = 'Dokumen.pdf') {
  if (!fileUrl) {
    console.warn('[downloadFile] No fileUrl provided');
    return;
  }

  // If it's a base64 Data URL, convert to Blob URL for clean browser download
  if (typeof fileUrl === 'string' && fileUrl.startsWith('data:')) {
    try {
      const parts = fileUrl.split(';base64,');
      const contentType = parts[0].replace('data:', '') || 'application/octet-stream';
      const base64Data = parts[1];
      
      const byteCharacters = window.atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = defaultFileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the blob URL after download triggers
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      return;
    } catch (err) {
      console.warn('[downloadFile] Blob conversion fallback:', err);
    }
  }

  // Standard URL download fallback
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = defaultFileName;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Reads a File object into a DataURL using Promise.
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
