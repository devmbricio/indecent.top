export function generateFileUrl(fileName: string): string {
    //const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "d72slz63e5c7n.cloudfront.net";
    const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN || "cdn.indecent.top";

    return `https://${cloudFrontDomain}/videos/${fileName}`;
  }
  