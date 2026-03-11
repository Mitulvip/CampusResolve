import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShieldAlert, Users, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Student Portal", icon: Users },
    { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight" style={{ fontFamily: 'var(--font-display)' }}>CampusVoice</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Complaint System</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`
                      relative px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      flex items-center gap-2
                      ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary hover:bg-muted/50"}
                    `}
                  >
                    <Icon className="w-4 h-4 hidden sm:block" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-muted -z-10 rounded-lg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-background/50">
        <p>© {new Date().getFullYear()} CampusVoice Management System.</p>
      </footer>
    </div>
  );
}
