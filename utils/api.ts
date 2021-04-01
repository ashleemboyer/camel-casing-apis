import axios from 'axios';

export const get = async (url: string, options?: Record<string, any>) => {
  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
