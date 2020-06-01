var Prismic = require('prismic-javascript');

var apiEndpoint = "https://smartphones.cdn.prismic.io/api/v2";
  
module.exports = async function() {
  return await Prismic.getApi(apiEndpoint).then(function(api) {  
    return api.query(
      Prismic.Predicates.at('document.type', 'phone'),
      { orderings : '[my.phone.updated desc]' }
    );
  }).then(function(response) {
    // response is the response object, response.results holds the documents
    // console.log("Document: ", response.results);
    return response.results;
  });
};
