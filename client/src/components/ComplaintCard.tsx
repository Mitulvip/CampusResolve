import { format } from "date-fns";
import { CheckCircle2, Clock, MapPin, Lightbulb, BookOpen, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useResolveComplaint } from "@/hooks/use-complaints";
import { motion } from "framer-motion";

type Complaint = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string | Date;
};

interface ComplaintCardProps {
  complaint: Complaint;
  isAdmin?: boolean;
  index?: number;
}

export function ComplaintCard({ complaint, isAdmin = false, index = 0 }: ComplaintCardProps) {
  const resolveMutation = useResolveComplaint();
  const isResolved = complaint.status === "resolved";

  const handleResolve = () => {
    resolveMutation.mutate(complaint.id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "academics": return <BookOpen className="w-3 h-3 mr-1" />;
      case "facilities": return <MapPin className="w-3 h-3 mr-1" />;
      case "housing": return <Lightbulb className="w-3 h-3 mr-1" />;
      default: return <MoreHorizontal className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted font-medium">
              {getCategoryIcon(complaint.category)}
              {complaint.category}
            </Badge>
            {isResolved ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Resolved
              </Badge>
            ) : (
              <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {complaint.title}
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            Submitted on {format(new Date(complaint.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        
        {isAdmin && !isResolved && (
          <Button 
            onClick={handleResolve}
            disabled={resolveMutation.isPending}
            className="w-full sm:w-auto shrink-0 transition-transform active:scale-95"
            size="sm"
          >
            {resolveMutation.isPending ? "Updating..." : "Mark Resolved"}
          </Button>
        )}
      </div>

      <div className="prose prose-sm max-w-none text-muted-foreground mt-4 line-clamp-4 leading-relaxed">
        <p>{complaint.description}</p>
      </div>
    </motion.div>
  );
}
