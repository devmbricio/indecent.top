// admin/master.tsx
"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

type UserRewards = {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  postRewards: number;
  storyRewards: number;
  affiliateRewards: number;
  totalCredits: number;
};

export const AdminPanel: React.FC = () => {
  const [userRewards, setUserRewards] = useState<UserRewards[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch rewards data
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const response = await axios.get<UserRewards[]>(
          "/off/admin/api/calculate"
        );
        setUserRewards(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de recompensas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  // Trigger rewards transfer
  const handleTransfer = async () => {
    try {
      setLoading(true);
      await axios.post("/off/admin/api/distribute");
      alert("Recompensas transferidas com sucesso!");
    } catch (error) {
      console.error("Erro ao transferir recompensas:", error);
      alert("Erro na transferência");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-20">
      <h1>Administração de Recompensas</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table border={1} style={{ width: "100%", margin: "20px 0" }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Carteira</th>
              <th>Por Posts</th>
              <th>Por Stories</th>
              <th>Por Afiliados</th>
              <th>Total de Créditos</th>
            </tr>
          </thead>
          <tbody>
            {userRewards.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.walletAddress}</td>
                <td>{user.postRewards}</td>
                <td>{user.storyRewards}</td>
                <td>{user.affiliateRewards}</td>
                <td>{user.totalCredits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleTransfer} disabled={loading}>
        Transferir Recompensas
      </button>
    </div>
  );
};

export default AdminPanel;
