import fetchDocs from "./fetch";
import serialize from "./serialize";
import generater from "./generater";
import * as templates from "./templates";

// const swaggerDocs = await fetchDocs(
//   "http://36.110.103.178:28172/user/v2/api-docs"
// );
// const docs = swaggerDocs && serialize(swaggerDocs);

// docs && console.log(docs.serializedPaths[0]);
// const result = docs && (await generater([docs.serializedPaths[0]]));

export { fetchDocs, serialize, generater, templates };
