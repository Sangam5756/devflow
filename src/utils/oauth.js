const { OAuth2Client } = require("google-auth-library");
const { GOOGLE_CLIENT_ID } = require("../config/server.config");

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    email: payload.email,
    username: payload.name,
    avatarUrl: payload.picture,
    provider: "google",
  };
}

async function verifyGithubToken(token) {
  const res = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const ghUser = await res.json();

  if (!ghUser || ghUser.message === "Bad credentials") {
    throw new Error("Invalid GitHub token");
  }

  return {
    email: ghUser.email,
    username: ghUser.login,
    avatarUrl: ghUser.avatar_url,
    provider: "github",
  };
}

module.exports = {
  verifyGithubToken,
  verifyGoogleToken,
};
