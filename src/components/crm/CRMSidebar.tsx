import { LayoutDashboard, Users, UserCheck, Store, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/crm", icon: LayoutDashboard },
  { title: "Leads", url: "/crm/leads", icon: Users },
  { title: "Hosts Ativos", url: "/crm/hosts", icon: UserCheck },
  { title: "Lojistas", url: "/crm/lojistas", icon: Store },
  { title: "Configurações", url: "/crm/settings", icon: Settings },
];

interface CRMSidebarProps {
  onLogout: () => void;
}

export function CRMSidebar({ onLogout }: CRMSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <img src={logo} alt="Logo" className="h-8 w-8 object-contain flex-shrink-0" />
          {!collapsed && (
            <div>
              <h2 className="text-sm font-serif font-bold text-foreground leading-none">Sócio do Tabuleiro</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">CRM Interno</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url === "/crm" && location.pathname === "/crm");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/crm"}
                        className={`hover:bg-sidebar-accent/50 transition-colors ${isActive ? "bg-sidebar-accent text-crm-purple font-medium" : ""}`}
                        activeClassName="bg-sidebar-accent text-crm-purple font-medium"
                      >
                        <item.icon className={`mr-2 h-4 w-4 ${isActive ? "text-crm-purple" : ""}`} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={onLogout}
          className="w-full text-muted-foreground hover:text-destructive justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
