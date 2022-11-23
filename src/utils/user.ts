export const getFullName = (
  firstName: string,
  lastName: string,
  middleName?: string
) => {
  return middleName
    ? `${firstName || ""} ${middleName || ""} ${lastName || ""} `
    : `${firstName || ""} ${lastName || ""} `;
};
