# Spring Boot: CORS + Cookie config for the Vercel frontend

The frontend now runs on a different origin (e.g. `https://prevpaper.vercel.app`) than the
Spring Boot backend. For authentication (cookie-based refresh token) and all API calls to
work, the backend must allow cross-origin requests **with credentials**.

## 1. Allow the frontend origin

Add the frontend origin(s) to your CORS configuration. Never use `allowedOriginPatterns("*")`
together with credentials — you must list concrete origins.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Frontend origins (add your Vercel domain; add http://localhost:5173 for local dev)
        config.setAllowedOrigins(List.of(
            "https://prevpaper.vercel.app",
            "http://localhost:5173"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // REQUIRED for cookies

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

## 2. Make sure the cookie is readable cross-site

If the refresh token is stored in a cookie, it must be sent to the browser with:

```
Set-Cookie: refreshToken=...; Path=/; HttpOnly; Secure; SameSite=None
```

- `Secure` — required, since the frontend is served over HTTPS.
- `SameSite=None` — required so the cookie is attached to cross-site requests from Vercel.
- `HttpOnly` — recommended for security.

**Spring Boot example:**

```java
ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
    .httpOnly(true)
    .secure(true)            // only over HTTPS
    .sameSite("None")        // required for cross-site (Vercel) usage
    .path("/")
    .maxAge(Duration.ofDays(30))
    .build();

response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
```

## 3. Verify

1. Sign in from the deployed Vercel URL.
2. Open DevTools → Network → look at the login response:
   - Response should include `Access-Control-Allow-Credentials: true`.
   - `Set-Cookie` should include `SameSite=None; Secure`.
3. Refresh the page — the app should restore the session using the cookie (no manual re-login).

## Common failure modes

| Symptom | Cause |
| --- | --- |
| `Access to fetch ... has been blocked by CORS policy` | Backend CORS doesn't include the Vercel origin |
| Cookie is never stored / sent | Cookie lacks `SameSite=None; Secure`, or `allowCredentials(true)` is missing |
| `Credentials flag is true, but Access-Control-Allow-Credentials is false` | `setAllowCredentials(true)` is missing on the backend |
| Login works but refresh silently logs you out | Refresh endpoint didn't receive the cookie (same reasons as above) |
