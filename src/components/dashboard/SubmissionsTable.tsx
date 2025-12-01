import { useState } from "react";
import { format } from "date-fns";
import { Check, Mail, Phone, Calendar, MessageSquare, Search } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ContactSubmission = Tables<"contact_submissions">;

interface SubmissionsTableProps {
  submissions: ContactSubmission[];
  onUpdate: () => void;
}

export const SubmissionsTable = ({ submissions, onUpdate }: SubmissionsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleMarkAsHandled = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ handled: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(currentStatus ? "Marked as unhandled" : "Marked as handled");
      onUpdate();
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("Failed to update submission");
    }
  };

  const filteredSubmissions = submissions.filter(
    (sub) =>
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[120px]">Name</TableHead>
              <TableHead className="min-w-[200px]">Contact</TableHead>
              <TableHead className="min-w-[250px]">Message</TableHead>
              <TableHead className="min-w-[120px]">Date</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="text-right min-w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{submission.name || "—"}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {submission.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{submission.email}</span>
                        </div>
                      )}
                      {submission.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{submission.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 max-w-xs">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {submission.message || "—"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(submission.created_at), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={submission.handled ? "default" : "secondary"}
                      className={
                        submission.handled
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : "bg-warning/10 text-warning hover:bg-warning/20"
                      }
                    >
                      {submission.handled ? "Handled" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsHandled(submission.id, submission.handled)}
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      {submission.handled ? "Unmark" : "Mark Done"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};