import { ExternalLink } from "lucide-react";

export const DashboardFooter = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <a
            href="https://tantravruksha.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card hover:bg-accent/10 border-2 border-border hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
              Powered by
            </span>
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              tantravruksha.dev
            </span>
            <ExternalLink className="h-4 w-4 text-foreground/60 group-hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
};