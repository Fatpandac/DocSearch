import { SearchDocumentation } from "./components";

export default function Command(props: { arguments: { search?: string } }) {
  return <SearchDocumentation id="6201fb75-ed3f-4c01-b8a3-6e7d7160f898" quickSearch={props.arguments?.search} />;
}
