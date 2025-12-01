import {
  Star,
  Check,
  Folder,
  Unlock,
  Users,
  RefreshCw,
  ArrowRight,
  BadgeCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-md m-[51px] w-full">
        <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-3xl -z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
              <Star className="w-4 h-4" />
              100% Free Forever
            </div>

            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              Completely Free 🎉
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Infrahub is 100% free to use. No hidden fees. No usage limits.
              Just powerful tools for your infrastructure needs.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </span>
                <span className="font-medium flex items-center gap-2">
                  Unlimited Projects <Folder className="w-4 h-4" />
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </span>
                <span className="font-medium flex items-center gap-2">
                  Full Access to All Features <Unlock className="w-4 h-4" />
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </span>
                <span className="font-medium flex items-center gap-2">
                  Community Support <Users className="w-4 h-4" />
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </span>
                <span className="font-medium flex items-center gap-2">
                  Continuous Updates <RefreshCw className="w-4 h-4" />
                </span>
              </li>
            </ul>

            <Link href="/signup">
              <button className="group w-full hover:cursor-pointer py-4 bg-gradient-to-r from-purple-700 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center gap-2">
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 flex items-center justify-center gap-2">
              <BadgeCheck className="w-4 h-4" /> No credit card required • Start
              in seconds <Zap className="w-4 h-4" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
