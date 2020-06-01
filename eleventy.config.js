const htmlmin = require("html-minifier")
var Prismic = require('prismic-javascript');

var apiEndpoint = "https://smartphones.cdn.prismic.io/api/v2";

// Initialize the prismic.io api
function initApi() {
  return Prismic.getApi(apiEndpoint);
}


module.exports = eleventyConfig => {

  // Add a readable date formatter filter to Nunjucks
  eleventyConfig.addFilter("dateDisplay", require("./filters/dates.js"))

  // Add a HTML timestamp formatter filter to Nunjucks
  eleventyConfig.addFilter("htmlDateDisplay", require("./filters/timestamp.js"))

  // Minify our HTML
  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })
      return minified
    }
    return content
  })

  // Collections
  // Get Prismic data
  eleventyConfig.addCollection("androidLatest", async function (collection) {

    return await initApi().then(function(api) {
      return api.query([
        Prismic.Predicates.at('document.type', 'phone'),
        Prismic.Predicates.at('my.phone.os_versions.ver_name', 'XtTq3RIAACEAecxL')],
        { pageSize: 3, orderings: '[my.phone.year desc, my.phone.os_versions.updated]' }
      );
    }).then(function (response) {
      // response is the response object, response.results holds the documents
      // console.log("Prismic data: ", response.results);
      return response.results;
    });

  })


  eleventyConfig.addCollection("androidPhones", async function (collection) {

    return await initApi().then(function(api) {
      return api.query([
        Prismic.Predicates.at('document.type', 'phone'),
        Prismic.Predicates.at('my.phone.os_versions.ver_name', 'XtTqvhIAACIAecu5')],
        { pageSize: 3, orderings: '[my.phone.os_versions.updated, my.phone.year desc]' }
      );
    }).then(function (response) {
      // response is the response object, response.results holds the documents
      return response.results;
    });

  })


  eleventyConfig.addCollection("androidLongest", async function (collection) {

    return await initApi().then(function(api) {
      return api.query([
        Prismic.Predicates.at('document.type', 'phone'),
        Prismic.Predicates.at('my.phone.os_versions.ver_name', 'XtTqvhIAACIAecu5')],
        { pageSize: 2, orderings: '[my.phone.year]' }
      );
    }).then(function (response) {
      // response is the response object, response.results holds the documents
      return response.results;
    });

  })


  eleventyConfig.addCollection("iOSlongest", async function (collection) {

    return await initApi().then(function(api) {
      return api.query([
        Prismic.Predicates.at('document.type', 'phone'),
        Prismic.Predicates.at('my.phone.os_versions.ver_name', 'XtTqzBIAAPZqecv1')],
        { pageSize: 1, orderings: '[my.phone.year]' }
      );
    }).then(function (response) {
      // response is the response object, response.results holds the documents
      return response.results;
    });

  })

  // Layout aliases
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk')
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')

  // Include our static assets
  eleventyConfig.addPassthroughCopy("css")
  eleventyConfig.addPassthroughCopy("js")
  eleventyConfig.addPassthroughCopy("images")
  eleventyConfig.addPassthroughCopy("robots.txt")

  return {
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,

    dir: {
      input: 'site',
      output: 'dist',
      includes: 'includes',
      data: 'globals'
    }
  }

}
