import { SearchDocumentation } from "./components";
import { DocID } from "@docsearch/core";

export default function Command(props: { arguments: { search?: string } }) {
  return <SearchDocumentation id={DocID.Nuxt} quickSearch={props.arguments?.search} />;
}
