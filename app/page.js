import SmoothScroll from "../components/SmoothScroll";
import Reader from "./reader";

export const metadata = {
  title: { absolute: "shycodelix — esports operations, production and content" },
  description:
    "Esports operations, production and content: nine years of customer-facing leadership, a Dota 2 squad through The International, and Avante Esports. Verified record, selected work and contact.",
};

export default function Home() {
  return (
    <SmoothScroll>
      <Reader />
    </SmoothScroll>
  );
}
