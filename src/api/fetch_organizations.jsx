import axios from "axios";
import { API_ROUTER } from "../App";

export async function FetchOrganizations() {
  try {
    const response = await axios.get(`${API_ROUTER}/get-all-organization`);
    console.log("Fetched organizations:", response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error; // Optional: re-throw so the caller can handle it
  }
}
