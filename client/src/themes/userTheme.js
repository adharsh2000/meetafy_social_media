export const defaultTheme = (mode) => {
    return {
      palette: {
        mode,
        ...(mode === "light"
          ? {
              primary: {
                main: "#8327ff",
              },
              secondary: {
                main:"#000"
              },
              background: {
                default: "#c9c9c9", 
                paper: "#FFFFFF",
              },
            }
          : {
              primary: {
                main: "#530094",
              },
              secondary: {
                main:"#fff"
              },
              background: {
                default: "#18191a",
                paper: "#242526",
              },
            }),
      },
      shape: {
        borderRadius: 10,
        shadow: `0px 5px 10px rgba(0, 0, 0, 0.2)`,
      },
    }
  }
  