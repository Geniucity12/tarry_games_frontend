// Netlify Function: proxy /check_wallet to the real backend to avoid CORS
// Uses REACT_APP_API_URL from environment (no trailing slash expected)
const handler = async (event) => {
  try {
    const backend = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
    const address = (event.queryStringParameters && event.queryStringParameters.address) || '';
    if (!backend) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Backend URL not configured' }),
      };
    }

    const url = `${backend}/check_wallet?address=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const text = await res.text();
    // Try to parse JSON if possible
    try {
      const data = JSON.parse(text);
      return {
        statusCode: res.status,
        body: JSON.stringify(data),
      };
    } catch (e) {
      return {
        statusCode: res.status,
        body: text,
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(err) }),
    };
  }
};

exports.handler = handler;
