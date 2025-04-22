
import Header from "@/components/Header";

function ReelsPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default ReelsPageLayout;
