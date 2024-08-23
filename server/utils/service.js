import { findFile } from '../components/files.js';
import { queryPdf } from '../components/pdfreader.js';
import path from 'path';
import { querySql } from '../components/sqlReader.js';


//Its like a middleware to check in which file the user has requested to query

export const handleQuery = async (req, res) => {
  try {
    const { id ,query } = req.body;
    const file = await findFile(id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const ext = path.extname(file.file_name);
    if(ext === ".pdf"){
      return queryPdf(req, res , query, file);
    }
    else if(ext === ".db" || ext === ".sql"){
      return querySql(req, res , query, file);
    }
    else {
      return res.status(400).json({message : "File type not supported"});
    }
    
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Processing failed due to Insufficient Quota' });
    
  }
}
