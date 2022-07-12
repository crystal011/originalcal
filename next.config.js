// https://www.npmjs.com/package/next-transpile-modules
// This makes our @calcom/prisma package from the monorepo to be transpiled and usable by API
const withTM = require("next-transpile-modules")([
  "@calcom/app-store",
  "@calcom/core",
  "@calcom/ee",
  "@calcom/lib",
  "@calcom/prisma",
  "@calcom/stripe",
  "@calcom/ui",
  "@calcom/dayjs",
  "@calcom/emails",
  "@calcom/dayjs",
  "@calcom/embed-core",
  "@calcom/dayjs",
  "@calcom/embed-snippet",
]);
const { withAxiom } = require("next-axiom");

module.exports = withAxiom(
  withTM({
    async rewrites() {
      return {
        afterFiles: [
          // This redirects requests recieved at / the root to the /api/ folder.
          {
            source: "/v:version/:rest*",
            destination: "/api/v:version/:rest*",
          },
          // This redirects requests to api/v*/ to /api/ passing version as a query parameter.
          {
            source: "/api/v:version/:rest*",
            destination: "/api/:rest*?version=:version",
          },
        ],
        fallback: [
          // These rewrites are checked after both pages/public files
          // and dynamic routes are checked
          {
            source: "/:path*",
            destination: `/api/:path*`,
          },
        ],
      };
    },
  })
);
