import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  User,
  Mail,
  Building,
  Shield,
  Key,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { updateProfile, updatePassword } from "@/actions/profile";
import { auth } from "@/auth";
import { AvatarUpload } from "@/components/AvatarUpload";

type UserWithCompany = {
  name?: string;
  email?: string;
  image?: string;
  company?: string;
};

export default async function ProfileSettings() {
  const session = await auth();
  const user = session?.user as UserWithCompany | undefined;

  const name = user?.name ?? "John Doe";
  const email = user?.email ?? "john@example.com";
  const company = user?.company ?? "Acme Inc";
  const image = user?.image ?? "";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your account information and security preferences
          </p>
          <div className="flex justify-center md:justify-start gap-2 mt-4 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Account Verified
            </Badge>
            <Badge variant="outline">Member since 2024</Badge>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-6 text-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <User className="w-6 h-6" />
              <div>
                <CardTitle className="text-xl text-white font-semibold">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Update profile details and avatar
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <form
            action={async (formData: FormData) => {
              "use server";
              const data = {
                name: formData.get("name")?.toString() ?? "",
                email: formData.get("email")?.toString() ?? "",
                company: formData.get("company")?.toString() ?? "",
              };
              await updateProfile(data);
            }}
            className="p-8 flex flex-col gap-6"
          >
            {/* Avatar at Top */}
            <div className="flex justify-center">
              <AvatarUpload currentImage={image} name={name} />
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={name}
                  className="h-12 border-2 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={email}
                  className="h-12 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <Building className="w-4 h-4 text-muted-foreground" />
                Company
              </Label>
              <Input
                id="company"
                name="company"
                defaultValue={company}
                className="h-12 border-2 focus:border-blue-500 transition-colors"
              />
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white h-12 px-6 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </Button>
              <Button type="button" variant="outline" className="h-12 px-6">
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Security Card */}
        <Card className="shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-6 text-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <Shield className="w-6 h-6" />
              <div>
                <CardTitle className="text-xl font-semibold">
                  Security Settings
                </CardTitle>
                <CardDescription className="text-emerald-100">
                  Manage your password and account security
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <form
            action={async (formData: FormData) => {
              "use server";
              const data = {
                currentPassword:
                  formData.get("currentPassword")?.toString() ?? "",
                newPassword: formData.get("newPassword")?.toString() ?? "",
                confirmPassword:
                  formData.get("confirmPassword")?.toString() ?? "",
              };
              await updatePassword(data);
            }}
            className="p-8 space-y-6"
          >
            {/* Security Status */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                  Account Security Status
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Your account is secure. Last password change: 30 days ago
                </p>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="currentPassword"
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  <Key className="w-4 h-4 text-muted-foreground" /> Current
                  Password
                </Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="h-12 border-2 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-semibold">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="h-12 border-2 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="h-12 border-2 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Password
                Requirements
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Includes at least one number</li>
                <li>• Contains at least one special character</li>
              </ul>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white h-12 px-6 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> Update Password
              </Button>
              <Button type="button" variant="outline" className="h-12 px-6">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
