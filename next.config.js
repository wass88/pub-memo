const withOptimizedImages = require("next-optimized-images");

module.exports = withOptimizedImages({
  webpack5: true,
  trailingSlash: true,
  staticPageGenerationTimeout: 600,
  handleImages: ["svg", "jpeg", "png"],
  images: {
    disableStaticImages: true,
    domains: ["s3.us-west-2.amazonaws.com"],
  },
  imageTrace: {
    color: "rgba(1,1,1,0.8)",
  },
});
