let closer;

export const openMenu = (menuCloser) => {
  if (closer && menuCloser !== closer) {
    closer();
  }
  closer = typeof menuCloser === "function" ? menuCloser : null;
};

export const closeMenu = () => {
  if (closer) {
    closer();
  }

  closer = null;
};
