const filters = document.querySelectorAll('.filter');
const works = document.querySelectorAll('.archive-work');
const count = document.querySelector('#work-count');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
filters.forEach(filter => filter.addEventListener('click', () => {
  const category = filter.dataset.filter;
  filters.forEach(button => button.classList.toggle('active', button === filter));
  let visible = 0;
  works.forEach(work => { const show = category === 'all' || work.dataset.category === category; work.hidden = !show; if (show) visible += 1; });
  count.textContent = String(visible).padStart(2, '0');
}));
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') === 'true'; menuToggle.setAttribute('aria-expanded', String(!open)); navigation.classList.toggle('open', !open); });
