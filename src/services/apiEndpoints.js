const BASE_URL = 'http://192.168.1.7:8000';

const API_ENDPOINTS = {
  BASE_URL,

  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',

  CREATE_LOAN: '/loan/create',
  LOAN_DETAIL: id => `/loan/${id}`,
  LOAN_SUMMARY: id => `/loan/${id}/summary`,

  EMI_SCHEDULE: loanId => `/emi/${loanId}`,
  PAY_EMI: '/emi/pay',

  MY_LOANS: '/dashboard/loans',
  ACTIVE_LOANS: '/dashboard/active-loans',
  CLOSED_LOANS: '/dashboard/closed-loans',
};

export default API_ENDPOINTS;
