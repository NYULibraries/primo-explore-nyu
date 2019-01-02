export const customRequestsConfig = {
  name: 'customRequestsConfig',
  config: {
    baseUrls: {
      ezborrow: 'http://dev.login.library.nyu.edu/ezborrow/nyu',
      ill: 'http://dev.ill.library.nyu.edu/illiad/illiad.dll/OpenURL',
    },
    values: {
      authorizedStatuses: {
        ezborrow: ["50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"],
        ill: ["30", "31", "32", "34", "35", "37", "50", "51", "52", "53", "54", "55", "56", "57", "58", "60", "61", "62", "63", "65", "66", "80", "81", "82"]
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
    linkGenerators: {
      ezborrow: ({ base, item }) => {
        const title = item.pnx.addata.btitle ? item.pnx.addata.btitle[0] : '';
        const author = item.pnx.addata.au ? item.pnx.addata.au[0] : '';
        const ti = encodeURIComponent(`ti=${title}`);
        const au = encodeURIComponent(`au=${author}`);
        return `${base}?query=${ti}+and+${au}`;
      },
      ill: ({ base, item }) => `${base}?${item.delivery.GetIt2.link.match(/resolve?(.*)/)}`
    },
    linkText: {
      ezborrow: 'Request E-ZBorrow',
      ill: 'Request ILL',
    },
    showLinks: {
      ezborrow: ({ user, item, config }) => {
        const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
        const borStatus = user && user['bor-status'];
        return isBook && config.values.authorizedStatuses.ezborrow.indexOf(borStatus) > -1;
      },
      ill: ({ user, item, config }) => {
        const ezborrow = config.showLinks.ezborrow({ user, item, config });
        return !ezborrow && config.values.authorizedStatuses.ill.indexOf(borStatus) > -1
      },
    },
    hideDefault: ({ items, config }) => {
      const { checkAreItemsUnique, checkIsAvailable } = config.values.functions;

      const availabilityStatuses = items.map(checkIsAvailable);
      const itemsAreUnique = checkAreItemsUnique(items);
      const allUnavailable = availabilityStatuses.every(status => status === false);

      return availabilityStatuses.map(isAvailable => allUnavailable || (itemsAreUnique && !isAvailable));
    },
    hideCustom: ({ items, config }) => config.hideDefault({ items, config }).map(boolean => !boolean),
    links: ['ezborrow', 'ill'],
  }
};