import axios from "axios";
import { API_ROUTER } from "../App";
export const FetchAllAccreditationAPI = async () => {
  try {
    const response = await axios.get(`${API_ROUTER}/get-accreditation`);
    console.log(response.data.accreditations);
  } catch (error) {
    console.error("Error fetching accreditation:", error);
  }
};

export const FetchAccreditationByIdAPI = async (accreditation_id) => {
  try {
    const response = await axios.get(
      `${API_ROUTER}/get-accreditation/${accreditation_id}`
    );
    console.log(response.data.accreditations);
  } catch (error) {
    console.error("Error fetching accreditation:", error);
  }
};
