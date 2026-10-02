// Routes from the old Gatsby site, kept alive so existing links and search
// results land somewhere useful. Built as small meta-refresh pages, because
// the static host has no server-side redirect rules.
const cobalt = "https://www.cobaltcounsel.com";

module.exports = [
  { from: "/team/", to: "/#team" },
  { from: "/sitemap/", to: "/" },
  { from: "/learn/policy-research/", to: "/learn/" },
  { from: "/policysaurus/", to: `${cobalt}/policysaurus/` },
  { from: "/policysaurus/diversity/", to: `${cobalt}/policysaurus/hrpolicies/` },
  { from: "/policysaurus/privacyandcybersecurity/", to: `${cobalt}/policysaurus/privacyandcybersecurity/` },
  { from: "/policysaurus/sustainability/", to: `${cobalt}/policysaurus/sustainability/` },
];
