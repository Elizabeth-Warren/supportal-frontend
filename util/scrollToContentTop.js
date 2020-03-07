const scrollToContentTop = (id = 'content') => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth' });
};

export default scrollToContentTop;
