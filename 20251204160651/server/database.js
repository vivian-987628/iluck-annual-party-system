const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '../data/annual_party.db'));
    this.init();
  }

  init() {
    // 创建员工表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建签到表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        avatar_url TEXT,
        checkin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
      )
    `);

    // 创建抽奖记录表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS lottery_winners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        prize_level TEXT,
        prize_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
      )
    `);

    // 创建游戏记录表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS game_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        game_type TEXT,
        score INTEGER,
        game_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
      )
    `);
  }

  // 员工管理
  async addEmployee(employee) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO employees (name, department, phone, email) 
        VALUES (?, ?, ?, ?)
      `);
      stmt.run([employee.name, employee.department, employee.phone, employee.email], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...employee });
      });
      stmt.finalize();
    });
  }

  async importEmployees(employees) {
    const results = [];
    for (const emp of employees) {
      try {
        const result = await this.addEmployee(emp);
        results.push(result);
      } catch (error) {
        results.push({ error: error.message, employee: emp });
      }
    }
    return results;
  }

  async getAllEmployees() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM employees ORDER BY department, name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // 签到管理
  async addCheckin(checkinData) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO checkins (employee_id, avatar_url) 
        VALUES (?, ?)
      `);
      stmt.run([checkinData.employeeId, checkinData.avatarUrl], function(err) {
        if (err) reject(err);
        else resolve({ 
          id: this.lastID, 
          ...checkinData,
          checkinTime: new Date()
        });
      });
      stmt.finalize();
    });
  }

  async getCheckinStats() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(DISTINCT c.employee_id) as checked_in_count,
          COUNT(e.id) as total_count,
          e.department,
          COUNT(DISTINCT CASE WHEN c.employee_id IS NOT NULL THEN c.employee_id END) as dept_checked_in
        FROM employees e
        LEFT JOIN checkins c ON e.id = c.employee_id
        GROUP BY e.department
      `;
      this.db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getRecentCheckins(limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.name, e.department, c.avatar_url, c.checkin_time
        FROM checkins c
        JOIN employees e ON c.employee_id = e.id
        ORDER BY c.checkin_time DESC
        LIMIT ?
      `;
      this.db.all(query, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // 抽奖管理
  async getLotteryCandidates(prizeLevel) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT DISTINCT e.id, e.name, e.department, c.avatar_url
        FROM employees e
        JOIN checkins c ON e.id = c.employee_id
        LEFT JOIN lottery_winners lw ON e.id = lw.employee_id
        WHERE c.employee_id IS NOT NULL 
        AND lw.employee_id IS NULL
      `;
      this.db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async recordLotteryWinner(employeeId, prizeLevel) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO lottery_winners (employee_id, prize_level) 
        VALUES (?, ?)
      `);
      stmt.run([employeeId, prizeLevel], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, employeeId, prizeLevel });
      });
      stmt.finalize();
    });
  }

  async getLotteryWinners() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.name, e.department, lw.prize_level, lw.prize_name, lw.created_at
        FROM lottery_winners lw
        JOIN employees e ON lw.employee_id = e.id
        ORDER BY lw.created_at DESC
      `;
      this.db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // 游戏管理
  async recordGameScore(gameData) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO game_records (employee_id, game_type, score) 
        VALUES (?, ?, ?)
      `);
      stmt.run([gameData.employeeId, gameData.gameType, gameData.score], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...gameData });
      });
      stmt.finalize();
    });
  }

  async getGameLeaderboard(gameType, limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.name, e.department, gr.score, gr.game_time
        FROM game_records gr
        JOIN employees e ON gr.employee_id = e.id
        WHERE gr.game_type = ?
        ORDER BY gr.score DESC
        LIMIT ?
      `;
      this.db.all(query, [gameType, limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = Database;