import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar, Image, Eye } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const [events, recentPhotos] = await Promise.all([
    prisma.event.findMany({
      where: { adminId: session!.user!.id },
      include: { _count: { select: { photos: true } }, analytics: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.photo.findMany({
      where: { event: { adminId: session!.user!.id } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { event: { select: { name: true, code: true } } },
    }),
  ]);

  const totalPhotos = events.reduce((s, e) => s + e._count.photos, 0);
  const totalViews  = events.reduce((s, e) => s + (e.analytics?.totalViews || 0), 0);
  const activeEvents = events.filter((e) => e.isActive).length;

  return (
    <div className="p-5 md:p-8 pt-16 md:pt-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading">Dashboard</h1>
          <p className="text-maroon-500 dark:text-maroon-400 mt-0.5 text-sm">
            नमस्कार, {session?.user?.name} 🙏
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 bg-gradient-to-r from-maroon-700 to-saffron-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-maroon-800 hover:to-saffron-700 transition-all shadow-maroon hover:shadow-maroon-lg hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> New Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Events",  value: events.length,  icon: Calendar, from: "from-maroon-600", to: "to-maroon-800",   bg: "bg-maroon-50 dark:bg-maroon-900/30" },
          { label: "Active Events", value: activeEvents,    icon: Calendar, from: "from-green-500",  to: "to-green-700",    bg: "bg-green-50 dark:bg-green-900/20"  },
          { label: "Total Photos",  value: totalPhotos,    icon: Image,    from: "from-gold-500",   to: "to-saffron-600",  bg: "bg-gold-50 dark:bg-gold-900/20"    },
          { label: "Total Views",   value: totalViews,     icon: Eye,      from: "from-saffron-500", to: "to-maroon-600",  bg: "bg-saffron-50 dark:bg-saffron-900/20" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-gold-100 dark:border-maroon-800`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.from} ${stat.to} flex items-center justify-center mb-3 shadow-maroon`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-maroon-800 dark:text-gold-300">{stat.value}</div>
              <div className="text-sm text-maroon-500 dark:text-maroon-400 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Events list or empty state */}
      {events.length === 0 ? (
        <div className="text-center py-20 paithani-card bg-ivory/80 dark:bg-maroon-950/80">
          <div className="text-6xl mb-4">🪷</div>
          <h3 className="font-serif text-xl text-maroon-700 dark:text-gold-300">अजून कोणताही Event नाही</h3>
          <p className="text-maroon-500 mt-2 mb-6 text-sm">पहिली Wedding Gallery तयार करा</p>
          <Link href="/admin/events/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-maroon-700 to-saffron-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-maroon transition-all">
            <Plus className="w-4 h-4" /> Create First Event
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-maroon-800 dark:text-gold-300">Recent Events</h2>
            <Link href="/admin/events" className="text-sm text-gold-600 dark:text-gold-500 hover:text-maroon-700 transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map((event) => (
              <Link
                key={event.id}
                href={`/admin/events/${event.id}`}
                className="block bg-ivory/90 dark:bg-maroon-900/80 rounded-2xl p-5 border-2 border-gold-100 dark:border-maroon-800 hover:border-gold-300 dark:hover:border-gold-700 hover:shadow-gold transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-serif font-semibold text-maroon-800 dark:text-gold-300 truncate">{event.name}</h3>
                    <p className="font-script text-gold-600 dark:text-gold-500">{event.coupleNames}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${event.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-maroon-100 text-maroon-600 dark:bg-maroon-800 dark:text-maroon-400"}`}>
                    {event.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-maroon-500 dark:text-maroon-400 mb-2">
                  <span>{event._count.photos} photos</span>
                  <span>{event.analytics?.totalViews || 0} views</span>
                </div>
                <div className="font-mono text-xs bg-maroon-700 text-gold-300 px-3 py-1 rounded-lg inline-block tracking-widest">
                  {event.code}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent uploads thumbnail strip */}
      {recentPhotos.length > 0 && (
        <div>
          <h2 className="font-serif text-lg font-semibold text-maroon-800 dark:text-gold-300 mb-3">Recent Uploads</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {recentPhotos.map((photo) => (
              <Link key={photo.id} href={`/admin/events/${photo.eventId}`}>
                <div className="aspect-square rounded-xl overflow-hidden bg-maroon-100 dark:bg-maroon-900 hover:scale-105 transition-transform ring-2 ring-transparent hover:ring-gold-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.thumbnailUrl || photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
