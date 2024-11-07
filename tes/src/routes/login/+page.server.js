// @ts-nocheck

import { redirect } from '@sveltejs/kit';
function convertCookieObjectToString(cookieObj) {
    const { Name, Value, Path, Expires, HttpOnly, Secure, SameSite } = cookieObj;

    // Convert Expires to the correct format (RFC 1123)
    const expiresDate = new Date(Expires).toUTCString();

    // Map SameSite enum to string
    const sameSiteMap = {
        0: 'None',
        1: 'Strict',
        2: 'Lax'
    };

    return `${Name}=${Value}; Path=${Path}; Expires=${expiresDate}; HttpOnly=${HttpOnly ? '' : 'false'}; Secure=${Secure ? '' : 'false'}; SameSite=${sameSiteMap[SameSite] || 'Lax'}`;
}

export const actions = {
    default: async ({ request, cookies }) => {
        console.log("Login action called");

        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL + '/v1/login';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            // console.log("API Response:", data);
            // const value = convertCookieObjectToString(data.data.Cookie);

            if (response.ok && data && data.data && data.data.Cookie && data.data.Cookie.Name === "jwt") {
                // console.log("Setting cookie...");
                
                cookies.set("jwt",data.data.Cookie.Value, {
                    httpOnly: false,
                    secure: false, // Set secure to false for development, change to true for production
                    sameSite: 'lax',
                    path: '/',
                });

                cookies.set("userId", data.data.Obj.id, {
                    httpOnly: false, // Ensure it's accessible from client-side JavaScript
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                });
          
            } else {
                return {
                    error: 'Login failed: JWT not found in response.'
                };
            }
        } catch (err) {
            return {
                error: `An error occurred: ${err.message}`
            };
        }
        throw redirect(302, '/home');
    }
};
