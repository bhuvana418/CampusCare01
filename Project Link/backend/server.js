
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { pool, testDatabaseConnection } = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters in .env");
}

app.use(express.json());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==========================================
// AUTHENTICATION
// ==========================================

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      department: user.department,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Login required." });
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied." });
    }

    next();
  };
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    department: user.department,
  };
}

// ==========================================
// COMPLAINT HELPERS
// ==========================================

function normalizeStatus(status) {
  const value = String(status || "").toLowerCase().replace(/[_ ]/g, "");

  const statuses = {
    pending: "Submitted",
    submitted: "Submitted",
    inprogress: "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
  };

  return statuses[value] || status;
}

function publicComplaint(row) {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    username: row.username,
    studentName: row.student_name,
    title: row.title || row.subject,
    subject: row.subject,
    description: row.description,
    category: row.category,
    location: row.location,
    priority: row.priority,
    department: row.department,
    status: normalizeStatus(row.status),
    facultyRemark: row.faculty_remark || row.resolution || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function publicHistory(row) {
  return {
    id: row.id,
    action: row.action,
    status: normalizeStatus(row.new_status),
    oldStatus: normalizeStatus(row.old_status),
    newStatus: normalizeStatus(row.new_status),
    date: row.changed_at,
    remark: row.remarks || "",
    changedBy: row.changed_by_name,
    changedByUsername: row.changed_by_username,
    changedByRole: row.changed_by_role,
  };
}

// ==========================================
// BASIC ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.json({ message: "CampusCare API is running!" });
});

app.get("/api/health", async (req, res) => {
  try {
    await testDatabaseConnection();

    res.json({
      message: "Backend and database connected successfully.",
    });
  } catch (error) {
    console.error("Health check error:", error.message);

    res.status(500).json({
      message: "Database connection failed.",
    });
  }
});

// ==========================================
// REGISTER
// ==========================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, username, password, role, department } = req.body;

    if (!name || !username || !password || !role || !department) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    if (!["student", "faculty"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role.",
      });
    }

    if (
      role === "faculty" &&
      process.env.ALLOW_FACULTY_REGISTRATION !== "true"
    ) {
      return res.status(403).json({
        message: "Faculty registration is currently disabled.",
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO public.users
       (name, username, password_hash, role, department)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, username, role, department`,
      [
        name.trim(),
        cleanUsername,
        passwordHash,
        role,
        department.trim(),
      ]
    );

    const user = publicUser(result.rows[0]);
    const token = createToken(user);

    res.status(201).json({
      message: "Registration successful!",
      token,
      user,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Username already exists. Please choose another.",
      });
    }

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed.",
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        message: "Enter username, password and role.",
      });
    }

    const result = await pool.query(
      `SELECT id, name, username, password_hash, role, department
       FROM public.users
       WHERE username = $1`,
      [username.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const user = result.rows[0];

    if (user.role !== role) {
      return res.status(401).json({
        message: "Selected role does not match this account.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const safeUser = publicUser(user);
    const token = createToken(safeUser);

    res.json({
      message: "Login successful!",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed.",
    });
  }
});

// ==========================================
// GET ALL COMPLAINTS
// ==========================================

app.get("/api/complaints", authenticateToken, async (req, res) => {
  try {
    let result;

    if (req.user.role === "faculty") {
      result = await pool.query(
        `SELECT * FROM public.complaints
         WHERE department = $1
         ORDER BY created_at DESC`,
        [req.user.department]
      );
    } else {
      result = await pool.query(
        `SELECT * FROM public.complaints
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [req.user.id]
      );
    }

    res.json({
      complaints: result.rows.map(publicComplaint),
    });
  } catch (error) {
    console.error("Fetch complaints error:", error);

    res.status(500).json({
      message: "Could not fetch complaints.",
    });
  }
});

// ==========================================
// CREATE COMPLAINT + INITIAL HISTORY
// ==========================================

