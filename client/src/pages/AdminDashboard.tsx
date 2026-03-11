import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ComplaintCard } from "@/components/ComplaintCard";
import { useComplaints } from "@/hooks/use-complaints";
import { Loader2, ShieldCheck, FilterX } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { data: complaints, isLoading } = useComplaints();
  const [filter, setFilter] = useState<string>("all");

  const filteredComplaints = complaints?.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const pendingCount = complaints?.filter(c => c.status === "pending").length || 0;
  const resolvedCount = complaints?.filter(c => c.status === "resolved").length || 0;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            Admin Dashboard
            <ShieldCheck className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-muted-foreground text-lg">Manage and resolve student concerns.</p>
        </div>
        
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-3 md:w-[300px] h-11 p-1">
            <TabsTrigger value="all" className="text-sm font-medium h-9">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-sm font-medium h-9">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-sm font-medium h-9">
              Resolved ({resolvedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary/40" />
          <p className="text-lg font-medium">Loading system records...</p>
        </div>
      ) : !filteredComplaints || filteredComplaints.length === 0 ? (
        <div className="bg-card border border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center mt-8">
          <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <FilterX className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No records found</h3>
          <p className="text-muted-foreground text-lg max-w-md">
            {filter === "all" 
              ? "The system is completely clear. No complaints have been submitted yet." 
              : `There are no ${filter} complaints at this time.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredComplaints.map((complaint, i) => (
            <ComplaintCard 
              key={complaint.id} 
              complaint={complaint} 
              isAdmin={true} 
              index={i} 
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
