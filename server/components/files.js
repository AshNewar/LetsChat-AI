import pgClient from "../database/db.js";

export const getFiles = async (req, res) => {
    try {
        const files = await pgClient.query('SELECT * FROM store');
        res.json(files.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get files" });
    }
};


export const uploadFiles = async(req, res) => {
    try {
      const filename = req.file.originalname;
      const fileUrl = req.file.path;

			await pgClient.query('INSERT INTO store (file_name, file_url) VALUES ($1, $2) RETURNING *',
         [filename, fileUrl]);

      res.json({url:fileUrl, message: 'PDF uploaded successfully' });
      
    } catch (error) {
      console.log(error);
      res.status(500).json({message : "Upload failed" });
    }
};


export const findFile = async(id)=>{
    const fileResult = await pgClient.query('SELECT * FROM store WHERE id = $1', [id]);
    if (fileResult.rowCount === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = fileResult.rows[0];
    return file
}

