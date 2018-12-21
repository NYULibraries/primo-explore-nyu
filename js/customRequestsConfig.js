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
      unavailablePatterns: [
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
      ]
    },
    linkGenerators: {
      ezborrow: ({
        base,
        item
      }) => {
        const title = item.pnx.addata.btitle ? item.pnx.addata.btitle[0] : '';
        const author = item.pnx.addata.au ? item.pnx.addata.au[0] : '';
        const ti = encodeURIComponent(`ti=${title}`);
        const au = encodeURIComponent(`au=${author}`);
        return `${base}?query=${ti}+and+${au}`;
      },
      ill: ({
        base,
        item
      }) => `${base}?${item.delivery.GetIt2.link.match(/resolve?(.*)/)}`
    },
    linkText: {
      ezborrow: 'Request E-ZBorrow',
      ill: 'Request ILL',
    },
    showLinks: {
      ezborrow: ({ user, config, item }) => {
        const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
        const borStatus = user && user['bor-status'];
        return isBook && config.values.authorizedStatuses.ezborrow.indexOf(borStatus) > -1;
      },
      ill: ({
        user,
        item,
        config
      }) => {
        const isBook = ['BOOK', 'BOOKS'].some(type => item.pnx.addata.ristype.indexOf(type) > -1);
        const borStatus = user && user['bor-status'];
        const ezborrow = isBook && config.values.authorizedStatuses.ezborrow.indexOf(borStatus) > -1;
        return !ezborrow && config.values.authorizedStatuses.ill.indexOf(borStatus) > -1
      },
    },
    hideDefault: ({ items, config }) => {
      const hasPattern = (patterns, target) => patterns.some(str => target.match(new RegExp(str)));
      const checkIsAvailable = item => {
        const [circulationStatus, ...otherStatusFields] = item.itemFields;
        return !hasPattern(config.values.unavailablePatterns, circulationStatus);
      };
      const checkAreItemsUnique = items => items.some((item, _i, items) => item._additionalData.itemdescription !== items[0]._additionalData.itemdescription);

      const availabilityStatuses = items.map(checkIsAvailable);
      const itemsAreUnique = checkAreItemsUnique(items);
      const allUnavailable = availabilityStatuses.every(status => status === false);

      return availabilityStatuses.map(isAvailable => allUnavailable || (itemsAreUnique && !isAvailable));
    },
    hideCustom: ({ items, config }) => config.hideDefault({
      items,
      config
    }).map(boolean => !boolean),
    links: ['ezborrow', 'ill'],
    prmLocationItemsAfterTemplate: `
<div>
  <p>
    <prm-icon style="z-index:1" icon-type="svg" svg-icon-set="action" icon-definition="ic_help_24px"></prm-icon>
    <span>Request E-ZBorrow: Get item from one of our partner libraries in 3-6 days. Checkout period is 12 weeks, with no renewals.</span>
  </p>
  <p>
    <prm-icon style="z-index:1" icon-type="svg" svg-icon-set="action" icon-definition="ic_help_24px"></prm-icon>
    <span>Request ILL: Request a loan of this item via Interlibrary
      Loan. Most requests arrive within two weeks. Due dates and renewals are determined by the lending library.
      Article/chapter requests are typically delivered electronically in 3-5 days.
    </span>
  </p>
</div>
`
  }
};