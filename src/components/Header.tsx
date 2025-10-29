import { User, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDark(theme === "dark");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const tabs = [
    { name: "Chat", path: "/" },
    { name: "Performance Metrics", path: "/metrics" },
    { name: "Documents", path: "/documents" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <header className="glass-panel border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Private RAG Knowledge Assistant
          </h1>

          <nav className="hidden md:flex items-center gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.path}
                variant={location.pathname === tab.path ? "default" : "ghost"}
                onClick={() => navigate(tab.path)}
                className="font-medium"
              >
                {tab.name}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-panel">
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-2 mt-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.path}
              variant={location.pathname === tab.path ? "default" : "ghost"}
              onClick={() => navigate(tab.path)}
              className="font-medium whitespace-nowrap"
              size="sm"
            >
              {tab.name}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
