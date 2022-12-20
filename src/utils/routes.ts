export const getHeader = () => {
  let pathnameArray: string[] = [];
  if (window?.location?.hash.includes("home")) {
    pathnameArray = window?.location?.hash?.split("home")?.[1]?.split("/");

    if (pathnameArray?.length === 4) {
      return `Modify ${pathnameArray[1]}`;
    } else if (pathnameArray[2] === "add") {
      return `Add ${pathnameArray[1]}`;
    } else if (pathnameArray?.length === 3 && pathnameArray[2] !== "add") {
      return `View ${pathnameArray[1]}`;
    } else if (pathnameArray?.length === 2) {
      return (
        pathnameArray[1]?.charAt(0).toUpperCase() + pathnameArray[1].slice(1)
      );
    }
  }
};
