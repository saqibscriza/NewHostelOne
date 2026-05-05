import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import {
  CheckCircle,
  Users,
  Calendar,
  Wifi,
  Snowflake,
  Wrench,
  CreditCard,
  MessageSquare,
} from "lucide-react";

export default function My_Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Sandeep</h1>
        <p className="text-muted-foreground">
          Manage your dashboard and daily operations easily
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Monthly Fee" value="Paid" icon={CheckCircle} />
        <StatCard title="Room Occupancy" value="1/2" icon={Users} />
        <StatCard title="Attendance" value="95%" icon={Calendar} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* MENU */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Today's Menu</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Wednesday, Oct 25th
                </p>
              </div>

              <Button className="bg-primary text-primary-foreground">
                View Weekly Menu
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <MenuItem
                label="Breakfast"
                time="8:00 - 10:00"
                text="Scrambled Eggs, Whole Wheat Toast, Coffee"
              />
              <MenuItem
                label="Lunch"
                time="13:00 - 15:00"
                text="Grilled Lemon Chicken, Organic Quinoa, Seasonal Salad"
              />
              <MenuItem
                label="Dinner"
                time="20:00 - 22:00"
                text="Vegetable Lasagna, Roasted Garlic Bread"
              />
            </CardContent>
          </Card>

          {/* BOTTOM CARDS */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* PAYMENT */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Next Payment Due</h3>
                <p className="text-muted-foreground text-sm">
                  Maintain your residency status.
                </p>

                <h2 className="text-2xl font-bold">₹8,500</h2>
                <p className="text-red-500 text-sm">Due: Oct 1st</p>

                <Button>Pay Now</Button>
              </CardContent>
            </Card>

            {/* ROOM */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Room 402-B</h3>

                <div className="flex items-center gap-2 text-sm">
                  <Wifi size={16} /> High-speed WiFi
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Snowflake size={16} /> Central AC
                </div>

                <p className="text-sm text-muted-foreground">
                  Roommate: Vacant
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* NOTICES */}
          <Card>
            <CardHeader>
              <CardTitle>Notices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Mess closed for maintenance</p>
              <p>New laundry schedule available</p>
              <p>Library hours extended</p>
            </CardContent>
          </Card>

          {/* ACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <ActionBtn icon={Wrench} text="Request Maintenance" />
              <ActionBtn icon={CreditCard} text="Pay Fees" />
              <ActionBtn icon={MessageSquare} text="Give Feedback" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardContent className="flex items-center justify-between p-5">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>
      <Icon className="w-6 h-6 text-primary" />
    </CardContent>
  </Card>
);

const MenuItem = ({ label, time, text }) => (
  <div className="flex gap-4">
    <div className="w-24 text-sm text-muted-foreground">
      <p className="font-medium">{label}</p>
      <p>{time}</p>
    </div>

    <div className="flex-1 bg-muted p-3 rounded-md text-sm">
      {text}
    </div>
  </div>
);

const ActionBtn = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent transition">
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </div>
);

