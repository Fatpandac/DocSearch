import { SearchDocumentation } from "./components";

export default function Command(props: { arguments: { search?: string } }) {
  return <SearchDocumentation id="4ff567b2-3499-487b-a3c8-e3444c34b5d0" quickSearch={props.arguments?.search} />;
}
