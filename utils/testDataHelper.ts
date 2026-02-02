/**
 * Test data generators and fixtures
 */

export class TestDataHelper {
  /**
   * Generate a sample user object
   */
  static generateUser(overrides?: any) {
    return {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      ...overrides,
    };
  }

  /**
   * Generate a sample post object
   */
  static generatePost(overrides?: any) {
    return {
      title: 'Test Post',
      body: 'This is a test post body',
      userId: 1,
      ...overrides,
    };
  }

  /**
   * Generate a sample comment object
   */
  static generateComment(overrides?: any) {
    return {
      name: 'Test Comment',
      email: 'test@example.com',
      body: 'This is a test comment',
      postId: 1,
      ...overrides,
    };
  }

  /**
   * Generate random string
   */
  static randomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate random number
   */
  static randomNumber(min: number = 1, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
