let isDev = false;

if (process && process.env.NODE_ENV === 'development') {
  isDev = true;
}

module.exports = {
  API_URL: isDev ? 'http://localhost:5000' : 'https://www.cullab.in/api',
};
