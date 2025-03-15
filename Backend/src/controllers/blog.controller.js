import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    likeBlog,
    addComment,
    getComments
} from "../controllers/blog.controller.js";

const router = Router();

router.route("/").post(verifyJWT, upload.single("blogImage"), createBlog);
router.route("/").get(getAllBlogs);
router.route("/:id").get(getBlogById);
router.route("/:id").patch(verifyJWT, upload.single("blogImage"), updateBlog);
router.route("/:id").delete(verifyJWT, deleteBlog);
router.route("/:id/like").patch(verifyJWT, likeBlog);
router.route("/:id/comment").post(verifyJWT, addComment);
router.route("/:id/comments").get(getComments);
export default router;
