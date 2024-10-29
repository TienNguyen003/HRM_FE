const routes = {
    home: '/',

    login: '/login',
    role: '/roles',
    roleCreate: '/roles/create',
    roleEdit: '/roles/edit/:name',

    user: '/users',
    userCreate: '/users/create',
    userEdit: '/users/edit/:name',
    userRsPass: '/users/reset-password/:name',
    userBank: '/users/bank_account',
    userBankCreate: '/users/bank_account/create',
    userBankEdit: '/users/bank_account/edit/:name',
    userContracts: '/users/contracts',
    userContractsCreate: '/users/contracts/create',
    userContractsEdit: '/users/contracts/edit/:name',
    userChangePass: '/users/change-pass',

    leave: '/day_off_letters',
    leaveCreate: '/day_off_letters/create',
    leaveEdit: '/day_off_letters/edit/:name',
    leaveApprovals: '/day_off_letters/approvals',
    leaveApprovalsEdit: '/day_off_letters/approval/:name',
    leaveHs: '/day_off_letters/sabbatical_leave_logs',

    checks: '/checks',
    checkCreate: '/checks/create',
    checkEdit: '/checks/edit/:name',
    checkCalendar: '/checks/calendar',

    advances: '/advances',
    advanceCreate: '/advances/create',
    advanceEdit: '/advances/edit/:name',
    advanceApprovals: '/advances/approvals',
    advanceApprovalsEdit: '/advances/approvals/edit/:name',

    salary: '/salary',
    salaryCreate: '/salary/create',
    salaryEdit: '/salary/edit/:name',
    salaryDynamic: '/salary/dynamic_values',
    salaryDynamiCreate: '/salary/dynamic_values/create',
    salaryDynamiEdit: '/salary/dynamic_values/edit/:name',
    salaryTable: '/salary/table',
    salaryTableDetail: '/salary/table/view/:name',
    salaryTableCreate: '/salary/table/create',
    salaryCategories: '/salary/categories',
    salaryCategoriesCreate: '/salary/categories/create',
    salaryCategoriesEdit: '/salary/categories/edit/:name',
    salaryFormulas: '/salary/formulas',
    salaryFormulasCreate: '/salary/formulas/create',
    salaryFormulasEdit: '/salary/formulas/edit/:name',

    holidays: '/holidays',
    holidaysCreate: '/holidays/create',
    holidaysEdit: '/holidays/edit/:name',
    holidayDayOff: '/holidays/day_off',
    holidayDayOffCreate: '/holidays/day_off/create',
    holidayDayOffEdit: '/holidays/day_off/edit/:name',

    offices: '/offices',
    officesCreate: '/offices/create',
    officesEdit: '/offices/edit/:name',
    officeStructures: '/offices/structures',
    officeStructuresCreate: '/offices/structures/create',
    officeStructuresEdit: '/offices/structures/edit/:name',
    officeSetup: '/offices/setup',

    checkcv: '/check-cv',
    listcv: '/list-cv'
};

export default routes;
