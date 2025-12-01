import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, User, Mail, Building } from "lucide-react";
import { auth } from "@/auth";
import { AvatarUpload } from "@/components/AvatarUpload";
import { updateProfile } from "@/lib/db";

type UserWithCompany = {
  name?: string;
  email?: string;
  image?: string;
  company?: string;
};

export default async function ProfileSettings() {
  const session = await auth();
  const user = session?.user as UserWithCompany | undefined;

  const name = user?.name;
  const email = user?.email;
  const company = user?.company;
  const image = user?.image;

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
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
          <div className="flex justify-center">
            <AvatarUpload currentImage={image} name={name ?? ""} />
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
    </div>
  );
}
