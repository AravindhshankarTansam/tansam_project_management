// SidebarConfig.js
export const SIDEBAR_MENU = {
  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Create Users", path: "/admin/users" },
  { label: "Project", path: "/admin/project" },
    {
      label: "Master Table",
      children: [
        { label: "Create Roles", path: "/admin/roles" },
        { label: "Create Labs", path: "/admin/labs" },
        { label: "Project Types", path: "/admin/project-types" },
        { label: "Work Categories", path: "/admin/work-categories" },
        { label: "Reports", path: "/admin/reports" },
      ],
    },
  ],

  coordinator: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Leads", path: "/dashboard/leads" },
    { label: "Opportunities", path: "/dashboard/opportunities" },
  ],

  tl: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Leads", path: "/dashboard/leads" },
    { label: "Projects", path: "/dashboard/projects" },
    { label: "Team Review", path: "/dashboard/team-review" },
  ],

  finance: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Quotations", path: "/dashboard/quotations" },
    { label: "Approvals", path: "/dashboard/approvals" },
    { label: "Reports", path: "/dashboard/reports" },
  ],

  ceo: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Reports", path: "/dashboard/reports" },
    { label: "Financial Overview", path: "/dashboard/finance" },
    { label: "Users", path: "/dashboard/users" },
  ],
};
