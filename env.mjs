import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    JWT_SECRET: z.string().min(1),
    UPLOADTHING_SECRET: z.string().min(1),
    UPLOADTHING_APP_ID: z.string().min(1),
    STUDIO_TOKEN: z.string().min(1),
    NEXTAUTH_URL: z.string().url().optional(),
    AUTH_SECRET: z.string().min(1),
    GOOGLE_ID: z.string().min(1),
    GOOGLE_SECRET: z.string().min(1),
    GITHUB_OAUTH_TOKEN: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    STREAM_SECRET_KEY: z.string().min(1),


    INDECENT_ADMINISTRADOR: z.string().min(1),

    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_BUCKET_NAME: z.string().min(1),
    AWS_IVS_PLAYBACK_KEY: z.string().min(1),
    AWS_IVS_PLAYBACK_KEY_ID: z.string().min(1),
    AWS_IVS_INGEST_ENDPOINT: z.string().min(1),

    AWS_IVS_CHANNEL_ARN: z.string().min(1),
    AWS_IVS_PLAYBACK_URL: z.string().min(1),
    AWS_IVS_STREAM_KEY: z.string().min(1),

    //AGORA_APP_ID: z.string().min(1),
    //AGORA_APP_CERTIFICATE: z.string().min(1),

    CLOUDFRONT_DOMAIN: z.string().min(1),
    
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
      },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    
    NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID: z.string().min(1),

    NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID: z.string().min(1),

    NEXT_PUBLIC_STRIPE_30MIN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_100MIN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_300MIN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_500MIN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_1000MIN_ID: z.string().min(1),

    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STREAM_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    JWT_SECRET: process.env.JWT_SECRET,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    STUDIO_TOKEN: process.env.STUDIO_TOKEN,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GITHUB_OAUTH_TOKEN: process.env.GITHUB_OAUTH_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
 
    INDECENT_ADMINISTRADOR: process.env.INDECENT_ADMINISTRADOR,

    AWS_IVS_CHANNEL_ARN: process.env.AWS_IVS_CHANNEL_ARN,
    AWS_IVS_PLAYBACK_URL: process.env.AWS_IVS_PLAYBACK_URL,
    AWS_IVS_STREAM_KEY: process.env.AWS_IVS_STREAM_KEY,
    AWS_IVS_PLAYBACK_KEY: process.env.AWS_IVS_PLAYBACK_KEY,
    AWS_IVS_PLAYBACK_KEY_ID: process.env.AWS_IVS_PLAYBACK_KEY_ID,
    AWS_IVS_INGEST_ENDPOINT: process.env.AWS_IVS_INGEST_ENDPOINT,

    //AGORA_APP_ID: process.env.AGORA_APP_ID,
    //AGORA_APP_CERTIFICATE: process.env.AGORA_APP_ID,

    CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN,

    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,

    NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID: process.env. NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID,

    NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID,

    NEXT_PUBLIC_STRIPE_30MIN_ID:  process.env.NEXT_PUBLIC_STRIPE_30MIN_ID,
    NEXT_PUBLIC_STRIPE_60MIN_ID: process.env.NEXT_PUBLIC_STRIPE_50MIN_ID,
    NEXT_PUBLIC_STRIPE_100MIN_ID: process.env.NEXT_PUBLIC_STRIPE_100MIN_ID,
    NEXT_PUBLIC_STRIPE_300MIN_ID: process.env.NEXT_PUBLIC_STRIPE_300MIN_ID,
    NEXT_PUBLIC_STRIPE_500MIN_ID: process.env.NEXT_PUBLIC_STRIPE_500MIN_ID,
    NEXT_PUBLIC_STRIPE_1000MIN_ID: process.env.NEXT_PUBLIC_STRIPE_1000MIN_ID,

    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    STREAM_SECRET_KEY: process.env.STREAM_SECRET_KEY,
  },
});




/*
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    JWT_SECRET: z.string().min(1),
    UPLOADTHING_SECRET: z.string().min(1),
    UPLOADTHING_APP_ID: z.string().min(1),
    
    STUDIO_TOKEN: z.string().min(1),

    NEXTAUTH_URL: z.string().url().optional(),
    AUTH_SECRET: z.string().min(1),
    GOOGLE_ID: z.string().min(1),
    GOOGLE_SECRET: z.string().min(1),
    GITHUB_OAUTH_TOKEN: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },
  client: {

    
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: z.string().min(1),
  },
  runtimeEnv: {
    JWT_SECRET: process.env.JWT_SECRET,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
   
    STUDIO_TOKEN: process.env.STUDIO_TOKEN,

    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GITHUB_OAUTH_TOKEN: process.env.GITHUB_OAUTH_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // Stripe
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
  },
})
*/