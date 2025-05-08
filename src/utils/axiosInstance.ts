import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const axiosInstance : AxiosInstance = axios.create({
    baseURL:import.meta.env.VITE_APP_BASE_URL,
});

axiosInstance.interceptors.request.use((request : InternalAxiosRequestConfig)=>{
    const token = localStorage.getItem("accessToken");
    
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
},
(error : AxiosError) => {
    console.log(error);
    return Promise.reject(error);
}
);

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
    return response;
},
(error :AxiosError) => {
    console.log(error);
    if (error.status == 401) {
        localStorage.removeItem("accessToken");
      }
      return Promise.reject(error);
})


export default axiosInstance;