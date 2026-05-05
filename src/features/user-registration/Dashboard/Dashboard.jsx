import { Button } from "../../../components/ui/button";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardImg from "../../../assets/dashboard.png";

export default function Dashboard() {
  const isRoomAllotted = false; // later from API
  const navigate = useNavigate();

  return (
    <div className="relative h-full w-full overflow-hidden">
      {" "}
      {/* ================= BACKGROUND ================= */}
      <div
        className={`absolute inset-0 h-full w-full transition-all duration-300 ${
          !isRoomAllotted ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <img
          src={dashboardImg}
          alt="dashboard"
          className="h-full w-full object-cover"
        />
      </div>
      {/* ================= OVERLAY ================= */}
      {!isRoomAllotted && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* LIGHT overlay (not dark) */}
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>

          {/* CENTER CONTENT (NO CARD) */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-xl px-6 space-y-6">
            {/* Icon */}
            <div className="bg-muted border border-border rounded-2xl p-5 shadow-sm">
              <Building2 className="w-8 h-8 text-foreground" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold">No Room Allotted Yet</h2>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              You have not been allotted a room yet. Once your room is assigned,
              the relevant data will be displayed accordingly.
            </p>

            {/* Button */}
            <Button
              className="rounded-full px-8 py-3 text-sm"
              onClick={() => navigate("/user/hostels")}
            >
              Explore Hostels First →
            </Button>

            {/* Bottom Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 w-full">
              <InfoCard
                title="Verified Hostels"
                desc="All rooms are inspected for safety and hygiene standards before allotment."
              />
              <InfoCard
                title="Smart Matching"
                desc="We match roommates based on your lifestyle preferences and study habits."
              />
              <InfoCard
                title="24/7 Assistance"
                desc="Need help with the process? Our support team is always available to assist."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SUB CARD ================= */
const InfoCard = ({ title, desc }) => {
  return (
    <div className="bg-muted/60 border border-border rounded-xl p-4 text-left">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        {desc}
      </p>
    </div>
  );
};
