import { ChatOpenAI } from "@langchain/openai";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import path from "path"

export const querySql = async(req, res, query ,file )=>{
  try {
    const filePath = path.join(__dirname, file.file_url);
    
    const datasource = new DataSource({
      type: "sqlite",
      database: filePath ,
    });

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
    });
    
    const llm = new ChatOpenAI({
      modelName:'gpt-3.5-turbo'
    });

    const chain = await createSqlQueryChain({
      llm,
      db,
      dialect: "sqlite",
    });
    
    const response = await chain.invoke({
      question: query,
    });

    const result = await db.run(response);

    res.status(200).json({result});

  } catch (error) {

    console.error(error);
    res.status(500).json({message : "Processing failed due to Insufficient Quota"});
    
  }
}