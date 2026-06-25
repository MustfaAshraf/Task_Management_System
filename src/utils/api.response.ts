import { HTTP_STATUS } from '../config/constants';

export const successResponse = (data: any, message = "Success") => {
  return {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message,
    data
  };
};

export const createResponse = (data: any, message = "Created successfully") => {
  return {
    statusCode: HTTP_STATUS.CREATED,
    success: true,
    message,
    data,
  };
};

export const noContentResponse = (message = "Deleted successfully") => {
  return {
    statusCode: HTTP_STATUS.OK,
    success: true,
    message,
    data: null,
  };
};