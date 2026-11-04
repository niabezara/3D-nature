const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "28 Oct 2026". UTC so server and browser always agree. */
export const formatDate = (iso: string) => fmt.format(new Date(iso));
