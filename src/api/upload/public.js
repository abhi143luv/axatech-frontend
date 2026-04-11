import { formRequest } from '../core';

export function upload(file) {
  const fd = new FormData();
  fd.append('file', file);
  return formRequest('/upload', 'POST', fd).then((r) => r.filename || r.url);
}

export function uploadProjectImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  return formRequest('/upload/project-image', 'POST', fd).then((r) => r.filename || r.url);
}

export function uploadTechnologyImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  return formRequest('/upload/technology-image', 'POST', fd).then((r) => r.url || r.filename);
}

