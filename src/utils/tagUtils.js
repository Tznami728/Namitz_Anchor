function normalizeTags(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => normalizeTags(item))
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,，\s]+/)
      .map((tag) => tag.trim().replace(/^#+/, ''))
      .filter(Boolean);
  }

  return [];
}

function makeTagSlug(tag) {
  return String(tag)
    .trim()
    .replace(/^#+/, '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

module.exports = {
  normalizeTags,
  makeTagSlug,
};
