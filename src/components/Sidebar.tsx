import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  BarChart3,
  Package,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
  onMenuClick?: (menuId: string) => void;
  activeMenu?: string;
}

const menuItems = [
  { icon: Home, label: "Dashboard", id: "dashboard", path: "/dashboard" },
  { icon: BarChart3, label: "Transaksi", id: "transaksi", path: "/transaksi" },
  { icon: Package, label: "Product", id: "product", path: "/product" },
  { icon: Users, label: "User", id: "user", path: "/user" },
];

export function Sidebar({
  isOpen,
  onToggle,
  onLogout,
  onCollapseChange,
  onMenuClick,
  activeMenu,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showText, setShowText] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active menu based on current path
  const getCurrentActiveMenu = () => {
    const path = location.pathname;
    const menuItem = menuItems.find((item) => item.path === path);
    return menuItem?.id || "dashboard";
  };

  const currentActiveMenu = activeMenu || getCurrentActiveMenu();

  // Sinkronisasi showText dengan isCollapsed saat pertama kali dimuat
  useEffect(() => {
    setShowText(!isCollapsed);
  }, []);

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;

    if (newCollapsed) {
      // Ketika menutup: hilangkan teks dulu, lalu tutup sidebar
      setShowText(false);
      setTimeout(() => {
        setIsCollapsed(newCollapsed);
        onCollapseChange?.(newCollapsed);
      }, 150); // Delay 150ms untuk menghilangkan teks dulu
    } else {
      // Ketika membuka: buka sidebar dulu, lalu tampilkan teks
      setIsCollapsed(newCollapsed);
      onCollapseChange?.(newCollapsed);
      setTimeout(() => {
        setShowText(true);
      }, 300); // Delay 300ms untuk menunggu sidebar terbuka sempurna
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-full bg-card border-r border-border transition-all duration-500 ease-in-out",
          "lg:relative lg:translate-x-0",
          "fixed left-0 top-0 z-50 lg:z-auto",
          isCollapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <h2
              className={cn(
                "text-lg font-semibold text-foreground transition-opacity duration-200 ease-in-out",
                showText ? "opacity-100" : "opacity-0"
              )}
            >
              Top Up Games
            </h2>
          )}
          <div className="flex items-center gap-2">
            {/* Desktop collapse toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="hidden lg:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full hover:bg-accent hover:text-accent-foreground",
                      isCollapsed
                        ? "justify-center px-2"
                        : "justify-start text-left",
                      currentActiveMenu === item.id &&
                        "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      navigate(item.path);
                      onMenuClick?.(item.id);
                    }}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-all duration-300 ease-in-out",
                        !isCollapsed && "mr-3"
                      )}
                    />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "transition-opacity duration-200 ease-in-out",
                          showText ? "opacity-100" : "opacity-0"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
              isCollapsed ? "justify-center px-2" : "justify-start text-left"
            )}
            onClick={onLogout}
            title={isCollapsed ? "Keluar" : undefined}
          >
            <LogOut
              className={cn(
                "h-4 w-4 transition-all duration-300 ease-in-out",
                !isCollapsed && "mr-3"
              )}
            />
            {!isCollapsed && (
              <span
                className={cn(
                  "transition-opacity duration-200 ease-in-out",
                  showText ? "opacity-100" : "opacity-0"
                )}
              >
                Keluar
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden bg-card border border-border"
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}
