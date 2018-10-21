import Login from '../views/Login/Login';

const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    icon: 'pe-7s-graph',
    component: Login,
  },
  {
    redirect: true,
    path: '/',
    to: '/login',
    name: 'Login',
  },
];

export default authRoutes;
