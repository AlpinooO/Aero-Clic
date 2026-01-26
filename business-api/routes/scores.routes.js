const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const { getRedisClient } = require('../config/redis.config');

// Get all scores (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { userId, limit = 10 } = req.query;
    
    // Try to get from cache first
    const redis = await getRedisClient();
    const cacheKey = `scores:${userId || 'all'}:${limit}`;
    
    if (redis) {
      const cachedScores = await redis.get(cacheKey);
      if (cachedScores) {
        return res.json({ 
          scores: JSON.parse(cachedScores),
          cached: true 
        });
      }
    }

    // Query database
    let query = 'SELECT * FROM scores';
    const params = [];

    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY score DESC LIMIT ?';
    params.push(parseInt(limit));

    const [scores] = await db.query(query, params);

    // Cache results
    if (redis) {
      await redis.setEx(cacheKey, 300, JSON.stringify(scores)); // Cache for 5 minutes
    }

    res.json({ scores, cached: false });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Get top scores (leaderboard)
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const redis = await getRedisClient();
    const cacheKey = `leaderboard:${limit}`;
    
    if (redis) {
      const cachedLeaderboard = await redis.get(cacheKey);
      if (cachedLeaderboard) {
        return res.json({ 
          leaderboard: JSON.parse(cachedLeaderboard),
          cached: true 
        });
      }
    }

    const [leaderboard] = await db.query(
      `SELECT u.username, MAX(s.score) AS best_score,
              COUNT(*) AS games_played
       FROM scores s
       JOIN users u ON s.user_id = u.id
       GROUP BY s.user_id, u.username
       ORDER BY best_score DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    if (redis) {
      await redis.setEx(cacheKey, 60, JSON.stringify(leaderboard)); // Cache for 1 minute
    }

    res.json({ leaderboard, cached: false });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Submit new score
router.post('/', async (req, res) => {
  try {
    const { score, gameId = 1 } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    if (score === undefined) {
      return res.status(400).json({ error: 'Score is required' });
    }

    const [result] = await db.query(
      'INSERT INTO scores (user_id, game_id, score) VALUES (?, ?, ?)',
      [userId, gameId, score]
    );

    // Invalidate cache
    const redis = await getRedisClient();
    if (redis) {
      await redis.del(`scores:${userId}:*`);
      await redis.del('scores:all:*');
      await redis.del('leaderboard:*');
    }

    res.status(201).json({
      message: 'Score submitted successfully',
      scoreId: result.insertId,
      score,
      gameId
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get user's personal best
router.get('/personal-best', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const [result] = await db.query(
      'SELECT MAX(score) as bestScore, COUNT(id) as gamesPlayed, COALESCE(SUM(score), 0) as totalScore FROM scores WHERE user_id = ?',
      [userId]
    );

    res.json({
      bestScore: result[0].bestScore || 0,
      gamesPlayed: result[0].gamesPlayed || 0,
      totalScore: Number(result[0].totalScore) || 0
    });
  } catch (error) {
    console.error('Get personal best error:', error);
    res.status(500).json({ error: 'Failed to fetch personal best' });
  }
});

module.exports = router;
