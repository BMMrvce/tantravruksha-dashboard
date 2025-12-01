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
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold text-foreground">7colorbow</h2>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">Admin Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Contact Submissions
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your contact form submissions in real-time
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-xs font-medium text-success">Live Update</span>
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">Real-time Sync</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};