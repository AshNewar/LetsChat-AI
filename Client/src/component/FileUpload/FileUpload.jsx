import React, { useEffect, useRef, useState } from "react";
import { IoCloudUploadOutline , IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { GoIssueClosed } from "react-icons/go";
import "./FileUpload.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
  const inputRef = useRef();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [files, setFiles] = useState([]);

  const handleChat = (fileId) => {
    try {
      if(fileId){
        navigate(`/chat/${fileId}`);
      }
    } catch (error) {
      console.error(error , "Select Files");
    }

  }

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus("select");
  };

  const handleUpload = async () => {
    if (uploadStatus === "done") {
      clearFileInput();
      return;
    }

    try {
      setUploadStatus("uploading");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "http://localhost:8000/api/file/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      setUploadStatus("done");
      getFiles();
    } catch (error) {
      setUploadStatus("select");
    }
  };

  const getFiles = async () => {
    try {
      console.log("Fetching Files")
      const response = await axios.post("http://localhost:8000/api/files");
      setFiles(response.data);
    } catch (error) {
      console.error(error);
  }
}

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div className="section">
      <div className="header">
        <h2>Lets Chat</h2>
        <p>Upload Your PDF or SQL File to Chat</p>
      </div>
     
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Button to trigger the file input dialog */}
      {!selectedFile && (
        <button className="file-btn" onClick={onChooseFile}>
          <IoCloudUploadOutline size={36} /> Upload File
        </button>
      )}

      {selectedFile && (
        <>
          <div className="file-card">
           <FaRegFileAlt size={28}/>

            <div className="file-info">
              <div style={{ flex: 1 }}>
                <h6>{selectedFile?.name.substring(0, 20)+" . . ."}</h6>

                <div className="progress-bg">
                  <div className="progress" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {uploadStatus === "select" ? (
                <button onClick={clearFileInput}>
                  <IoIosCloseCircleOutline size={30}/>
                </button>
              ) : (
                <div className="check-circle">
                  {uploadStatus === "uploading" ? (
                    `${progress}%`
                  ) : uploadStatus === "done" ? (
                    <GoIssueClosed size={30}/>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          <button className="upload-btn" onClick={handleUpload}>
            {uploadStatus === "select" || uploadStatus === 'uploading' ? "Upload" : "Done"}
          </button>
        </>
      )}

      <div className="file-container">
        {files.map((file) => (
          <div className="file-card" key={file.id} onClick={() => handleFileSelect(file.id)}>
            <FaRegFileAlt size={26}/>
            

            <div className="file-info">
              <h6>{file.file_name}</h6>
              <button onClick={()=>handleChat(file.id)}>
                <IoChatboxEllipsesOutline size={26}/>
              </button>
            </div>
          </div>
        ))}
        

      </div>
    </div>
  );
};

export default FileUpload;