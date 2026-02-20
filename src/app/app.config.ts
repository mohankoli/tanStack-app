import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAngularQuery(new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: true,
          staleTime: 5000, // Data stays fresh for 5 seconds
        }
      }
    }))
  ]
};
