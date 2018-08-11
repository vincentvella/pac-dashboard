import Dashboard from "../views/Dashboard/Dashboard";
import AddEvent from "../views/AddEvent/AddEvent";
import UserProfile from "../views/UserProfile/UserProfile";
import TableList from "../views/TableList/TableList";
import Typography from "../views/Typography/Typography";
import Icons from "../views/Icons/Icons";
import Maps from "../views/Maps/Maps";
import Notifications from "../views/Notifications/Notifications";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: "/event-add",
    name: "Add Event",
    icon: "pe-7s-pen",
    component: AddEvent,
  },
  {
    path: "/manage-events",
    name: "Manage Events",
    icon: "pe-7s-hammer",
    component: Dashboard,
  },
  {
    path: "/manage-users",
    name: "Manage Admin Users",
    icon: "pe-7s-user",
    component: Dashboard,
  },
  {
    path: "/scraped-data",
    name: "Web Scraper",
    icon: "pe-7s-science",
    component: Dashboard,
  },
  {
    path: "/orgs",
    name: "Org Management",
    icon: "pe-7s-users",
    component: Dashboard,
  },
  {
    path: "/god",
    name: "God Mode",
    icon: "pe-7s-gleam",
    component: Dashboard,
  },
  {
    path: "/feedback",
    name: "Read Feedback",
    icon: "pe-7s-comment",
    component: Dashboard,
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "pe-7s-user",
    component: UserProfile
  },
  {
    path: "/table",
    name: "Table List",
    icon: "pe-7s-note2",
    component: TableList
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "pe-7s-news-paper",
    component: Typography
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "pe-7s-science",
    component: Icons
  },
  { path: "/maps",
    name: "Maps",
    icon: "pe-7s-map-marker",
    component: Maps
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications
  },
  {
    redirect: true,
    path: "/",
    to: "/dashboard",
    name: "Dashboard"
  }
];

export default dashboardRoutes;
