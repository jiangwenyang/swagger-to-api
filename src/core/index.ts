import fetchDocs from './fetch-doc';
import serializeDoc from './serialize-doc';
import { Config, Docs } from './types';

async function getDocs(config: Config): Promise<Docs | undefined> {
  const docs = await fetchDocs(config);

  return docs && serializeDoc(docs);
}

export default getDocs;
