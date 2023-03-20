import axios from "axios";
//Mainnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
 
const Interceptor = axios.create({

});
 
Interceptor.interceptors.request.use((config) => {
  let tokensData = JSON.parse(localStorage.getItem("currentUser"));
  
  config.headers.Authorization = `bearer ${tokensData.token}`;
  return config;
});

Interceptor.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    if (error.response.status === 401) {
      const authData = JSON.parse(localStorage.getItem("currentUser"));
      const payload = {
        token: authData.token,
        refreshToken: authData.refreshToken,
      };
 
      let apiResponse = await axios.post(
        "https://localhost:44363/api/Authenticate/RefreshToken",
        payload
      );
      localStorage.setItem("currentUser", JSON.stringify(apiResponse.data));
      error.config.headers[
        "Authorization"
      ] = `bearer ${apiResponse.data.token}`;
      return axios(error.config);
    } else {
      return Promise.reject(error);
    }

   
  }
);
export default Interceptor;