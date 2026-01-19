class AuthService {
  async login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && password) {
          const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IiR7dXNlcm5hbWV9IiwiaWF0IjoxNTE2MjM5MDIyfQ.mock-signature`;
          
          const userData = {
            username,
            token: mockToken,
            roles: ['user']
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject('Invalid credentials');
        }
      }, 500);
    });
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getToken() {
    const user = this.getCurrentUser();
    return user?.token;
  }
}

const authService = new AuthService();
export default authService;
