import {
  InstantSearch,
  SearchBox,
  Configure,
  Hits,
} from "react-instantsearch-dom";
import typesense from "~/typesense/typesense";

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    nodes: [
      {
        host: "localhost",
        port: 8108,
        protocol: "http",
      },
    ],
    apiKey: "xyz",
  },
  additionalSearchParameters: {
    query_by: "title,designer,tags",
  },
});

export const loader = async () => {
  await typesense();
  return null;
};

export default function App() {
  const Hit = ({ hit }: { hit: any }) => {
    return (
      <div className="flex">
        <div>Designer: {hit.designer}</div>
        <div className="ml-2">Title: {hit.title}</div>
      </div>
    );
  };

  return (
    <div>
      <h1>Search Books</h1>
      <InstantSearch
        indexName="listings"
        searchClient={typesenseInstantsearchAdapter.searchClient}
      >
        <SearchBox autoFocus />
        <Configure hitsPerPage={5} />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
}
