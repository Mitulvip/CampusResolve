import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { differenceInDays } from "date-fns";
import { insertComplaintSchema } from "@shared/schema";
import { useComplaints, useCreateComplaint } from "@/hooks/use-complaints";
import { Layout } from "@/components/Layout";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PlusCircle, Inbox } from "lucide-react";

// Client-side schema to match the server
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

function calculatePriority(complaint: any): number {
  const createdDate = new Date(complaint.createdAt);
  const daysOld = differenceInDays(new Date(), createdDate);
  const agingFactor = daysOld / 2;
  return complaint.votes + agingFactor;
}

export default function StudentPortal() {
  const { data: complaints, isLoading } = useComplaints();
  const createMutation = useCreateComplaint();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  const sortedComplaints = complaints
    ? [...complaints].sort((a, b) => calculatePriority(b) - calculatePriority(a))
    : [];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Portal</h1>
        <p className="text-muted-foreground text-lg">Submit your concerns and track their status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Submission Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>New Complaint</h2>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">Complaint Title</Label>
                <Input 
                  id="title" 
                  placeholder="E.g., Broken AC in Dorm 4" 
                  className="bg-muted/50 border-transparent focus-visible:bg-transparent transition-colors"
                  {...form.register("title")} 
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive font-medium">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="font-semibold">Category</Label>
                <Select 
                  onValueChange={(val) => form.setValue("category", val)}
                  value={form.watch("category")}
                >
                  <SelectTrigger className="bg-muted/50 border-transparent focus:bg-transparent transition-colors">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academics">Academics</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Cafeteria">Cafeteria</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive font-medium">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please provide as much detail as possible..." 
                  className="min-h-[120px] resize-none bg-muted/50 border-transparent focus-visible:bg-transparent transition-colors"
                  {...form.register("description")} 
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive font-medium">{form.formState.errors.description.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold mt-2" 
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column - Recent Complaints */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <Inbox className="w-5 h-5 text-muted-foreground" />
              Recent Submissions
            </h2>
            {complaints && complaints.length > 0 && (
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Total: {complaints.length}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary/40" />
              <p>Loading records...</p>
            </div>
          ) : !complaints || complaints.length === 0 ? (
            <div className="bg-card border border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-bold mb-1">No complaints found</h3>
              <p className="text-muted-foreground max-w-sm">
                There are currently no complaints in the system. When you submit one, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedComplaints.map((complaint, i) => (
                <ComplaintCard 
                  key={complaint.id} 
                  complaint={complaint} 
                  index={i} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
