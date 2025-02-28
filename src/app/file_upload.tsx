const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
  
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    console.log("Uploaded File:", data);
  };
  