import routesConfig from '../config/routes';

// pages
import Home from '../component/ingredient/home/home';
import Login from '../component/ingredient/login/login';
import { Role, CreateRole } from '../component/ingredient/Role/index';
import { User, CreateUser, RsPass, Bank, CreateBank, Contract, CreateContract, ChangePass } from '../component/ingredient/User/index';
import { Leave, CreateLeave, ApproveLeave, HsLeave } from '../component/ingredient/Leave/index';
import { Calendar, Checks, Create } from '../component/ingredient/Timekeepting/index';
import { Advances, ApprovelsAd, CreateAd } from '../component/ingredient/Advances/index';
import {
    Tables,
    TableView,
    TableCreate,
    Formulas,
    FormulasCreate,
    CateSalary,
    CateSalaryCreate,
    Dynamic,
    DynamicCreate,
    Static,
    StaticCreate,
} from '../component/ingredient/Salary/index';
import { Holidays, DayOff, CreateDayOff, CreateHolidays } from '../component/ingredient/Holidays/index';
import { Office, Structures, Setups, CreateOffice, CreateStruct } from '../component/ingredient/Office/index';
import { CheckCV, ListCV } from '../component/ingredient/CheckCV/index';

// public routes
const publicRoutes = [
    { path: routesConfig.home, component: Home },
    { path: routesConfig.login, component: Login },

    { path: routesConfig.role, component: Role },
    { path: routesConfig.roleCreate, component: CreateRole },
    { path: routesConfig.roleEdit, component: CreateRole },

    { path: routesConfig.user, component: User },
    { path: routesConfig.userCreate, component: CreateUser },
    { path: routesConfig.userEdit, component: CreateUser },
    { path: routesConfig.userRsPass, component: RsPass },
    { path: routesConfig.userBank, component: Bank },
    { path: routesConfig.userBankCreate, component: CreateBank },
    { path: routesConfig.userBankEdit, component: CreateBank },
    { path: routesConfig.userContracts, component: Contract },
    { path: routesConfig.userContractsCreate, component: CreateContract },
    { path: routesConfig.userContractsEdit, component: CreateContract },
    { path: routesConfig.userChangePass, component: ChangePass },

    { path: routesConfig.leave, component: Leave },
    { path: routesConfig.leaveCreate, component: CreateLeave },
    { path: routesConfig.leaveEdit, component: CreateLeave },
    { path: routesConfig.leaveApprovals, component: Leave },
    { path: routesConfig.leaveApprovalsEdit, component: ApproveLeave },
    { path: routesConfig.leaveHs, component: HsLeave },

    { path: routesConfig.checks, component: Checks },
    { path: routesConfig.checkCreate, component: Create },
    { path: routesConfig.checkEdit, component: Create },
    { path: routesConfig.checkCalendar, component: Calendar },

    { path: routesConfig.advances, component: Advances },
    { path: routesConfig.advanceCreate, component: CreateAd },
    { path: routesConfig.advanceEdit, component: CreateAd },
    { path: routesConfig.advanceApprovals, component: Advances },
    { path: routesConfig.advanceApprovalsEdit, component: ApprovelsAd },

    { path: routesConfig.salary, component: Static },
    { path: routesConfig.salaryCreate, component: StaticCreate },
    { path: routesConfig.salaryEdit, component: StaticCreate },
    { path: routesConfig.salaryCategories, component: CateSalary },
    { path: routesConfig.salaryCategoriesCreate, component: CateSalaryCreate },
    { path: routesConfig.salaryCategoriesEdit, component: CateSalaryCreate },
    { path: routesConfig.salaryDynamic, component: Dynamic },
    { path: routesConfig.salaryDynamiCreate, component: DynamicCreate },
    { path: routesConfig.salaryDynamiEdit, component: DynamicCreate },
    { path: routesConfig.salaryFormulas, component: Formulas },
    { path: routesConfig.salaryFormulasCreate, component: FormulasCreate },
    { path: routesConfig.salaryFormulasEdit, component: FormulasCreate },
    { path: routesConfig.salaryTable, component: Tables },
    { path: routesConfig.salaryTableDetail, component: TableView },
    { path: routesConfig.salaryTableCreate, component: TableCreate },

    { path: routesConfig.holidays, component: Holidays },
    { path: routesConfig.holidaysCreate, component: CreateHolidays },
    { path: routesConfig.holidaysEdit, component: CreateHolidays },
    { path: routesConfig.holidayDayOff, component: DayOff },
    { path: routesConfig.holidayDayOffCreate, component: CreateDayOff },
    { path: routesConfig.holidayDayOffEdit, component: CreateDayOff },

    { path: routesConfig.offices, component: Office },
    { path: routesConfig.officesCreate, component: CreateOffice },
    { path: routesConfig.officesEdit, component: CreateOffice },
    { path: routesConfig.officeStructures, component: Structures },
    { path: routesConfig.officeStructuresCreate, component: CreateStruct },
    { path: routesConfig.officeStructuresEdit, component: CreateStruct },
    { path: routesConfig.officeSetup, component: Setups },

    { path: routesConfig.checkcv, component: CheckCV },
    { path: routesConfig.listcv, component: ListCV },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
