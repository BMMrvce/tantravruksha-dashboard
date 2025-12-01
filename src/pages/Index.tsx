import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SubmissionsTable } from "@/components/dashboard/SubmissionsTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { MailOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";

type ContactSubmission = Tables<"contact_submissions">;

const Index = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetchSubmissions();

    // Set up realtime subscription
    const channel = supabase
      .channel("contact-submissions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_submissions",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          setIsLive(true);
          setTimeout(() => setIsLive(false), 2000);
          
          if (payload.eventType === "INSERT") {
            toast.success("New submission received!");
          }
          
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const stats = {
    total: submissions.length,
    handled: submissions.filter((s) => s.handled).length,
    unhandled: submissions.filter((s) => s.handled === false).length,
    today: submissions.filter(
      (s) =>
        new Date(s.created_at).toDateString() === new Date().toDateString()
    ).length,
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
          <DashboardHeader isLive={isLive} />

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-card border border-border animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StatsCard
              title="Total Submissions"
              value={stats.total}
              icon={MailOpen}
              color="primary"
            />
            <StatsCard
              title="Handled"
              value={stats.handled}
              icon={CheckCircle2}
              color="success"
            />
            <StatsCard
              title="Pending"
              value={stats.unhandled}
              icon={Clock}
              color="warning"
            />
            <StatsCard
              title="Today"
              value={stats.today}
              icon={TrendingUp}
              color="primary"
            />
          </div>
        )}

          {/* Submissions Table */}
          {loading ? (
            <div className="h-96 rounded-xl bg-card border border-border animate-pulse" />
          ) : (
            <div className="bg-card rounded-xl border border-border p-3 sm:p-4 md:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 text-foreground">
                All Submissions
              </h2>
              <SubmissionsTable
                submissions={submissions}
                onUpdate={fetchSubmissions}
              />
            </div>
          )}
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default Index;