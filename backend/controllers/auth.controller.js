const { z } = require("zod");
const authService = require("../services/auth.service");

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await authService.register(validated);

    res.cookie("token", result.token, cookieOptions);
    res.status(201).json({ success: true, data: result.user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      });
    }
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.login(validated);

    res.cookie("token", result.token, cookieOptions);
    res.json({ success: true, data: result.user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      });
    }
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ success: true, message: "Logged out successfully" });
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Failed to get user",
    });
  }
};

module.exports = { register, login, logout, getMe };
