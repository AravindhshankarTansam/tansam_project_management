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
    { label: "Dashboard", path: "/coordinator" },
    { label: "New Opportunities", path: "/coordinator/opportunities" },
    { label: "Opportunities-Tacker", path: "/coordinator/Opportunities-tacker" },
  ],

  tl: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Leads", path: "/dashboard/leads" },
    { label: "Projects", path: "/dashboard/projects" },
    { label: "Team Review", path: "/dashboard/team-review" },
  ],

  finance: [
    { label: "Dashboard", path: "/finance/dashboard" },
    { label: "Quotations", path: "/finance/quotations" },
    { label: "Quotation Follow-up", path: "/finance/quotation-followup" },
    { label: "Reports", path: "/finance/reports" },
  ],


  ceo: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Reports", path: "/dashboard/reports" },
    { label: "Financial Overview", path: "/dashboard/finance" },
    { label: "Users", path: "/dashboard/users" },
  ],
};
