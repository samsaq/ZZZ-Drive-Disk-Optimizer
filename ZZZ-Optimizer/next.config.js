/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    logger: {
      api: "modern",
    },
    silenceDeprecations: ["legacy-js-api"],
  },
};

module.exports = nextConfig;
