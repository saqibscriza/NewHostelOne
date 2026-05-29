import React, { useState, useEffect } from "react";
import { Menu, Bell, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../theme/ThemeToggle";
import {
  Getadminswitchaccount,
  getAdminProfileApi,
  selectHostelApi,
} from "../../utils/utils";

const getFirstValue = (source, keys) => {
  for (const key of keys) {
    const value = key.split(".").reduce((acc, part) => acc?.[part], source);
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase() || "U";
};

const Topbar = ({ onMenuClick }) => {
  const { role, token, login, userName, userPhoto, updateUserProfile } =
    useAuth(); // get role from context
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // modal
  const [hostels, setHostels] = useState([]);
  const [hostelLoading, setHostelLoading] = useState(false);
  const [switchingHostelId, setSwitchingHostelId] = useState("");

  const [user, setUser] = useState("");
  const [roleName, setRoleName] = useState("");
  console.log("user role-------", roleName);
  // const [userImage, setUserImage] = useState("");
  const [hostelName, setHostelName] = useState(
    sessionStorage.getItem("selectedHostelName") || "",
  );
  useEffect(() => {
    const storedHostelName = sessionStorage.getItem("selectedHostelName");

    if (storedHostelName) {
      setHostelName(storedHostelName);
    }
  }, []);

  const [hostelError, setHostelError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const showPackageBanner =
    role === "admin" && location.pathname !== "/admin/packages";
  // console.log("ROLE:", role);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const fetchProfileName = async () => {
      if (!role || !sessionStorage.getItem("token")) return;

      try {
        const response = await getAdminProfileApi();

        const data = response?.data;

        console.log("TOPBAR PROFILE DATA", data);

        const activeHostelName = sessionStorage.getItem("selectedHostelName");

        setHostelName(activeHostelName || data?.hostelName);

        const displayName = getFirstValue(data, [
          "profile.name",
          "profile.fullName",
          "profile.adminName",
          "profile.studentName",
          "profile.chefName",
          "data.name",
          "data.fullName",
          "data.studentName",
          "data.adminName",
          "data.chefName",
          "name",
          "fullName",
          "studentName",
          "adminName",
          "chefName",
        ]);

        const displayPhoto = getFirstValue(data, [
          "profile.photo",
          "profile.image",
          "profile.profileImage",
          "profile.avatar",

          "data.photo",
          "data.image",
          "data.profileImage",
          "data.avatar",

          "photo",
          "image",
          "profileImage",
          "avatar",
        ]);

        setUser(displayName || "User");

        // ROLE LABEL
        if (role === "admin") {
          setRoleName("ADMIN");
        } else if (role === "student") {
          setRoleName("STUDENT");
        } else if (role === "chef") {
          setRoleName("CHEF");
        } else {
          setRoleName("USER");
        }

        updateUserProfile({
          name: displayName,
          ...(displayPhoto ? { photo: displayPhoto } : {}),
        });
      } catch (error) {
        console.log("PROFILE FETCH ERROR", error);
      }
    };
    fetchProfileName();
  }, [role, token, updateUserProfile]);

  const fetchHostelsForSwitch = async () => {
    if (!sessionStorage.getItem("token")) {
      setHostelError("Session expired. Please login again.");
      return;
    }

    setHostelLoading(true);
    setHostelError("");

    const response = await Getadminswitchaccount();

    if (response?.data?.status === "success" || response?.data) {
      const hostelList =
        response?.data?.hostels || response?.data?.data || response?.data || [];
      setHostels(hostelList);
    } else {
      setHostelError(response?.data?.message || "Failed to load hostel list.");
    }

    setHostelLoading(false);
  };

  const openSwitchAccountModal = async () => {
    setShowModal(true);
    setHostels([]);
    await fetchHostelsForSwitch();
  };

  const handleHostelSelect = async (hostelId) => {
    const selectionToken =
      sessionStorage.getItem("hostelSelectionToken") ||
      sessionStorage.getItem("token");

    if (!selectionToken) {
      setHostelError("Session expired. Please login again.");
      return;
    }

    setHostelError("");
    setSwitchingHostelId(String(hostelId));

    const response = await selectHostelApi(String(hostelId), selectionToken);

    if (response?.data?.status === "success") {
      const newToken = response?.data?.token;

      const selectedHostelData = hostels.find(
        (item) => String(item.hostelId) === String(hostelId),
      );

      sessionStorage.setItem("hostelSelectionToken", selectionToken);

      sessionStorage.setItem("selectedHostel", String(hostelId));
      window.dispatchEvent(new Event("hostelChanged"));

      if (selectedHostelData?.hostelName) {
        sessionStorage.setItem(
          "selectedHostelName",
          selectedHostelData.hostelName,
        );

        setHostelName(selectedHostelData.hostelName);
      }

      login(role, newToken, userName);

      setShowModal(false);

      navigate("/admin");
    } else {
      setHostelError(response?.data?.message || "Failed to switch hostel.");
    }

    setSwitchingHostelId("");
  };

  return (
    <>
      <header className="relative flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
        {/* LEFT */}

        {/* left Section */}

        <div className="flex items-center gap-3 w-full">
          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </button>

          {/* <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-muted border-none text-foreground"
            />
          </div> */}
        </div>

        {showPackageBanner && (
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background/90 px-4 py-2 shadow-sm backdrop-blur">
              <p className="text-sm text-foreground">
                Package - <span className="font-semibold">Free Tier</span>
              </p>
              <button
                className="text-sm font-medium text-primary transition hover:opacity-80"
                onClick={() => navigate("/admin/packages")}
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* dark mode button */}

          {/* <ThemeToggle /> */}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            {/* Notification Dot */}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
          </Button>

          {/* TEXT */}
          <div className="text-right min-w-[140px]">
            <p className="text-sm font-semibold text-foreground leading-tight whitespace-nowrap">
              {user || "User"}
            </p>

            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium whitespace-nowrap">
              {roleName || "USER"}
            </p>

            {role === "admin" && (
              <p className="text-[11px] text-muted-foreground whitespace-nowrap truncate max-w-[140px]">
                {hostelName || "Hostel"}
              </p>
            )}
          </div>

          {/* USER */}

          <div
            className="flex items-center gap-2 relative cursor-pointer profile-menu"
            onClick={() => setOpen(!open)}
          >
            <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName || "Profile"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-foreground">
                  {getInitials(user || userName)}
                </span>
              )}
            </div>
            {role === "admin" && open && (
              <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-lg shadow-md p-2 z-50">
                <div
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded cursor-pointer"
                  onClick={() => {
                    navigate("/admin/profile");
                    setOpen(false);
                  }}
                >
                  Profile
                </div>

                <div
                  className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded cursor-pointer"
                  onClick={() => {
                    openSwitchAccountModal();
                    setOpen(false); // close dropdown
                  }}
                >
                  Switch Account
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card w-[440px] rounded-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 text-xl text-foreground"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="mb-5 text-2xl font-semibold text-foreground">
              Hostel Details
            </h2>
            <div className="space-y-4">
              {hostelError ? (
                <p className="text-sm text-destructive">{hostelError}</p>
              ) : null}

              {hostelLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading hostels...
                </p>
              ) : null}

              {!hostelLoading && hostels.length > 0 ? (
                <div className="space-y-3">
                  {hostels.map((hostel) => {
                    const hostelId = String(hostel.hostelId);
                    const isActive =
                      sessionStorage.getItem("selectedHostel") === hostelId;
                    const isSwitching = switchingHostelId === hostelId;

                    return (
                      <button
                        key={hostelId}
                        type="button"
                        onClick={() => handleHostelSelect(hostelId)}
                        disabled={Boolean(switchingHostelId)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                          isActive
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/40"
                        } ${isSwitching ? "opacity-70" : ""}`}
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
{hostel.hostelImages ? (
  <img
    src={hostel.hostelImages}
    alt={hostel.hostelName || hostel.name || "Hostel"}
    className="h-full w-full object-cover"
  />
) : (
  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
    <MapPin className="h-5 w-5" />
  </div>
)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold leading-6 text-foreground">
                              {hostel.hostelName ||
                                hostel.name ||
                                `Hostel ${hostelId}`}
                            </p>
                            {isActive ? (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                Current
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                            {hostel.address || "Address not available"}
                          </p>
                          {isSwitching ? (
                            <p className="mt-1 text-xs text-primary">
                              Switching hostel...
                            </p>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {!hostelLoading && hostels.length === 0 && !hostelError ? (
                <p className="text-sm text-muted-foreground">
                  No hostels found for this account.
                </p>
              ) : null}
            </div>

            <Button
              className="mt-6"
              onClick={() => {
                setShowModal(false);
                navigate("hostel/add");
              }}
            >
              + Add New Hostel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
