import Dashboard from '../views/Dashboard/Dashboard';
import EventForm from '../components/Forms/EventForm';
import UserProfile from '../views/UserProfile/UserProfile';
import TableList from '../views/TableList/TableList';
import Typography from '../views/Typography/Typography';
import Icons from '../views/Icons/Icons';
import Maps from '../views/Maps/Maps';
import Notifications from '../views/Notifications/Notifications';
import ManageEvents from '../views/ManageEvents/ManageEvents';
import OrgManager from '../views/OrgManager/OrgManager';
import UserManager from '../views/UserManager/UserManager';
import EventScraper from '../views/Scraper/EventScraper';
import GodMode from '../views/GodMode/GodMode';

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'pe-7s-graph',
    component: Dashboard,
    authLevels: [0, 1],
  },
  {
    path: '/event-add',
    name: 'Add Event',
    icon: 'pe-7s-pen',
    component: EventForm,
    authLevels: [0, 1, 2],
  },
  {
    path: '/manage-events',
    name: 'Manage Events',
    icon: 'pe-7s-hammer',
    component: ManageEvents,
    authLevels: [0, 1],
  },
  {
    path: '/orgs',
    name: 'Org Management',
    icon: 'pe-7s-users',
    component: OrgManager,
    authLevels: [0, 1],
  },
  {
    path: '/manage-users',
    name: 'Manage Admin Users',
    icon: 'pe-7s-user',
    component: UserManager,
    authLevels: [0, 1],
  },
  {
    path: '/scraper',
    name: 'Web Scraper',
    icon: 'pe-7s-science',
    component: EventScraper,
    authLevels: [0, 1],

  },
  {
    path: '/god',
    name: 'God Mode',
    icon: 'pe-7s-gleam',
    component: GodMode,
    authLevels: [0, 1],
  },
  {
    path: '/feedback',
    name: 'Read Feedback',
    icon: 'pe-7s-comment',
    component: Dashboard,
    authLevels: [0],
  },
  {
    path: '/user',
    name: 'User Profile',
    icon: 'pe-7s-user',
    component: UserProfile,
    authLevels: [0],
  },
  {
    path: '/table',
    name: 'Table List',
    icon: 'pe-7s-note2',
    component: TableList,
    authLevels: [0],
  },
  {
    path: '/typography',
    name: 'Typography',
    icon: 'pe-7s-news-paper',
    component: Typography,
    authLevels: [0],
  },
  {
    path: '/icons',
    name: 'Icons',
    icon: 'pe-7s-science',
    component: Icons,
    authLevels: [0],
  },
  {
    path: '/maps',
    name: 'Maps',
    icon: 'pe-7s-map-marker',
    component: Maps,
    authLevels: [0],
  },
  {
    path: '/notifications',
    name: 'Notifications',
    icon: 'pe-7s-bell',
    component: Notifications,
    authLevels: [0],
  },
  {
    redirect: true,
    path: '/',
    to: '/dashboard',
    name: 'Dashboard',
    authLevels: [0],
  },
];

export default dashboardRoutes;
