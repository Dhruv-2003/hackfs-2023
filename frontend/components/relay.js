const RELAY_API_URL = "https://relay-server-staging.herokuapp.com";
const RELAY_API_KEY = "google-auth-next-example";

export async function fetchPKPs(body) {
  const response = await fetch(`${RELAY_API_URL}/auth/google/userinfo`, {
    method: "POST",
    headers: {
      "api-key": RELAY_API_KEY,
      "Content-Type": "application/json",
    },
    body: body,
  });

  if (response.status < 200 || response.status >= 400) {
    console.warn("Something wrong with the API call", await response.json());
    const err = new Error("Unable to fetch PKPs through relay server");
    throw err;
  } else {
    const resBody = await response.json();
    console.log("Response OK", { body: resBody });
    console.log("Successfully fetched PKPs with relayer");
    return resBody;
  }
}
