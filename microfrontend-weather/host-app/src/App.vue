<script setup lang="ts">
import { ref } from 'vue';
import WeatherWidget from 'remoteApp/WeatherWidget';

const city = ref('Jakarta');

const handleSearch = (e: Event) => {
  e.preventDefault();
  const input = (e.target as HTMLFormElement).elements.namedItem('city') as HTMLInputElement;
  city.value = input.value.trim() || 'Jakarta';
};
</script>

<template>
  <div
    class="min-vh-100 d-flex flex-column align-items-center justify-content-center"
    style="background: linear-gradient(135deg, #007bff 0%, #6610f2 50%, #6f42c1 100%); background-attachment: fixed;"
  >
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-6">
          <div class="card border-0 shadow-lg rounded-4 bg-white bg-opacity-95 p-4 p-md-5 animate__animated animate__zoomIn">
            <div class="card-body">
              <h1 class="card-title text-center mb-4 fw-bold display-4 text-primary animate__animated animate__fadeIn">
                Weather Dashboard
              </h1>

              <!-- Search Bar -->
              <form @submit="handleSearch" class="mb-5">
                <div class="input-group input-group-lg">
                  <input
                    type="text"
                    name="city"
                    class="form-control py-3 px-4 border-0 shadow-sm"
                    placeholder="Enter city (e.g., Surabaya)"
                    style="border-radius: 1.5rem 0 0 1.5rem; background-color: #f8f9fa;"
                  />
                  <button
                    type="submit"
                    class="btn btn-primary px-5 py-3 rounded-end-pill shadow-sm"
                    style="background-color: #0d6efd; border-color: #0d6efd;"
                  >
                    Search
                  </button>
                </div>
              </form>

              <!-- Weather Widget -->
              <div class="row justify-content-center">
                <div class="col-12">
                  <Suspense>
                    <template #default>
                      <WeatherWidget :city="city" />
                    </template>
                    <template #fallback>
                      <div class="text-center text-muted py-4 animate__animated animate__pulse animate__infinite">
                        <div class="spinner-grow text-primary me-3" style="width: 3rem; height: 3rem;">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        <span class="fs-4">Loading Weather...</span>
                      </div>
                    </template>
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="text-center text-white mt-5 py-4 w-100" style="background-color: rgba(0, 0, 0, 0.4);">
      <p class="mb-0 fw-light">Powered by xAI Microfrontend Technology © 2025</p>
    </footer>
  </div>
</template>