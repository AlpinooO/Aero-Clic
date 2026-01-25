const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ScoreService {
  getToken() {
    return localStorage.getItem('token');
  }

  async submitScore(gameId, score, level) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/scores`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ game_id: gameId, score, level }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit score');
      }

      return data;
    } catch (error) {
      console.error('Submit score error:', error);
      throw error;
    }
  }

  async getLeaderboard(limit = 10) {
    try {
      const response = await fetch(`${API_URL}/api/scores/leaderboard?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }

      return data.leaderboard || [];
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }

  async getPersonalBest() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/scores/personal-best`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch personal best');
      }

      return data;
    } catch (error) {
      console.error('Get personal best error:', error);
      throw error;
    }
  }

  async getUserScores(userId, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/api/scores?userId=${userId}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user scores');
      }

      return data.scores || [];
    } catch (error) {
      console.error('Get user scores error:', error);
      throw error;
    }
  }

  async startGameSession() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/game/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start game session');
      }

      return data;
    } catch (error) {
      console.error('Start game session error:', error);
      throw error;
    }
  }

  async endGameSession() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/game/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to end game session');
      }

      return data;
    } catch (error) {
      console.error('End game session error:', error);
      throw error;
    }
  }
}

const scoreService = new ScoreService();
export default scoreService;
