// app/bet/page.tsx

import CandyBoard from "@/components/CandyBoard";
import JackpotMachine from "@/components/JackpotMachine";
import PowerballMundi from "@/components/PowerBallMundi";


export default function BetPage() {
  return (
    <div className="grid gap-12 p-6">
      {/*<JackpotMachine />
      <CandyBoard />*/}
      <PowerballMundi />

    </div>
  );
}


