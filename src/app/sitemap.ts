import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://scarletthreaduae.com";

    return [
        {
            url: base,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${base}/gifts-for-him`,
            lastModified: new Date(),
            priority: 0.9,
        },
        {
            url: `${base}/gifts-for-her`,
            lastModified: new Date(),
            priority: 0.9,
        },
        {
            url: `${base}/kids-babies`,
            lastModified: new Date(),
            priority: 0.9,
        },
        {
            url: `${base}/seasonal-gifts`,
            lastModified: new Date(),
            priority: 0.9,
        },
        {
            url: `${base}/faith-based`,
            lastModified: new Date(),
            priority: 0.9,
        },
        {
            url: `${base}/gallery`,
            lastModified: new Date(),
            priority: 0.8,
        },
    ];
}