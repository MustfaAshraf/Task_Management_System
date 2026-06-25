import { generateAccessToken, verifyToken } from '../src/utils/jwt';

describe('JWT Utilities', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret_key';
  });

  it('should generate a valid access token as a string', () => {
    const payload = { id: 'user123', role: 'Member' };
    const token = generateAccessToken(payload);
    
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  it('should accurately verify and decode a valid token', () => {
    const payload = { id: 'user123', role: 'Member' };
    const token = generateAccessToken(payload);
    
    const decoded: any = verifyToken(token);
    
    expect(decoded.id).toBe('user123');
    expect(decoded.role).toBe('Member');
  });

  it('should throw an Unauthorized error for a fake/invalid token', () => {
    const fakeToken = 'this.is.fake';
    
    expect(() => {
      verifyToken(fakeToken);
    }).toThrow('Invalid token');
  });
});