import axios from 'axios';
import { ApiResponse } from '@customTypes/apiTypes';
import { normalizeKeyCasing } from '@utils';

const get = async (
  url: string,
  options?: Record<string, any>,
): Promise<ApiResponse> => {
  try {
    const response = await axios.get(url, options);
    return {
      data: normalizeKeyCasing(response.data) || {},
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
    };
  }
};

export default { get };
