document.addEventListener('DOMContentLoaded', function () {
  const link = document.getElementById('load-comments-link');
  const container = document.getElementById('comments-container');

  if (!link || !container) return;

  link.addEventListener('click', function (event) {
    event.preventDefault();

    if (container.dataset.loaded === 'true') return;

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'Tznami728/Namitz_Anchor');
    script.setAttribute('issue-term', 'title');
    script.setAttribute('theme', 'boxy-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    script.defer = true;

    container.appendChild(script);
    container.dataset.loaded = 'true';
    link.textContent = '留言區已載入';
    link.setAttribute('aria-disabled', 'true');
    link.style.pointerEvents = 'none';
  });
});
