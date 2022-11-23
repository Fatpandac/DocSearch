import { SearchDocumentation } from "./components";

export default function Command(props: { arguments: { search?: string } }) {
  return <SearchDocumentation docsName="Flet" quickSearch={props.arguments?.search} />;
}
