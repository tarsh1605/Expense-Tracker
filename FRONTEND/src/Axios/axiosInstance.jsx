import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  // console.log(accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Error Response:", error.response);

    if (error.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("Refresh token is missing!");
          return Promise.reject(error);
        }

        const { data } = await axios.post("http://localhost:5000/auth/token", {
          refreshToken,
        });
        const accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        const retryRequest = { ...originalRequest };
        retryRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(retryRequest);
      } catch (err) {
        console.error("Error refreshing token:", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
