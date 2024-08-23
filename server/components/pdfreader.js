import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings ,ChatOpenAI } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { loadQAMapReduceChain } from "langchain/chains";
import { __dirname } from '../server.js';
import path from "path"

export const queryPdf = async (req, res,query,file) => {
  try {
    const model = new ChatOpenAI({
      modelName:'gpt-3.5-turbo'
    });

    const filePath = path.join(__dirname, file.file_url);

    const loader = new PDFLoader(filePath);

    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 20,
    });
    
    const splittedDocs = await splitter.splitDocuments(docs);
    
    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await HNSWLib.fromDocuments(splittedDocs, embeddings);

    const vectorStoreRetriever = vectorStore.asRetriever();

    const relevantDocs = await vectorStoreRetriever.invoke(query);

    const mapReduceChain = loadQAMapReduceChain(model);

    const result = await mapReduceChain.invoke({
      question: query,
      input_documents: relevantDocs,
    });


    res.status(200).json({result});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Processing failed due to Insufficient Quota' });
  }
};
