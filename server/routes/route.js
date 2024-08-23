import { Router } from "express";
import uploadFile from "../utils/multer.js"
import {getFiles, uploadFiles } from "../components/files.js";
import { handleQuery } from "../utils/service.js";

const router = Router();

router.post('/files', getFiles);

router.post('/file/upload', uploadFile.single('file'),uploadFiles);

router.post('/query', handleQuery);

export default router;