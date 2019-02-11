const externalLinkIcon = {
  icon: "ic_open_in_new_24px",
  set: "action",
  attributes: { 'custom-requests': '' },
};

const loginIcon = {
  set: "primo-ui",
  icon: "sign-in",
  attributes: { 'custom-requests': '' },
};

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
          prmIconAfter: externalLinkIcon,
        };
      },
      ill: ({ item, config }) => ({
        href: `${config.values.baseUrls.ill}?${item.delivery.GetIt2.link.match(/resolve?(.*)/)}`,
        label: 'Request ILL',
        prmIconAfter: externalLinkIcon,
      }),
      login: () => ({
        prmIconBefore: loginIcon,
        label: 'Login to see request options',
        action: ($injector) => $injector.get('primoExploreCustomLoginService').login(),
      }),
      afc: () => ({
        label: "Schedule a video loan",
        href: "https://nyu.qualtrics.com/jfe/form/SV_eKBzul896KmAWVL",
        prmIconAfter: externalLinkIcon,
      })
    },
    noButtonsText: '{item.request.blocked}',
    showCustomRequests: {
      ill: ({ item, items, config, user}) => {
        if (!user) return items.map(() => false);
        const showEzborrowArr = config.showCustomRequests.ezborrow({ user, item, items, config });
        const showIll = config.values.authorizedStatuses.ill.indexOf(user['bor-status']) > -1;

        const requestables = config.values.functions.requestableArray({ items, config });
        return items.map((_e, idx) => !showEzborrowArr[idx] && requestables[idx] && showIll);
      },
      ezborrow: ({ item, items, config, user}) => {
        if (!user) return items.map(() => false);
        const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
        const showEzborrow = isBook && config.values.authorizedStatuses.ezborrow.indexOf(user['bor-status']) > -1;

        const requestables = config.values.functions.requestableArray({ items, config });
        return items.map((_e, idx) => requestables[idx] && showEzborrow);
      },
      login: ({ user, items }) => items.map(() => user === undefined),
      afc: ({ item, items, config, user}) => {
        if (!user) return items.map(() => false);
        const afcEligible = config.values.authorizedStatuses.afc.indexOf(user['bor-status']) > -1;
        const isBAFCMainCollection = item.delivery.holding.some(({ subLocation, libraryCode}) => {
          return libraryCode === "BAFC" && subLocation === "Main Collection";
        });

        return items.map(() => afcEligible && isBAFCMainCollection);
      }
    },
    hideDefaultRequests: ({ items, config, user }) => {
      // no user, then hide all requests
      if (user === undefined) {
        return items.map(() => true);
      }
      // NYUSH patrons always see default request options
      else if (user && config.values.authorizedStatuses.nyush.indexOf(user['bor-status']) > -1) {
        return items.map(() => false);
      }

      // otherwise, hide only unavailable holdings
      return config.values.functions.availabilityArray({ items, config }).map(avail => !avail);
    },
    values: {
      baseUrls: {
        ezborrow: `https://${process.env.NODE_ENV !== 'production' ? 'dev' : ''}.login.library.nyu.edu/ezborrow/nyu`,
        ill: `http://${process.env.NODE_ENV !== 'production' ? 'dev.' : ''}ill.library.nyu.edu/illiad/illiad.dll/OpenURL`,
      },
      authorizedStatuses: {
        ezborrow: ["50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"],
        ill: ["30", "31", "32", "34", "35", "37", "50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82", "89"],
        afc: ["03", "05", "10", "12", "20", "21", "30", "32", "50", "52", "53", "54", "61", "62", "70", "80", "89", "90"],
        nyush: ["20", "21", "22", "23"],
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
          const circulationStatus = item.itemFields[0];
          return !hasPattern(unavailablePatterns, circulationStatus);
        },
        availabilityArray: ({ items, config }) => {
          const { checkIsAvailable } = config.values.functions;
          return items.map(checkIsAvailable);
        },
        requestableArray: ({ items, config }) => {
          const { checkAreItemsUnique, availabilityArray } = config.values.functions;
          const availabilityStatuses = availabilityArray({ items, config });
          const itemsAreUnique = checkAreItemsUnique(items);
          const allUnavailable = availabilityStatuses.every(status => status === false);

          return availabilityStatuses.map(isAvailable => allUnavailable || (itemsAreUnique && !isAvailable));
        }
      }
    },
  }
};