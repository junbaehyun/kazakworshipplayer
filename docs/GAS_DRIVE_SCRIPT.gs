/**
 * ============================================================================
 * KAZAKH WORSHIP PLAYER — GOOGLE APPS SCRIPT (GAS) + GOOGLE DRIVE STORAGE
 * ============================================================================
 * 100% Free ($0) — Uses your 15 GB Google Drive with NO billing account needed.
 *
 * HOW TO DEPLOY (2 minutes):
 * 1. Go to https://script.google.com and click "New project".
 * 2. Paste this entire file into Code.gs (replace everything).
 * 3. Click "Deploy" -> "New deployment" -> Type: "Web app".
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 4. Click "Deploy", authorize Google Drive access, and copy the Web App URL.
 * 5. Add it to your .env / Vercel Environment Variables as:
 *    VITE_GAS_WEBAPP_URL=https://script.google.com/macros/s/YOUR_ID/exec
 * ============================================================================
 */

const FOLDER_NAME = 'KazakhWorshipAudio';
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB safety cap per upload

function getOrCreateFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(FOLDER_NAME);
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Upload an audio file from the Web App (expects text/plain JSON body to avoid CORS preflight).
 * Body: { fileName: string, mimeType: string, base64Data: string }
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const fileName = String(payload.fileName || ('worship-' + Date.now() + '.mp3')).replace(/[^\w.\-() ]+/g, '_');
    const mimeType = String(payload.mimeType || 'audio/mpeg');
    const base64Data = String(payload.base64Data || '');

    if (!mimeType.startsWith('audio/')) {
      return jsonResponse_({ ok: false, error: 'Only audio files are allowed.' });
    }

    const bytes = Utilities.base64Decode(base64Data);
    if (bytes.length > MAX_BYTES) {
      return jsonResponse_({ ok: false, error: 'File exceeds 20 MB limit.' });
    }

    const folder = getOrCreateFolder_();
    const blob = Utilities.newBlob(bytes, mimeType, fileName);
    const file = folder.createFile(blob);

    return jsonResponse_({
      ok: true,
      fileId: file.getId(),
      fileName: file.getName(),
      size: bytes.length
    });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/**
 * One-time download endpoint for the Web App to cache into browser IndexedDB.
 * GET ?fileId=GOOGLE_DRIVE_FILE_ID
 */
function doGet(e) {
  try {
    const fileId = e.parameter && e.parameter.fileId;
    if (!fileId) {
      return jsonResponse_({ ok: true, status: 'Kazakh Worship GAS Audio Bridge Ready' });
    }

    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    const bytes = blob.getBytes();
    const base64Data = Utilities.base64Encode(bytes);

    return jsonResponse_({
      ok: true,
      fileId: fileId,
      mimeType: blob.getContentType() || 'audio/mpeg',
      base64Data: base64Data
    });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
