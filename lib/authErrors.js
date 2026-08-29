const MESSAGES = {
  'auth/invalid-credential': 'Could not log in. Check your email and password.',
  'auth/wrong-password': 'Could not log in. Check your email and password.',
  'auth/user-not-found': 'Could not log in. Check your email and password.',
  'auth/email-already-in-use':
    'Could not create account. Try logging in or use a different email.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/operation-not-allowed': 'Email sign-in is not enabled for this app.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
};

const DEFAULTS = {
  login: 'Could not log in. Check your email and password.',
  signup: 'Could not create account. Please try again.',
  reset: 'Could not send reset email. Check the address and try again.',
  verify: 'Could not send verification email. Try again in a moment.',
};

export function getAuthErrorMessage(error, context = 'login') {
  const code = error?.code;
  if (code && MESSAGES[code]) {
    return MESSAGES[code];
  }
  return DEFAULTS[context] || DEFAULTS.login;
}
