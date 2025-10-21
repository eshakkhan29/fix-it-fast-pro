export const createUserDataFormatter = (values: any) => {
    return {
    id: 0,
    status: "Active",
    // createdBy: "string",
    createTimestamp: "2025-10-02T07:12:28.947Z",
    modifiedBy: "",
    modifiedTimestamp: "2025-10-02T07:12:28.947Z",
    dataStateFlag: "",
    userId: "",
    accountId: 1261,
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword,
    firstName: values.firstName,
    lastName: values.lastName,
    displayName: values.firstName + ' ' + values.lastName,
    reportsTo: 12000,
    prefix: values.prefix,
    phoneNumber: values.phoneNumber,
    lockoutEnabled: true,
    passwordExpired: true,
    jobTitleId: 0,
    departments: [0],
    roles: [7],
    accounts: [1],
    loggedInRoleId: 7
    };
};
