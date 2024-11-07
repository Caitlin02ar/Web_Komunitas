// @ts-nocheck
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export let fullName = '';
export let username = '';
export let email = '';
export let phoneNumber = '';
export let password = '';
export let confirmPassword = '';
export let gender = '';
export let birthDate = '';
export let address = '';
export let errorMessage = '';
export let usernameAvailable = true;
export let isLoading = writable(false);  // Gunakan writable untuk loading state

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function checkUsernameAvailability() {
    isLoading.set(true);  // Set loading to true

    try {
        const response = await fetch(`${API_URL}/v1/admin/users?username=${username}`, {
            method: 'GET',
        });

        const data = await response.json();

        if (response.ok && !data.available) {
            usernameAvailable = false;
            errorMessage = 'Oops! Username already taken!';
        } else {
            usernameAvailable = true;
            errorMessage = '';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage = 'Unable to check username availability';
    } finally {
        isLoading.set(false);  // Set loading to false
    }
}

export async function signUp() {
    if (password !== confirmPassword) {
        errorMessage = 'Passwords do not match';
        return;
    }

    if (!usernameAvailable) {
        errorMessage = 'Oops! Username already taken!';
        return;
    }

    isLoading.set(true);  // Set loading to true

    try {
        const response = await fetch(`${API_URL}/v1/registrasi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                nama_user: fullName,
                email: email,
                jenis_kelamin: gender,
                no_telpon: phoneNumber,
                password: password,
                tanggal_lahir: birthDate,
                alamat: address
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 500 && data.message === 'Username sudah terdaftar') {
                usernameAvailable = false;
                errorMessage = 'Oops! Username already taken!';
            } else {
                errorMessage = data.message || 'An error occurred during registration';
            }
            return;
        }

        window.location.href = '/login';

    } catch (error) {
        console.error('Error:', error);
        errorMessage = 'Network error';
    } finally {
        isLoading.set(false);  // Set loading to false
    }
}

