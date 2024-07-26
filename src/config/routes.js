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

    leave: '/day_off_letters',
    leaveCreate: '/day_off_letters/create',
    leaveEdit: '/day_off_letters/edit/:name',
    leaveApprovals: '/day_off_letters/approvals',
    leaveApprovalsEdit: '/day_off_letters/approval/:name',
    leaveHs: '/day_off_letters/sabbatical_leave_logs',

    checks: '/checks',
    checkCreate: '/checks/create',
    checkCalendar: '/checks/calendar',
    checkApprovals: '/checks/approvals',
    checkUp: '/checks/upload-file',

    advances: '/advances',
    advanceCreate: '/advances/create',
    advanceApprovals: '/advances/approvals',

    salary: '/salary',
    salaryDynamic: '/salary/dynamic_values',
    salaryTable: '/salary/table',
    salaryCategories: '/salary/categories',
    salaryFormulas: '/salary/formulas',

    holidays: '/holidays',
    holidayDayOff: '/holidays/day_off',

    offices: '/offices',
    officeStructures: '/offices/structures',
    officeSetup: '/offices/setup',

    DetailLazMall: '/DetailLazMall/:nickname',
};

export default routes;
