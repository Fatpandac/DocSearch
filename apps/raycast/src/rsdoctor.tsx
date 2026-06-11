import { SearchDocumentation } from "./components";
import { DocID } from "@docsearch/core";

export default function Command(props: { arguments: { search?: string } }) {
  return <SearchDocumentation id={DocID.Rsdoctor} quickSearch={props.arguments?.search} />;
}
