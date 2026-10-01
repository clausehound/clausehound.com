const { execFileSync } = require("node:child_process");
const { HtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // PATH_PREFIX serves the site from a subpath, e.g. "/clausehound.com/" on
  // the shared preview app. HtmlBasePlugin rewrites root-relative href/src in
  // the HTML to match; the CSS uses relative URLs so it needs nothing.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // static/ is served from the site root, verbatim: /legacy/**, /dealprep/**,
  // /ads.txt, /terms.pdf and /moonclerk.js, kept from the Gatsby site.
  eleventyConfig.addPassthroughCopy({ static: "." });
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");

  // Build the client-side TS bundle after every Eleventy build, so `--serve`
  // rebuilds it too.
  eleventyConfig.on("eleventy.after", () => {
    execFileSync("npm", ["run", "build:js"], { stdio: "inherit" });
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["html"],
  };
};
