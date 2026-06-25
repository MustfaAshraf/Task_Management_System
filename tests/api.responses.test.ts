import { successResponse, createResponse, noContentResponse } from '../src/utils/api.response';
import { HTTP_STATUS } from '../src/config/constants';

describe('API Response Formatters', () => {
  
  it('should format a success response (200 OK) correctly', () => {
    const mockData = { id: 1, name: 'Test Project' };
    const response = successResponse(mockData, 'Projects fetched');

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(response.success).toBe(true);
    expect(response.message).toBe('Projects fetched');
    expect(response.data).toEqual(mockData);
  });

  it('should format a created response (201 Created) correctly', () => {
    const mockData = { id: 2, title: 'New Task' };
    const response = createResponse(mockData, 'Task created');

    expect(response.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(response.success).toBe(true);
    expect(response.message).toBe('Task created');
    expect(response.data).toEqual(mockData);
  });

  it('should format a no content/deleted response correctly', () => {
    const response = noContentResponse('Task deleted');

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(response.success).toBe(true);
    expect(response.message).toBe('Task deleted');
    expect(response.data).toBeNull();
  });
});