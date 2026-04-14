import express from 'express'
import { changePassword, deleteUser, GetAllUsers, GetUserChange, getUserDetails, profile, updateUser } from '../Controllers/userController.js';
import { authMiddleware, authorizeRoles } from '../Middleware/AuthMiddleware.js';
import { requestPasswordReset, resetPassword } from '../Controllers/auth.js';
const router2 = express.Router();
// router2.get("/profile", authMiddleware, profile);
router2.put(
  "/user/:id",
  authMiddleware,
  authorizeRoles("user", "admin"),
  updateUser
);
router2.delete(
  "/user/delete/:id",
  authMiddleware,
  authorizeRoles("user", "admin"),
  deleteUser
);
router2.get("/user", authMiddleware, authorizeRoles("admin"), GetAllUsers); //used by admin o get all user
router2.get(
  "/userdetails",
  authMiddleware,
  authorizeRoles("admin", "user"),
  getUserDetails
);
router2.put(
  "/changepassword",
  authMiddleware,
  authorizeRoles("admin", "user"),
  changePassword
);
router2.get("/userchange",authMiddleware,authorizeRoles("admin"), GetUserChange)
//testtt
router2.post('/request-reset', requestPasswordReset);
router2.post('/reset-password/:token', resetPassword);

export default router2;