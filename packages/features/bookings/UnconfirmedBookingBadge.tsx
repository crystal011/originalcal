import Link from "next/link";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import Badge from "@calcom/ui/v2/core/Badge";

export default function UnconfirmedBookingBadge() {
  const { t } = useLocale();
  const { data: unconfirmedBookingCount } = trpc.useQuery(["viewer.bookingUnconfirmedCount"]);
  if (!unconfirmedBookingCount) return null;
  else
    return (
      <Link href="/bookings/unconfirmed">
        <a title={t("unconfirmed_bookings_tooltip")}>
          <Badge rounded variant="orange" className="hover:bg-orange-800 hover:text-orange-100">
            {unconfirmedBookingCount}
          </Badge>
        </a>
      </Link>
    );
}
