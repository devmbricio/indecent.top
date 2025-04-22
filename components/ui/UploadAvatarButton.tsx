interface UploadButtonProps {
  className?: string;  // Propriedade opcional className
  onUploadComplete: (urls: string[]) => void;
  onUploadError: (error: Error) => void;
  endpoint: string;  // Endpoint obrigatório
}

const UploadAvatarButton: React.FC<UploadButtonProps> = ({
  className,
  onUploadComplete,
  onUploadError,
  endpoint,  // A propriedade 'endpoint' é obrigatória
}) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const res = await fetch(`/api/${endpoint}`, {  // Usando o 'endpoint' aqui
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Erro ao obter URL assinada.");
        }

        const { uploadUrl, fileUrl } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) {
          throw new Error("Erro ao fazer upload do arquivo.");
        }

        uploadedUrls.push(fileUrl);  // Adiciona a URL pública ao array
      }

      onUploadComplete(uploadedUrls);  // Retorna apenas as URLs como strings
    } catch (error) {
      console.error("Erro no upload:", error);
      onUploadError(error as Error);
    }
  };

  return (
    <div>
      <input type="file" className={className} multiple onChange={handleFileChange} />
    </div>
  );
};

export default UploadAvatarButton;


/*
interface UploadButtonProps {
  className?: string; // Propriedade opcional className
  endpoint?: string; // Propriedade endpoint agora opcional
  onUploadComplete: (urls: string[]) => void; // Callback para o upload completo
  onUploadError: (error: Error) => void; // Callback para erro no upload
}


const UploadButton: React.FC<UploadButtonProps> = ({
  className,
  endpoint,  // endpoint é agora opcional
  onUploadComplete,
  onUploadError,
}) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];
      const currentEndpoint = endpoint || "defaultEndpoint"; // Usar um valor padrão se endpoint não for fornecido

      const res = await fetch(`/api/upload/${currentEndpoint}`, {
        method: "POST",
        body: JSON.stringify({
          fileName: files[0].name,
          contentType: files[0].type,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Falha ao obter URL assinada.");

      const { uploadUrl, fileUrl } = await res.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: files[0],
        headers: { "Content-Type": files[0].type },
      });

      if (!uploadRes.ok) throw new Error("Falha ao fazer upload do arquivo.");

      uploadedUrls.push(fileUrl);
      onUploadComplete(uploadedUrls); // Chama o callback com a URL do arquivo carregado
    } catch (error) {
      onUploadError(error as Error); // Chama o callback de erro
    }
  };

  return (
    <div>
      <input
        type="file"
        className={className}
        onChange={handleFileChange}
        multiple
      />
    </div>
  );
};


export default UploadButton;
*/

/*
interface UploadButtonProps {
  onUploadComplete: (urls: string[]) => void; // Agora retorna apenas um array de strings
  onUploadError: (error: Error) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onUploadComplete,
  onUploadError,
}) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = []; // Armazena apenas as URLs públicas

      for (const file of Array.from(files)) {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Erro ao obter URL assinada.");
        }

        const { uploadUrl, fileUrl } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) {
          throw new Error("Erro ao fazer upload do arquivo.");
        }

        uploadedUrls.push(fileUrl); // Adiciona a URL pública ao array
      }

      onUploadComplete(uploadedUrls); // Retorna apenas as URLs como strings
    } catch (error) {
      console.error("Erro no upload:", error);
      onUploadError(error as Error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
    </div>
  );
};

export default UploadButton;
*/


/*


interface UploadButtonProps {
  onUploadComplete: (res: { url: string }[]) => void; // Aceitar array de objetos com URLs
  onUploadError: (error: Error) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUploadComplete, onUploadError }) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedFiles: { url: string }[] = [];

      for (const file of Array.from(files)) {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Erro ao obter URL assinada.");
        }

        const { uploadUrl, fileUrl } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) {
          throw new Error("Erro ao fazer upload do arquivo.");
        }

        uploadedFiles.push({ url: fileUrl });
      }

      onUploadComplete(uploadedFiles);
    } catch (error) {
      console.error("Erro no upload:", error);
      onUploadError(error as Error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
    </div>
  );
};

export default UploadButton;



*/
