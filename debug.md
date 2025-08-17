# Debug Git Clone 403 Error

## Steps to debug:

1. **Check if user is logged in:**
   - Open browser dev tools (F12)
   - Go to Application tab → Local Storage
   - Look for `auth-token` key
   - If missing, user needs to log in again

2. **Check token format:**
   - Token should be a JWT string (3 parts separated by dots)
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQi...`

3. **Check network request:**
   - Open Network tab in dev tools
   - Try to clone a repo
   - Look at the `/api/projects/clone` request
   - Check if `Authorization: Bearer <token>` header is present

4. **Test with curl:**
   ```bash
   # Replace YOUR_TOKEN with the actual token from localStorage
   curl -X POST https://code.etugrand.com/api/projects/clone \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"gitUrl":"https://github.com/octocat/Hello-World.git","projectName":"test-repo"}'
   ```

## Common fixes:

- **Re-login:** Logout and login again to refresh token
- **Clear storage:** Clear browser data for the site
- **Check server logs:** Look at Docker container logs for auth errors