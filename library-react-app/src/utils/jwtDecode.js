export function decodeJwt(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error("Failed to decode token", error);
      return null;
    }
  }
  