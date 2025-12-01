import { ExternalLink } from "lucide-react";

export const DashboardFooter = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <a
            href="https://tantravruksha.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 border border-border/50 hover:border-primary/20 transition-all duration-300"
          >
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Powered by
            </span>
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              tantravruksha.dev
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
};