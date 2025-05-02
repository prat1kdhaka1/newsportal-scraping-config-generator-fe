export function handleResponse(response: Response) {
  // return authorization header with jwt token
  return response
    .text()
    .then((text) => {
      let data;
      try {
        data = text && JSON.parse(text);
      } catch (error) {
        return "error";
      }
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // you can logout here
          // handleLogout();
        }
        const error = data || response.statusText;
        return Promise.reject(error);
      }
      return data;
    })
    .catch((error) => ({
      code: "error",
      message: error?.message || "Something went wrong.",
    }));
}
