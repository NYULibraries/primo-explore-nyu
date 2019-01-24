export default {
  name: 'primoExploreCustomLoginConfig',
  config: {
    pdsUrl: `https://pds${process.env.NODE_ENV !== 'production' ? 'dev' : ''}.library.nyu.edu/pds`,
    queryString: 'func=get-attribute&attribute=bor_info',
    selectors: ['id', 'bor-status'],
    mockConfig: {
      enabled: true,
      user: {
        'id': '1234567',
        'bor-status': '55',
      },
      delay: 500,
    }
  },
};