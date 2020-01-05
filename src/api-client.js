const BASE_PATH = 'https://secure.splitwise.com/api/v3.0';

const composePath = (method) => `${BASE_PATH}/${method}`;

const getJsonBody = (response) => response.json();

// eslint-disable-next-line import/prefer-default-export
export const getMainData = () => fetch(composePath('get_main_data')).then(getJsonBody);
