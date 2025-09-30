import { SearchDocumentation } from "./components";
import { DocID } from "./data/types";

export default function Command(props: { arguments: { search?: string } }) {
  return <SearchDocumentation id={DocID.Flet} quickSearch={props.arguments?.search} />;
}
