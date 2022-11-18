export const mockedXtzBalance = '1234';
export const mockedTokenBalance = '5678';

export const getMockTezosToolkit = () => {
  return {
    tz: {
      getBalance: () => {
        return {
          toFixed: () => {
            return mockedXtzBalance;
          },
        };
      },
    },
    contract: {
      at: () => {
        return {
          views: {
            getBalance: () => {
              return {
                read: () => {
                  return {
                    toFixed: () => {
                      return mockedTokenBalance;
                    },
                  };
                },
              };
            },
          },
        };
      },
    },
  };
};
