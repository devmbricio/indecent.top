export const getUploadUrl = async (fileName: string, contentType: string) => {
    try {
      const response = await fetch("/api/live/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, contentType }),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao gerar URL de upload");
      }
  
      const data = await response.json();
      return data.uploadUrl;
    } catch (error) {
      console.error("Erro ao obter URL de upload:", error);
      return null;
    }
  };
  