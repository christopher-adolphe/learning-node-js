/**
 * There are 2 approaches to create relationship between data in mongoose:
 * 1) Using references (i.e Normalization)
 * 2) Using embedded documents (i.e Denormalization)
 * 3) Using hybrid approach
 * 
 * Which approach to choose will depend on the project. We need to do a
 * trade off between query performance vs consistency.
*/

/**
 * When using references (i.e Normalization), we create separate collections
 * to store the document (data) and use the id of the document to establish
 * the relationship between another document.
 * In the example below the course document is related to the author document.
 * We use the id of the author as a reference in the course document to establish
 * the relationship.
 * 
 * The references approach promotes consistency as the documents are stored in
 * separate collection. So if we need to perform an update, we can do so in the
 * collection and the update will be reflected to the related documents.
 * 
 * However with this approach, every time we query for a course, we will need to
 * perform an extra query to get the related author.
*/

let author = {
  _id: '5fb2e29e694d56239a934dc3',
  name: 'John'
};

let course = {
  name: 'Node.js Complete Guide',
  author: '5fb2e29e694d56239a934dc3'
};

/**
 * When using embedded document (i.e Denormalization), we embed a document into another document.
 * In the example below we embed the author document inside the course document to establish
 * the relationship.
 * 
 * With the embedded document approach, we can get both the course and the related author using
 * a single query which means it promotes performance.
 * 
 * However with this approach, if ever we need to perform an update on the author, we will need
 * to do so for every course document related to this author and if an exception occurs during this
 * update operation we might end up having some course documents not updated resulting in inconsistency.
*/

let course = {
  name: 'Node.js Complete Guide',
  author: {
    name: 'John'
  }
};
