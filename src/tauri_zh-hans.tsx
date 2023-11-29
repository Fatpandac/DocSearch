import { SearchDocumentation } from "./components";

export default function Command(props: { arguments: { search?: string } }) {
  return <SearchDocumentation id="aeb7f78e-c775-47af-96ff-24704b4a8817" quickSearch={props.arguments?.search} />;
}