app.post(
  "/api/complaints",
  authenticateToken,
  requireRole("student"),
  async (req, res) => {
    const client = await pool.connect();

    try {
      const {
        title,
        category,
        location,
        description,
        priority,
        department,
      } = req.body;

      if (
        !title ||
        !category ||
        !location ||
        !description ||
        !priority ||
        !department
      ) {
        return res.status(400).json({
          message: "Please fill in all complaint fields.",
        });
      }

      if (!["Low", "Medium", "High"].includes(priority)) {
        return res.status(400).json({
          message: "Invalid priority.",
        });
      }

      const ticketId =
        "CC-" + crypto.randomBytes(4).toString("hex").toUpperCase();

      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO public.complaints
         (
           ticket_id,
           user_id,
           username,
           student_name,
           title,
           subject,
           category,
           location,
           description,
           priority,
           department,
           status,
           faculty_remark
         )
         VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          ticketId,
          req.user.id,
          req.user.username,
          req.user.name,
          title.trim(),
          category,
          location.trim(),
          description.trim(),
          priority,
          department,
          "Submitted",
          "",
        ]
      );

      const complaint = result.rows[0];

      await client.query(
        `INSERT INTO public.complaint_history
         (complaint_id, old_status, new_status, changed_by, remarks)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          complaint.id,
          null,
          "Submitted",
          req.user.id,
          "Complaint submitted by student.",
        ]
      );

      await client.query("COMMIT");

      res.status(201).json({
        message: "Complaint submitted successfully!",
        complaint: publicComplaint(complaint),
      });
    } catch (error) {
      await client.query("ROLLBACK");

      console.error("Create complaint error:", error);

      res.status(500).json({
        message: "Could not submit complaint.",
      });
    } finally {
      client.release();
    }
  }
);

// ==========================================
// TRACK COMPLAINT + COMPLETE HISTORY
// ==========================================

app.get(
  "/api/complaints/:ticketId",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM public.complaints
         WHERE ticket_id = $1`,
        [req.params.ticketId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Complaint not found.",
        });
      }

      const complaint = result.rows[0];

      const isOwner = complaint.user_id === req.user.id;

      const isFaculty =
        req.user.role === "faculty" &&
        complaint.department === req.user.department;

      if (!isOwner && !isFaculty) {
        return res.status(403).json({
          message: "Access denied.",
        });
      }

      const historyResult = await pool.query(
        `SELECT
           h.id,
           h.old_status,
           h.new_status,
           h.changed_at,
           h.remarks,
           u.name AS changed_by_name,
           u.username AS changed_by_username,
           u.role AS changed_by_role
         FROM public.complaint_history h
         JOIN public.users u ON h.changed_by = u.id
         WHERE h.complaint_id = $1
         ORDER BY h.changed_at ASC`,
        [complaint.id]
      );

      res.json({
        complaint: {
          ...publicComplaint(complaint),
          history: historyResult.rows.map(publicHistory),
        },
      });
    } catch (error) {
      console.error("Track complaint error:", error);

      res.status(500).json({
        message: "Could not track complaint.",
      });
    }
  }
);

// ==========================================
// FACULTY UPDATE + HISTORY
// ==========================================

app.patch(
  "/api/complaints/:ticketId",
  authenticateToken,
  requireRole("faculty"),
  async (req, res) => {
    const client = await pool.connect();

    try {
      const { status, facultyRemark } = req.body;

      const allowedStatuses = [
        "Submitted",
        "In Progress",
        "Resolved",
        "Rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid complaint status.",
        });
      }

      await client.query("BEGIN");

      const existingResult = await client.query(
        `SELECT * FROM public.complaints
         WHERE ticket_id = $1
           AND department = $2
         FOR UPDATE`,
        [req.params.ticketId, req.user.department]
      );

      if (existingResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          message: "Complaint not found in your department.",
        });
      }

      const existingComplaint = existingResult.rows[0];

      const oldStatus = normalizeStatus(existingComplaint.status);
      const remark = (facultyRemark || "").trim();

      const updateResult = await client.query(
        `UPDATE public.complaints
         SET status = $1,
             faculty_remark = $2,
             resolution = $2,
             updated_at = NOW()
         WHERE ticket_id = $3
         RETURNING *`,
        [status, remark, req.params.ticketId]
      );

      const updatedComplaint = updateResult.rows[0];

      await client.query(
        `INSERT INTO public.complaint_history
         (complaint_id, old_status, new_status, changed_by, remarks)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          updatedComplaint.id,
          oldStatus,
          status,
          req.user.id,
          remark || `Complaint status changed to ${status}.`,
        ]
      );

      await client.query("COMMIT");

      res.json({
        message: "Complaint updated successfully!",
        complaint: publicComplaint(updatedComplaint),
      });
    } catch (error) {
      await client.query("ROLLBACK");

      console.error("Update complaint error:", error);

      res.status(500).json({
        message: "Could not update complaint.",
      });
    } finally {
      client.release();
    }
  }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, async () => {
  console.log(`CampusCare backend running at http://localhost:${PORT}`);

  try {
    await testDatabaseConnection();

    console.log("Supabase PostgreSQL database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
});
