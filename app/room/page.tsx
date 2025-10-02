"use client";
import {
  Bell,
  Home,
  HelpCircle,
  Settings,
  Shield,
  ChartColumn,
  LayoutDashboard,
  Building,
  DoorOpen,
  Mail,
  User,
  LifeBuoy,
  Headphones,
  FileText,
  Lock,
  Loader2,
} from "lucide-react";
import { ExpandableTabs } from "@/app/components/expandable-tabs";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/components/navbar"; // Adjust path if needed
import { Footer } from "@/app/components/footer"; // Adjust path if needed
import {
  Hexagon,
  Github,
  Twitter,
  Search,
  PlusCircle,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input"; // Using shadcn Input
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form, // Import the main Form component
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Imports for shadcn form components
import { toast } from "@/hooks/use-toast"; // Assuming you have this hook setup

// Imports for react-hook-form and Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Interface for API response
interface Room {
  _id: string;
  roomId: string;
  usernames: string[];
  createdAt: string;
  updatedAt: string;
}

const tabs = [
  { title: "Home", icon: <Home size={20} />, href: "/" },
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/dashboard",
  },
  { title: "Room", icon: <DoorOpen size={20} />, href: "/room" },
  { type: "separator" as const },
  { title: "Docs", icon: <FileText size={20} />, href: "/docs" },
  { title: "Support", icon: <LifeBuoy size={20} />, href: "/contact" },
];

// Zod schema for the "Add Users" form validation
const addUsersSchema = z.object({
  roomId: z.string().min(1, { message: "Room ID is required." }),
  usernames: z
    .string()
    .min(1, { message: "Please enter at least one username." })
    .refine((value) => value.split(",").every((u) => u.trim().length > 0), {
      message: "Ensure all usernames are valid and separated by commas.",
    }),
});

