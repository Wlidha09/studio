import CandidateTable from "@/components/dashboard/candidate-table";
import { getCandidates } from "@/lib/firestore";

export default async function CandidatesPage() {
  const candidates = await getCandidates();
  return (
    <div>
      <CandidateTable initialCandidates={candidates} />
    </div>
  );
}
