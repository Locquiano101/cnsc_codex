import { API_ROUTER } from "../App";
import axios from "axios";

export const fetchAccreditationAPI = async () => {
  try {
    const response = await axios.get(`${API_ROUTER}/get-accreditation`);
    console.log(response.data.accreditations);
  } catch (error) {
    console.error("Error fetching accreditation:", error);
  }
};
