export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRegNo = (regNo: string): boolean => {
  const regNoRegex = /^[A-Z0-9]{6,12}$/;
  return regNoRegex.test(regNo);
};

export const validateStaffId = (staffId: string): boolean => {
  const staffIdRegex = /^[A-Z0-9]{4,10}$/;
  return staffIdRegex.test(staffId);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};