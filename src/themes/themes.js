import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#039BE5",
      dark: "#01579B",
    },
    secondary: {
      main: "#FAFAFA",
    },
  },
  components: {
    MuiAvatarGroup: {
      styleOverrides: {
        root: ({ ownerState: { max } }) => ({
          ...[...Array(max)].reduce(
            (result, curr, index) => ({
              ...result,
              [`& > .MuiAvatar-root:nth-of-type(${index + 1})`]: {
                zIndex: max - index,
              },
            }),
            {}
          ),
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          overflow: "visible !important",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32)) !important",
          mt: "1.5 !important",
          width: "675px",
          height: "444px",
          borderRadius: "6px !important",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            backgroundColor: "inherit",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          // backgroundColor: "#039BE5",
          fontSize: "1rem",
          height: "43px",
        },
        outlined: {
          boxShadow: 1,
          borderRadius: 5,
          border: "1px solid #2F6FED",
          color: "#2F6FED",
          "&:hover": {
            border: "1px solid #01579B",
            color: "#01579B",
          },
        },
        contained: {
          padding: "6px 6px",
          borderRadius: 5,
          background: "#2F6FED",
        },
        text: {
          color: "#636363",
          backgroundColor: "transparent",
          "&:hover": {
            color: "#D32F2F",
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderTop: "1px solid #9d9d9d29 !important",
          borderBottom: "none !important",
          borderLeft: "none !important",
          borderRight: "none !important",
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "1px solid #9d9d9d29 !important",
            color: "#67686c",
            minHeight: "49px !important",
            backgroundColor: "#f4f8fb94",
            borderRadius: "0% !important",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "16px",
            color: "#0A0D14",
            fontFamily: "Manrope",
            fontWeight: "600 !important",
          },
          "& .MuiDataGrid-renderingZone": {
            maxHeight: "none !important",
          },
          "& .MuiDataGrid-cell": {
            lineHeight: "unset !important",
            maxHeight: "none !important",
            whiteSpace: "normal",
            flexWrap: "wrap !important",
            textOverflow: "ellipsis",
          },
          "& .MuiDataGrid-cellContent": {
            marginLeft: "30px !important",
            fontSize: "16px",
          },
          "& .MuiDataGrid-row": {
            maxHeight: "none !important",
            minHeight: "77.87px !important",
            borderBottom: "1px solid #D9D9D9 !important",
          },
          "& .MuiDataGrid-cell--withRenderer MuiDataGrid-cell MuiDataGrid-cell--textLeft":
            {
              maxHeight: "none !important",
            },
          "& .MuiDataGrid-virtualScroller": {
            fontFamily: "Manrope",
            marginTop: "57px !important",
          },
          "& .MuiDataGrid-iconSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#E9EDF2",
            position: "relative",
            minHeight: "94px !important",
            top: "-2px",
            cursor: "default",
          },
          ". &.MuiSvgIcon-root-MuiSvgIcon": {
            color: "#039be5 !important",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: "100%",
          display: "flex",
          flexDirection: "row",
          color: "#01579B",
          backgroundColor: "#EDF6FF",
          fontSize: "14px",
        },
        label: {
          overflowWrap: "break-word",
          whiteSpace: "normal",
          textOverflow: "clip",
          padding: "4px 12px",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "14px",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 41,
          height: 25,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 2,
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 20,
            height: 20,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#2F6FED",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "20px",
          textTransform: "none",
          color: "#727782",
          "&.Mui-selected": {
            color: "#2F6FED",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: "0px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "Manrope",
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          position: "relative",
          left: "50%",
          top: "45%",
        },
      },
    },
  },
});
export default theme;
