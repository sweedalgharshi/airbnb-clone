import { useParams } from "react-router-dom";

function BookingPage() {
  const { id } = useParams();
  return <div>Single booking place {id}</div>;
}
export default BookingPage;
