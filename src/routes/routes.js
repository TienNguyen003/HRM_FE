import routesConfig from '../config/routes';

// pages
import Login from '../pages/login/login';
import role from '../component/ingredient/Role/role';
import roleCreate from '../component/ingredient/Role/Create/create';
import user from '../component/ingredient/User/user';
import userCreate from '../component/ingredient/User/Create/create';
import leave from '../component/ingredient/Leave/leave';
import Home from '../pages/home/home';

// public routes
const publicRoutes = [
    { path: routesConfig.home, component: Home },
    { path: routesConfig.login, component: Login },
    { path: routesConfig.role, component: role },
    { path: routesConfig.role, component: roleCreate },
    { path: routesConfig.user, component: user },
    { path: routesConfig.userCreate, component: userCreate },
    { path: routesConfig.leave, component: leave },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
