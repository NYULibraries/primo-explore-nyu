export default {
  name: 'primoExploreCustomRequestsConfig',
  config: {
    buttonIds: ['login', 'ezborrow', 'ill', 'afc'],
    buttonGenerators: {
      ezborrow: ({ item, config }) => {
        const title = item.pnx.addata.btitle ? item.pnx.addata.btitle[0] : '';
        const author = item.pnx.addata.au ? item.pnx.addata.au[0] : '';
        const ti = encodeURIComponent(`ti=${title}`);
        const au = encodeURIComponent(`au=${author}`);
        return {
          href: `${config.values.baseUrls.ezborrow}?query=${ti}+and+${au}`,
          label: 'Request E-ZBorrow',
        };
      },
      ill: ({ item, config }) => ({
        href: `${config.values.baseUrls.ill}?${item.delivery.GetIt2.link.match(/resolve?(.*)/)}`,
        label: 'Request ILL',
      }),
      login: () => ({
        label: 'Login to see request options',
        action: ($injector) => $injector.get('primoExploreCustomLoginService').login(),
      }),
      afc: () => ({
        label: "Schedule a video loan",
        href: "https://nyu.qualtrics.com/jfe/form/SV_eKBzul896KmAWVL",
      })
    },
    noButtonsText: '{item.request.blocked}',
    showButtons: {
      ezborrow: ({ user, item, config }) => {
        if (!user) return false;
        const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
        return isBook && config.values.authorizedStatuses.ezborrow.indexOf(user['bor-status']) > -1;
      },
      ill: ({ user, item, config }) => {
        if (!user) return false;
        const ezborrow = config.showButtons.ezborrow({ user, item, config });
        return !ezborrow && config.values.authorizedStatuses.ill.indexOf(user['bor-status']) > -1;
      },
      login: ({ user }) => user === undefined,
      afc: ({ item, user, config }) => {
        if (!user) return false;

        const afcEligible = config.values.authorizedStatuses.afc.indexOf(user['bor-status']) > -1;

        const isBAFCMainCollection = item.delivery.holding.some(({ subLocation, libraryCode}) => {
          return libraryCode === "BAFC" && subLocation === "Main Collection";
        });

        return afcEligible && isBAFCMainCollection;
      }
    },
    hideAllDefaultRequests: ({ items, config, user }) => {
      if (user === undefined) {
        return items.map(() => true);
      }

      const { checkAreItemsUnique, checkIsAvailable } = config.values.functions;

      const availabilityStatuses = items.map(checkIsAvailable);
      const itemsAreUnique = checkAreItemsUnique(items);
      const allUnavailable = availabilityStatuses.every(status => status === false);

      return availabilityStatuses.map(isAvailable => allUnavailable || (itemsAreUnique && !isAvailable));
    },
    hideCustomRequests: ({ item, items, config, user}) => {
      const hideExternalRequest = config.hideAllDefaultRequests({ items, config, user }).map(boolean => !boolean);
      const hideAFC = !config.showButtons.afc({ item, user, config });
      const loggedIn = user !== undefined;

      return ({
        ill: hideExternalRequest,
        ezborrow: hideExternalRequest,
        login: items.map(() => loggedIn),
        afc: items.map(() => hideAFC),
      });
    },
    values: {
      baseUrls: {
        ezborrow: `https://${process.env.NODE_ENV !== 'production' ? 'dev' : ''}.login.library.nyu.edu/ezborrow/nyu`,
        ill: `https://${process.env.NODE_ENV !== 'production' ? 'dev.' : ''}ill.library.nyu.edu/illiad/illiad.dll/OpenURL`,
      },
      authorizedStatuses: {
        ezborrow: ["50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"],
        ill: ["30", "31", "32", "34", "35", "37", "50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82"],
        afc: ["03", "05", "10", "12", "20", "21", "30", "32", "50", "52", "53", "54", "61", "62", "70", "80", "89", "90"],
      },
      functions: {
        checkAreItemsUnique: items => items.some((item, _i, items) => item._additionalData.itemdescription !== items[0]._additionalData.itemdescription),
        checkIsAvailable: item => {
          const unavailablePatterns = [
            /Requested/g,
            /^\d{2}\/\d{2}\/\d{2}/g, // starts with dd/dd/dd
            'Requested',
            'Billed as Lost',
            'Claimed Returned',
            'In Processing',
            'In Transit',
            'On Hold',
            'Request ILL',
            'On Order',
          ];

          const hasPattern = (patterns, target) => patterns.some(str => target.match(new RegExp(str)));
          const [circulationStatus, ...otherStatusFields] = item.itemFields;
          return !hasPattern(unavailablePatterns, circulationStatus);
        }
      }
    },
  }
};