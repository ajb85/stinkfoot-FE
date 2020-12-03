export default (require) => {
  if (typeof require.context === "undefined") {
    require.context = () => (imageName) => ({
      default: imageName.substring(2), // Cut off './'
    });
  }
  return require;
};
