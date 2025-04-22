// src/lib/liveApi.ts
export async function fetchAcceptedLives(userId: string) { 
    try {
      const response = await fetch(`/api/live/sponsored/accepted-lives?userId=${userId}`);
      if (!response.ok) throw new Error("Erro ao buscar lives aceitas");
      return await response.json();
    } catch (error) {
      console.error("Erro no fetchAcceptedLives:", error);
      return [];
    }
  }
  
  export async function acceptLiveInvite(inviteCode: string, userId: string, instagram: string) {
    try {
      const response = await fetch("/api/live/sponsored/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode, userId, instagram }),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Erro no acceptLiveInvite:", error);
      return false;
    }
  }
  