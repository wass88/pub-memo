const withOptimizedImages = require("next-optimized-images");

module.exports = withOptimizedImages({
  webpack5: true,
  trailingSlash: true,
  handleImages: ["svg", "jpeg", "png"],
});
