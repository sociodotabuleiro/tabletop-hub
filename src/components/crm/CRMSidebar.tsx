import { LayoutDashboard, Users, UserCheck, Store, Settings, LogOut } from "lucide-react";
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

export type CRMPage = "dashboard" | "leads" | "hosts" | "lojistas" | "settings";

const navItems: { title: string; page: CRMPage; icon: any }[] = [
  { title: "Dashboard", page: "dashboard", icon: LayoutDashboard },
  { title: "Leads", page: "leads", icon: Users },
  { title: "Hosts Ativos", page: "hosts", icon: UserCheck },
  { title: "Lojistas", page: "lojistas", icon: Store },
  { title: "Configurações", page: "settings", icon: Settings },
];

interface CRMSidebarProps {
  onLogout: () => void;
  activePage: CRMPage;
  onNavigate: (page: CRMPage) => void;
}

export function CRMSidebar({ onLogout, activePage, onNavigate }: CRMSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
                const isActive = activePage === item.page;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(item.page)}
                      className={`cursor-pointer transition-colors ${isActive ? "bg-sidebar-accent text-crm-purple font-medium" : "hover:bg-sidebar-accent/50"}`}
                    >
                      <item.icon className={`mr-2 h-4 w-4 ${isActive ? "text-crm-purple" : ""}`} />
                      {!collapsed && <span>{item.title}</span>}
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
