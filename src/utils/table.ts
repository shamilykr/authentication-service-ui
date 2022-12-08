export function stringToColor(string: string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 10)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name), //#039be5bf
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0] || ""}`,
  };
}
export function stringSmallAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name), //#039be5bf
      width: "32px",
      height: "32px",
      fontSize: "15px",
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0] || ""}`,
  };
}
