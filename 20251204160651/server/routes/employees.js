const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const router = express.Router();
const Database = require('../database');

const db = new Database();

// 配置文件上传
const upload = multer({ dest: 'uploads/' });

// 获取所有员工
router.get('/', async (req, res) => {
  try {
    const employees = await db.getAllEmployees();
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加单个员工
router.post('/', async (req, res) => {
  try {
    const employee = await db.addEmployee(req.body);
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 批量导入员工
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '请上传Excel文件' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const employees = data.map(row => ({
      name: row['姓名'] || row['name'],
      department: row['部门'] || row['department'],
      phone: row['电话'] || row['phone'],
      email: row['邮箱'] || row['email']
    })).filter(emp => emp.name && emp.department);

    const results = await db.importEmployees(employees);
    
    res.json({ 
      success: true, 
      message: `成功导入 ${results.filter(r => !r.error).length} 名员工`,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取签到统计
router.get('/checkin/stats', async (req, res) => {
  try {
    const stats = await db.getCheckinStats();
    const recent = await db.getRecentCheckins();
    
    res.json({ 
      success: true, 
      data: {
        stats,
        recentCheckins: recent
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;