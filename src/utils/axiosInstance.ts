import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const axiosInstance : AxiosInstance = axios.create({
    baseURL:"http://16.171.22.233/api/v1",
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