const supabase = require('./supabaseClient');
const messaging = require('./firebaseAdmin');

// Fetch all tokens from Supabase
async function fetchAllTokens() {
  const { data: tokens, error } = await supabase
    .from('fcm_tokens')
    .select('token');

  if (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }

  return tokens.map(row => row.token);
}

// Send notifications to all FCM tokens
async function sendNotifications() {
  const registrationTokens = await fetchAllTokens();

  if (registrationTokens.length === 0) {
    console.log('No tokens available');
    return;
  }

  const message = {
    notification: {
      title: 'FCM Notification',
      body: 'You have a new message!'
    },
    data: {
      score: '850',
      time: '2:45'
    },
    tokens: registrationTokens, // Use the tokens array for multicast
  };

  messaging.sendMulticast(message)
    .then((response) => {
      console.log(`Successfully sent ${response.successCount} messages`);
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx]);
          }
        });
        console.log('List of tokens that caused failures:', failedTokens);
      }
    })
    .catch((error) => {
      console.error('Error sending messages:', error);
    });
}

module.exports = sendNotifications;
