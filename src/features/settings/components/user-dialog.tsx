import { RiCalendarLine } from "@remixicon/react";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { AuthorizedUser, CreateUserRequest, UserRole } from "../types";

type UserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AuthorizedUser;
  onSubmit: (data: CreateUserRequest) => void;
};

const userRoles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "collector", label: "Collector" },
  { value: "viewer", label: "Viewer" },
];

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const DAYS_PER_YEAR = 365;
const ONE_YEAR_IN_MS = DAYS_PER_YEAR * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export const UserDialog = ({ open, onOpenChange, user, onSubmit }: UserDialogProps) => {
  const form = useForm<CreateUserRequest>({
    defaultValues: {
      email: "",
      role: "viewer",
      accessGranted: new Date(),
      accessExpiration: new Date(Date.now() + ONE_YEAR_IN_MS),
      hasAccess: true,
    },
  });

  // Reset form when user changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (user) {
        // Editing existing user - populate form with user data
        form.reset({
          email: user.email,
          role: user.role,
          accessGranted: user.accessGranted,
          accessExpiration: user.accessExpiration,
          hasAccess: user.hasAccess,
        });
      } else {
        // Adding new user - reset to default values
        form.reset({
          email: "",
          role: "viewer",
          accessGranted: new Date(),
          accessExpiration: new Date(Date.now() + ONE_YEAR_IN_MS),
          hasAccess: true,
        });
      }
    }
  }, [open, user, form]);

  const handleSubmit = (data: CreateUserRequest) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update user access permissions and details." : "Add a new authorized user to the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessGranted"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Access Granted Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          variant="outline"
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <RiCalendarLine className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        mode="single"
                        onSelect={field.onChange}
                        selected={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessExpiration"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Access Expiration Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          variant="outline"
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <RiCalendarLine className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        disabled={(date) => date < new Date()}
                        initialFocus
                        mode="single"
                        onSelect={field.onChange}
                        selected={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasAccess"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Has Access</FormLabel>
                    <div className="text-muted-foreground text-sm">Allow this user to login to the system</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">{user ? "Update User" : "Add User"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
