import CreatorRoom from "../../components/CreatorRoom";
import "../creator-room.css";

export const metadata = {
  title: "Creator room",
  description:
    "shycodelix's creator room: a desk, a live monitor running the Pixels-3 stream package with the PNGTuber model, a chat rail, lower thirds from the verified record, and a playable aim trainer.",
};

export default function Lab() {
  return <CreatorRoom />;
}
