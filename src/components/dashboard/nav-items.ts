import {
  LayoutDashboard,
  Map,
  Droplets,
  Waves,
  Cpu,
  Camera,
  Bell,
  AlertTriangle,
  FileText,
  ClipboardList,
  Users,
  Settings,
  History,
  Factory,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Si no es exacto, se marca activo con cualquier subruta (startsWith). */
  exacto?: boolean;
};

export type NavGroup = {
  titulo: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    titulo: "General",
    items: [
      { href: "/dashboard", label: "Centro de operaciones", icon: LayoutDashboard, exacto: true },
      { href: "/dashboard/mapa", label: "Mapa interactivo", icon: Map },
    ],
  },
  {
    titulo: "Monitoreo",
    items: [
      { href: "/dashboard/calidad-agua", label: "Calidad del agua", icon: Droplets },
      { href: "/dashboard/causas", label: "Causas de contaminación", icon: Factory },
      { href: "/dashboard/humedales", label: "Humedales", icon: Waves },
      { href: "/dashboard/dispositivos", label: "Dispositivos IoT", icon: Cpu },
      { href: "/dashboard/camaras", label: "Cámaras e IA", icon: Camera },
    ],
  },
  {
    titulo: "Gestión pública",
    items: [
      { href: "/dashboard/alertas", label: "Alertas", icon: Bell },
      { href: "/dashboard/incidentes", label: "Incidentes", icon: AlertTriangle },
      { href: "/reportes-ciudadanos", label: "Reportes ciudadanos", icon: ClipboardList },
      { href: "/dashboard/informes", label: "Informes", icon: FileText },
    ],
  },
  {
    titulo: "Administración",
    items: [
      { href: "/dashboard/usuarios", label: "Usuarios", icon: Users },
      { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
      { href: "/dashboard/auditoria", label: "Auditoría", icon: History },
    ],
  },
];

export const TODOS_LOS_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
