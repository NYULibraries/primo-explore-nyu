const mockUserWarning = () => console.warn(`This build is using a mock user!` +
  ` Use NODE_ENV that is not 'development' (e.g. 'staging')` +
  ` to disable the mock user feature`);

export default {
  name: 'primoExploreCustomLoginConfig',
  config: {
    pdsUrl: `https://pds${process.env.NODE_ENV !== 'production' ? 'dev' : ''}.library.nyu.edu/pds`,
    queryString: 'func=get-attribute&attribute=bor_info',
    selectors: ['id', 'bor-status'],
    mockUserConfig: {
      enabled: process.env.NODE_ENV === 'development' ? (mockUserWarning(), true) : false,
      user: {
        'id': '1234567',
        'bor-status': '50',
      },
      delay: 500,
    }
  },
};