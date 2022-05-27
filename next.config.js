const withOptimizedImages = require("next-optimized-images");

module.exports = withOptimizedImages({
  webpack5: true,
  trailingSlash: true,
  handleImages: ["svg", "jpeg", "png"],
  images: {
    disableStaticImages: true,
  },
  imageTrace: {
    color: "rgba(1,1,1,0.8)",
  },
});
