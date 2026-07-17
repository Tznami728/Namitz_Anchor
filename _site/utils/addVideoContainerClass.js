function addVideoContainerClass(content) {
  if (typeof content !== "string") {
    return content;
  }

  return content.replace(
    /<iframe\b([^>]*?)src=["']https?:\/\/(?:www\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be)([^>]*?)>/gi,
    (match, before, after) => {
      const hasClass = /\bclass=["'][^"']*\bvideo-container\b/i.test(match);
      if (hasClass) {
        return match;
      }

      const classAttr = /\bclass=["']([^"']*)["']/i.exec(match);
      if (classAttr) {
        const existingClasses = classAttr[1].trim();
        const nextClasses = existingClasses ? `${existingClasses} video-container` : "video-container";
        return match.replace(classAttr[0], `class="${nextClasses}"`);
      }

      return match.replace(/<iframe\b/i, '<iframe class="video-container"');
    }
  );
}

module.exports = {
  addVideoContainerClass,
};
