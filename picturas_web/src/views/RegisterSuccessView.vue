<template>
    <div class="flex min-h-screen w-full bg-white">
      <div class="w-full lg:w-full flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div class="absolute bottom-0 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div class="max-w-md w-full space-y-8 relative z-10">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-blue-900">Registration Successful</h2>
            <p class="mt-2 text-center text-sm text-blue-600">
              Thank you for registering! We've sent a validation link to your email address:
            </p>
            <p class="mt-2 text-center text-lg font-medium text-blue-700">{{ email }}</p>
          </div>
          <div class="mt-8 space-y-6">
            <p class="text-center text-sm text-blue-500">
              Please check your email and click on the validation link to complete your registration.
            </p>
            <div>
              <router-link to="/login" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Back to Login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const email = route.params.email as string;
  </script>
  
  <style scoped>
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -50px) scale(1.1); }
    50% { transform: translate(-20px, 20px) scale(0.9); }
    75% { transform: translate(50px, 50px) scale(1.05); }
  }
  
  .animate-blob {
    animation: blob 20s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  </style>  