const { execFileSync } = require("node:child_process");

module.exports = function (eleventyConfig) {
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
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["html"],
  };
};
