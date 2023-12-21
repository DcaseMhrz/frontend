import axios from 'axios'

import Cookies from 'js-cookie'

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL

const signinURL = `${BACKENDURL}/auth/login`
const registerURL = `${BACKENDURL}/auth/login`
const hfcURL = `${BACKENDURL}/hfc`
const searchUrl = `${BACKENDURL}/search?q=`


const config = () => {
  const token = Cookies.get("token")

  if (!token || token === "undefined") {
    console.error("User not authenticated.");
    // Handle the case when the user is not authenticated or redirect to the sign-in page
    return;
  }
  const headersList = {
    Accept: "*/*",
    Authorization: `Bearer ${token}`,
  };
  return {
    headers:
      headersList,
  };
};

const login = async (data: { email: string, password: string }) => {
  const request = await axios.post(signinURL, data)
  return request
}

const register = async (data: { email: string, password: string }) => {
  const registerData = { ...data, rememberMeToken: false }
  const request = await axios.post(registerURL, registerData)

  return request.data
}
const handleSignInWithGoogle = async () => {
  try {
    const url = `${BACKENDURL}/auth/google/redirect`;

    const response = await axios.get(url, config());
    const { data } = response;
    window.location.href = data; // Redirect to the response URL
  } catch (error) {
    console.error("Error occurred while fetching response URL:", error);
  }
};
const sendHfcData = async (data: any) => {
  try {
    const response = await axios.post(hfcURL, data)
    return response.data
  }
  catch (error) {
    console.log(error)
  }
}

const getHfcData = async () => {
  try {
    const response = await axios.get(hfcURL, config())
    return response.data
  }
  catch (error) {
    console.log(error)
  }
}

const updateHfcData = async (data: any) => {
  try {
    const response = await axios.put(`${hfcURL}/${data.id}`, data)
    return response.data
  }
  catch (error) {
    console.log(error)
  }
}
const searchHFCData = async (searchTerm: any) => {
  try {
    const response = await axios.get(`${searchUrl}${searchTerm}`, config())
    return response.data
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = { login, register, handleSignInWithGoogle, sendHfcData, getHfcData, updateHfcData, searchHFCData }
