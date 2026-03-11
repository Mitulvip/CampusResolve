import { z } from 'zod';
import { insertComplaintSchema, complaints } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  complaints: {
    list: {
      method: 'GET' as const,
      path: '/api/complaints' as const,
      responses: {
        200: z.array(z.custom<typeof complaints.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/complaints' as const,
      input: insertComplaintSchema,
      responses: {
        201: z.custom<typeof complaints.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    resolve: {
      method: 'PATCH' as const,
      path: '/api/complaints/:id/resolve' as const,
      responses: {
        200: z.custom<typeof complaints.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CreateComplaintInput = z.infer<typeof api.complaints.create.input>;
export type ComplaintResponseType = z.infer<typeof api.complaints.create.responses[201]>;
export type ComplaintsListResponseType = z.infer<typeof api.complaints.list.responses[200]>;
