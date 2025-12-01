import { Button } from "@/components/ui/button";
import { Activity, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardHeaderProps {
  isLive: boolean;
}

export const DashboardHeader = ({ isLive }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        toast.error("Failed to logout, redirecting to login page.");
      } else {
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast.error("Failed to logout, redirecting to login page.");
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">7colorbow</h2>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-xs sm:text-sm text-muted-foreground">Admin Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Contact Submissions
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Monitor and manage your contact form submissions in real-time
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {isLive && (
          <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-success/10 border border-success/20 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-xs font-medium text-success">Live Update</span>
          </div>
        )}
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Activity className="h-3 sm:h-4 w-3 sm:w-4 text-primary" />
          <span className="text-xs font-medium text-primary hidden sm:inline">Real-time Sync</span>
          <span className="text-xs font-medium text-primary sm:hidden">Live</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </div>
  );
};