"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateDescriptionAction } from "./actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: "",
  jobDescription: "",
  errors: undefined
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Description
        </>
      )}
    </Button>
  );
}

export default function JobDescriptionGeneratorPage() {
  const [state, formAction] = useActionState(generateDescriptionAction, initialState);
  const { toast } = useToast();

  const handleCopy = () => {
    if (state.jobDescription) {
        navigator.clipboard.writeText(state.jobDescription);
        toast({ title: "Copied to clipboard!" });
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Job Description Generator</CardTitle>
          <CardDescription>
            Fill in the details below and let our AI create a compelling job description for you.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" placeholder="e.g., Engineering" />
               {state.errors?.department && <p className="text-sm text-destructive">{state.errors.department}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" placeholder="e.g., Senior Frontend Developer" />
               {state.errors?.role && <p className="text-sm text-destructive">{state.errors.role}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsibilities">Key Responsibilities</Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                placeholder="e.g., Develop and maintain user interfaces, collaborate with product managers..."
                rows={5}
              />
               {state.errors?.responsibilities && <p className="text-sm text-destructive">{state.errors.responsibilities}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Generated Description</CardTitle>
                <CardDescription>
                    Review and copy the generated job description.
                </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!state.jobDescription}>
                <Copy className="h-5 w-5"/>
            </Button>
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            value={state.jobDescription || "The generated job description will appear here..."}
            className="h-80 resize-none bg-muted"
          />
        </CardContent>
      </Card>
    </div>
  );
}
