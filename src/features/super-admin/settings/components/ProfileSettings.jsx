import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

export default function ProfileSettings() {
  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Full Name" />
          <Input placeholder="Email Address" />
        </div>

        <Button className="bg-primary text-primary-foreground hover:opacity-90">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