export default function RoomPage() {
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  // State to hold the ID selected via creation or search, used for display and pre-filling form
  const [selectedRoomIdForDisplay, setSelectedRoomIdForDisplay] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- Initialize react-hook-form ---
  const form = useForm<z.infer<typeof addUsersSchema>>({
    resolver: zodResolver(addUsersSchema),
    defaultValues: {
      roomId: "",
      usernames: "",
    },
  });

  // --- Effect to update the form's roomId field when selectedRoomIdForDisplay changes ---
  useEffect(() => {
    if (selectedRoomIdForDisplay) {
      form.setValue("roomId", selectedRoomIdForDisplay, {
        shouldValidate: true,
      }); // Update form value
    }
  }, [selectedRoomIdForDisplay, form]);

  // --- Search for rooms as user types ---
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length === 0) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/room?q=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          console.error("Search failed:", await response.text());
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching for rooms:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300); // Debounce search

    // Cleanup timeout on unmount or query change
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // --- Create a new room ---
  const handleCreateRoom = async () => {
    setIsCreatingRoom(true);
    try {
      const response = await fetch("/api/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // You might want to send initial data if needed by your API
        // body: JSON.stringify({ /* initial data */ }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the state used for display and pre-filling the form
        setSelectedRoomIdForDisplay(data.room.roomId);
        toast({
          title: "Room Created",
          description: `Your new room ID is ${data.room.roomId}`,
        });
        // Reset search state if a room is created
        setSearchQuery("");
        setSearchResults([]);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create room",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  // --- Add users to the room (using react-hook-form submit handler) ---
  const handleAddUsersSubmit = async (
    values: z.infer<typeof addUsersSchema>
  ) => {
    // 'values' contains validated form data (roomId, usernames string)
    const usernames = values.usernames
      .split(",")
      .map((username) => username.trim())
      .filter((username) => username.length > 0); // Ensure no empty strings after split/trim

    // Redundant check due to zod refinement, but safe to keep
    if (usernames.length === 0) {
      form.setError("usernames", {
        type: "manual",
        message: "Please provide valid usernames.",
      });
      return;
    }

    try {
      const response = await fetch("/api/room/addUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: values.roomId, // Use validated roomId from form
          usernames,
        }),
      });

      if (response.ok) {
        // const data = await response.json(); // Optional: use data if needed
        toast({
          title: "Users Added",
          description: `Successfully added ${usernames.length} users to room ${values.roomId}`,
        });
        // Navigate to the room page after successful addition
        router.push(`/room/${values.roomId}`);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to add users",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding users:", error);
      toast({
        title: "Error",
        description: "Failed to add users. Please try again.",
        variant: "destructive",
      });
    }
    // No finally block needed to reset loading state, react-hook-form handles isSubmitting
  };

  // --- Handle room selection from search results ---
  const handleRoomSelection = (roomId: string) => {
    setSelectedRoomIdForDisplay(roomId); // Update state (triggers useEffect to update form)
    setSearchQuery(""); // Clear search input
    setSearchResults([]); // Clear search results
  };

  // --- Navigate to a specific room (using button near display ID) ---
  const goToRoom = () => {
    // Use the displayed ID state, which should be synced with the form
    if (selectedRoomIdForDisplay) {
      router.push(`/room/${selectedRoomIdForDisplay}`);
    } else {
      toast({
        title: "No Room Selected",
        description: "Please create or select a room first.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex justify-center items-center mt-3 md:hidden ">
        <ExpandableTabs tabs={tabs} />
      </div>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* --- Room Creation Card --- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Create a Room
              </CardTitle>
              <CardDescription>
                Start a new session to monitor user activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleCreateRoom}
                disabled={isCreatingRoom}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {isCreatingRoom ? "Creating..." : "Create New Room"}
              </Button>

              {/* Display the selected/created Room ID */}
              {selectedRoomIdForDisplay && (
                <div className="p-4 border rounded-md bg-muted">
                  <p className="text-sm font-medium text-muted-foreground">
                    Your Room ID:
                  </p>
                  <div className="flex items-center justify-between mt-1 gap-4">
                    <code className="bg-background p-2 rounded text-lg font-mono break-all flex-1">
                      {selectedRoomIdForDisplay}
                    </code>
                    <Button variant="outline" size="sm" onClick={goToRoom}>
                      Go to Room
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* --- Room Search Card --- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Find a Room</CardTitle>
              <CardDescription>
                Search for existing rooms by their unique ID.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Enter room ID to search..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Display Search Results */}
              {searchLoading && (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground text-sm">Searching...</span>
                </div>
              )}
              {!searchLoading && searchResults.length > 0 && (
                <div className="border rounded-md max-h-48 overflow-y-auto">
                  <ul className="divide-y">
                    {searchResults.map((room) => (
                      <li
                        key={room._id}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <button
                          type="button"
                          className="flex justify-between items-center w-full text-left"
                          onClick={() => handleRoomSelection(room.roomId)}
                        >
                          <div>
                            <p className="font-medium">{room.roomId}</p>
                            <p className="text-sm text-muted-foreground">
                              {room.usernames.length} user
                              {room.usernames.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 pointer-events-none"
                          >
                            {" "}
                            {/* Make button visual only */}
                            Select
                          </Button>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!searchLoading && searchQuery && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  No rooms found matching "{searchQuery}".
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- Add Users Form (Using react-hook-form) --- */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Add Users to Room
            </CardTitle>
            <CardDescription>
              Enter the Room ID and comma-separated usernames to track.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Wrap form elements with shadcn/ui Form component */}
            <Form {...form}>
              {/* Use form.handleSubmit for submission */}
              <form
                onSubmit={form.handleSubmit(handleAddUsersSubmit)}
                className="space-y-6"
              >
                {/* Room ID Field */}
                <FormField
                  control={form.control}
                  name="roomId" // Matches key in addUsersSchema
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room ID</FormLabel>
                      <FormControl>
                        {/* Input is controlled by react-hook-form via {...field} */}
                        <Input
                          placeholder="Create or select a room above"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The unique ID of the room to add users to.
                      </FormDescription>
                      <FormMessage />{" "}
                      {/* Displays validation errors for this field */}
                    </FormItem>
                  )}
                />

                {/* Usernames Field */}
                <FormField
                  control={form.control}
                  name="usernames" // Matches key in addUsersSchema
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usernames</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., user1, another_user, test_user"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter usernames separated by commas.
                      </FormDescription>
                      <FormMessage />{" "}
                      {/* Displays validation errors for this field */}
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting
                    ? "Adding Users..."
                    : "Add Users & Go to Room"}
                </Button>
              </form>
            </Form>{" "}
            {/* End shadcn/ui Form wrapper */}
          </CardContent>
        </Card>
      </main>

      {/* Footer Component */}
      <Footer
        logo={<Hexagon className="h-6 w-6" />}
        brandName="Syntax Sentry"
        socialLinks={[
          {
            icon: <Github className="h-4 w-4" />,
            href: "https://github.com",
            label: "GitHub",
          },
          {
            icon: <Twitter className="h-4 w-4" />,
            href: "https://twitter.com",
            label: "Twitter",
          },
        ]}
        mainLinks={[
          { href: "/", label: "Home" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/room", label: "Rooms" },
          { href: "/docs", label: "Documentation" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
        ]}
        copyright={{
          text: "© 2025 Syntax Sentry. All rights reserved.",
        }}
      />
    </div>
  );
}
