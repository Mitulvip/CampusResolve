import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export function useComplaints() {
  return useQuery({
    queryKey: [api.complaints.list.path],
    queryFn: async () => {
      const res = await fetch(api.complaints.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      return api.complaints.list.responses[200].parse(data);
    },
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.complaints.create.input>) => {
      const res = await fetch(api.complaints.create.path, {
        method: api.complaints.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create complaint");
      }

      return api.complaints.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.complaints.list.path] });
      toast({
        title: "Complaint submitted",
        description: "Your complaint has been successfully recorded.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useResolveComplaint() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.complaints.resolve.path, { id });
      const res = await fetch(url, {
        method: api.complaints.resolve.method,
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Complaint not found");
        throw new Error("Failed to resolve complaint");
      }

      return api.complaints.resolve.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.complaints.list.path] });
      toast({
        title: "Complaint resolved",
        description: "The complaint status has been updated to resolved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
