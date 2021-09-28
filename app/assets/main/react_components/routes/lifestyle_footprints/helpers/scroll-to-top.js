const scrollToTop = () => {
  setTimeout(function () {
    window.scrollTo({
      top: 50,
      left: 0,
      behavior: 'smooth',
    });
  }, 2);
};

export default scrollToTop;
