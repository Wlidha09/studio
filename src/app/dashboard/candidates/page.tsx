import CandidateTable from "@/components/dashboard/candidate-table";
import { candidates } from "@/lib/data";

export default function CandidatesPage() {
  return (
    <div>
      <CandidateTable initialCandidates={candidates} />
    </div>
  );
}
