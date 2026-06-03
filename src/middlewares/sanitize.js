import xss from 'xss-clean';

const sanitizer = xss();

export function sanitizeRequest(req, res, next) {
  sanitizer(req, res, next);
}
