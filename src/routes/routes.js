import routesConfig from '../config/routes';

// pages
import Home from '../pages/home/home';
import Login from '../pages/login/login';
import role from '../component/ingredient/Role/role';
import roleCreate from '../component/ingredient/Role/Create/create';
import user from '../component/ingredient/User/user';
import userCreate from '../component/ingredient/User/Create/create';
import userRsPass from '../component/ingredient/User/RsPasss/rs-pass';
import userBank from '../component/ingredient/User/Bank/bank';
import userBankCreate from '../component/ingredient/User/Bank/bank_create';
import userContracts from '../component/ingredient/User/Contract/contract';
import userContractsCreate from '../component/ingredient/User/Contract/create';
import leave from '../component/ingredient/Leave/leave';
import leaveCreate from '../component/ingredient/Leave/Create/create';
import leaveApprovals from '../component/ingredient/Leave/Approve/leave';
import leaveHs from '../component/ingredient/Leave/History/leave';
import checks from '../component/ingredient/Timekeepting/checks';
import checkCreate from '../component/ingredient/Timekeepting/create';
import checkApprovals from '../component/ingredient/Timekeepting/approvals';
import checkCalendar from '../component/ingredient/Timekeepting/calendar';
import checkUp from '../component/ingredient/Timekeepting/upload-file';
import advances from '../component/ingredient/Advances/advances';
import advanceCreate from '../component/ingredient/Advances/create';
import advanceApprovals from '../component/ingredient/Advances/approvals';
import salary from '../component/ingredient/Salary/salary_static_value/static_values';
import salaryCreate from '../component/ingredient/Salary/salary_static_value/create';
import salaryCategories from '../component/ingredient/Salary/categories';
import salaryFormulas from '../component/ingredient/Salary/formulas';
import salaryDynamic from '../component/ingredient/Salary/salary_dynamic_values/dynamic_values';
import salaryTable from '../component/ingredient/Salary/tables';
import holidays from '../component/ingredient/Holidays/holidays';
import holidayDayOff from '../component/ingredient/Holidays/day_off_cate';
import offices from '../component/ingredient/Office/offices';
import officeStructures from '../component/ingredient/Office/structures';
import officeSetup from '../component/ingredient/Office/setups';

// public routes
const publicRoutes = [
    { path: routesConfig.home, component: Home },
    { path: routesConfig.login, component: Login },

    { path: routesConfig.role, component: role },
    { path: routesConfig.roleCreate, component: roleCreate },
    { path: routesConfig.roleEdit, component: roleCreate },

    { path: routesConfig.user, component: user },
    { path: routesConfig.userCreate, component: userCreate },
    { path: routesConfig.userEdit, component: userCreate },
    { path: routesConfig.userRsPass, component: userRsPass },
    { path: routesConfig.userBank, component: userBank },
    { path: routesConfig.userBankCreate, component: userBankCreate },
    { path: routesConfig.userBankEdit, component: userBankCreate },
    { path: routesConfig.userContracts, component: userContracts },
    { path: routesConfig.userContractsCreate, component: userContractsCreate },
    { path: routesConfig.userContractsEdit, component: userContractsCreate },

    { path: routesConfig.leave, component: leave },
    { path: routesConfig.leaveCreate, component: leaveCreate },
    { path: routesConfig.leaveEdit, component: leaveCreate },
    { path: routesConfig.leaveApprovals, component: leave },
    { path: routesConfig.leaveApprovalsEdit, component: leaveApprovals },
    { path: routesConfig.leaveHs, component: leaveHs },

    { path: routesConfig.checks, component: checks },
    { path: routesConfig.checkCreate, component: checkCreate },
    { path: routesConfig.checkApprovals, component: checkApprovals },
    { path: routesConfig.checkCalendar, component: checkCalendar },
    { path: routesConfig.checkUp, component: checkUp },

    { path: routesConfig.advances, component: advances },
    { path: routesConfig.advanceCreate, component: advanceCreate },
    { path: routesConfig.advanceEdit, component: advanceCreate },
    { path: routesConfig.advanceApprovals, component: advances },
    { path: routesConfig.advanceApprovalsEdit, component: advanceApprovals },

    { path: routesConfig.salary, component: salary },
    { path: routesConfig.salaryCreate, component: salaryCreate },
    { path: routesConfig.salaryEdit, component: salaryCreate },
    { path: routesConfig.salaryCategories, component: salaryCategories },
    { path: routesConfig.salaryDynamic, component: salaryDynamic },
    { path: routesConfig.salaryFormulas, component: salaryFormulas },
    { path: routesConfig.salaryTable, component: salaryTable },

    { path: routesConfig.holidays, component: holidays },
    { path: routesConfig.holidayDayOff, component: holidayDayOff },

    { path: routesConfig.offices, component: offices },
    { path: routesConfig.officeStructures, component: officeStructures },
    { path: routesConfig.officeSetup, component: officeSetup },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
