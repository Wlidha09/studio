"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import type { Candidate } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { addCandidate, deleteCandidate, updateCandidate } from "@/lib/firestore";

type Status = "Applied" | "Interviewing" | "Offered" | "Hired" | "Rejected";

const statusColors: Record<Status, string> = {
  Applied: "bg-blue-200 text-blue-800",
  Interviewing: "bg-yellow-200 text-yellow-800",
  Offered: "bg-purple-200 text-purple-800",
  Hired: "bg-green-200 text-green-800",
  Rejected: "bg-red-200 text-red-800",
};

interface CandidateTableProps {
  initialCandidates: Candidate[];
}

export default function CandidateTable({ initialCandidates }: CandidateTableProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteCandidate(id);
      setCandidates(candidates.filter((c) => c.id !== id));
      toast({ title: "Candidate Deleted", description: "The candidate has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete candidate.", variant: "destructive" });
    }
  };
  
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const candidateData = Object.fromEntries(formData.entries()) as Omit<Candidate, 'id' | 'avatar'> & {status: Status};

    if (editingCandidate) {
      const updatedCandidate = { ...editingCandidate, ...candidateData };
      try {
        await updateCandidate(updatedCandidate);
        setCandidates(candidates.map(cand => cand.id === editingCandidate.id ? updatedCandidate : cand));
        toast({ title: "Candidate Updated", description: "Candidate details have been saved." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to update candidate.", variant: "destructive" });
      }
    } else {
      const newCandidateData = {
        ...candidateData,
        avatar: `https://placehold.co/40x40.png?text=${candidateData.name.charAt(0)}`,
      };
      try {
        const newCandidate = await addCandidate(newCandidateData);
        setCandidates([...candidates, newCandidate]);
        toast({ title: "Candidate Added", description: "A new candidate has been added." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add candidate.", variant: "destructive" });
      }
    }
    
    setIsDialogOpen(false);
    setEditingCandidate(null);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setEditingCandidate(null); setIsDialogOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Candidate
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Applied Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://placehold.co/40x40.png?text=${candidate.name.charAt(0)}`} />
                      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {candidate.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{candidate.appliedRole}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[candidate.status]}>{candidate.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(candidate)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(candidate.id)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCandidate ? "Edit Candidate" : "Add Candidate"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={editingCandidate?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={editingCandidate?.email} className="col-span-3" required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="appliedRole" className="text-right">Applied Role</Label>
                <Input id="appliedRole" name="appliedRole" defaultValue={editingCandidate?.appliedRole} className="col-span-3" required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                 <Select name="status" defaultValue={editingCandidate?.status}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interviewing">Interviewing</SelectItem>
                        <SelectItem value="Offered">Offered</SelectItem>
                        <SelectItem value="Hired">Hired</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
