import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import {
  Wifi,
  Snowflake,
  Bath,
  WashingMachine,
  BookOpen,
  Wrench,
} from "lucide-react";

export default function MyRoom() {
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">My Room</h1>
          <p className="text-muted-foreground text-sm">
            Manage your living space and roommate details
          </p>
        </div>

        <Button className="bg-primary text-primary-foreground">
          Raise Ticket
        </Button>
      </div>

      {/* TOP GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ROOM CARD */}
        <Card className="lg:col-span-2 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
            className="h-52 w-full object-cover"
          />

          <CardContent className="p-5 space-y-4">
            <h2 className="text-xl font-bold">Room 402-B</h2>
            <p className="text-sm text-muted-foreground">
              Deluxe Wing, North Block
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Info label="Floor" value="4th Floor" />
              <Info label="Type" value="Twin Sharing" />
              <Info label="Check-in" value="Aug 12, 2023" />
              <Info label="Status" value="Occupied" />
            </div>
          </CardContent>
        </Card>

        {/* ROOMMATE */}
        <Card>
          <CardContent className="p-5 flex flex-col items-center text-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-20 h-20 rounded-full"
            />

            <h3 className="font-semibold">Sandeep Kumar</h3>
            <p className="text-sm text-muted-foreground">
              B.Tech CSE, 3rd Year
            </p>

            <Button variant="secondary" className="w-full">
              View Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AMENITIES */}
      <div>
        <h2 className="font-semibold mb-3">Room Amenities</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Amenity icon={Wifi} text="High-speed WiFi" />
          <Amenity icon={Snowflake} text="Central AC" />
          <Amenity icon={Bath} text="Attached Washroom" />
          <Amenity icon={WashingMachine} text="Laundry Service" />
          <Amenity icon={BookOpen} text="Study Desk" />
        </div>
      </div>

      {/* BOTTOM */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* MAINTENANCE */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">Maintenance History</h3>

            <Row title="AC Repair" status="Completed" />
            <Row title="Lightbulb Change" status="Pending" />
            <Row title="Drainage Cleaning" status="Completed" />
          </CardContent>
        </Card>

        {/* RULES */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">Room Rules & Guidelines</h3>

            <Rule text="Visitors allowed between 10 AM - 8 PM" />
            <Rule text="No smoking inside rooms" />
            <Rule text="Maintain silence after 11 PM" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */

const Info = ({ label, value }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const Amenity = ({ icon: Icon, text }) => (
  <div className="bg-muted p-4 rounded-lg flex flex-col items-center text-center gap-2">
    <Icon className="w-5 h-5" />
    <p className="text-sm">{text}</p>
  </div>
);

const Row = ({ title, status }) => (
  <div className="flex justify-between text-sm">
    <span>{title}</span>
    <span className="text-muted-foreground">{status}</span>
  </div>
);

const Rule = ({ text }) => (
  <div className="bg-muted p-3 rounded-md text-sm">{text}</div>
);
