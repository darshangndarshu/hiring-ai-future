
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, FileText, Video, Users, BarChart4, LucideIcon, 
  Fingerprint, Brain, UserPlus, LogOut, LogIn 
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}

const NavItem = ({ href, label, icon: Icon, isActive }: NavItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant={isActive ? "default" : "ghost"}
        className="w-full justify-start"
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { href: "/", label: "Dashboard", icon: BarChart4 },
    { href: "/resume", label: "Resume", icon: FileText },
    { href: "/interview", label: "Interview", icon: Video },
    { href: "/features", label: "Features", icon: Brain },
    { href: "/candidates", label: "Candidates", icon: Users },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-2 pt-4">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={currentPath === item.href}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="ml-2 md:ml-0 flex">
          <Link to="/" className="flex items-center">
            <Fingerprint className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold">HiringAI</span>
          </Link>
          
          <nav className="hidden md:flex ml-10 gap-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={currentPath === item.href ? "secondary" : "ghost"}
                  className="gap-1.5"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Button onClick={() => navigate("/add-candidate")} variant="outline" className="hidden md:flex">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Candidate
              </Button>
              <Button onClick={() => navigate("/post-job")} variant="outline" className="hidden md:flex">
                <FileText className="mr-2 h-4 w-4" />
                Post Job
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")} size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
