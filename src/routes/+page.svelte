<div class="bg-slate-50 font-sans min-h-screen w-full p-4 sm:p-8 md:p-12">
    <div class="max-w-4xl mx-auto">
        <header class="text-center mb-12">
            <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                Welcome to the
                <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SvelteKit Boilerplate!</span>
            </h1>
            <p class="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Ini adalah proyek starter SvelteKit yang siap membantu Anda membangun aplikasi web modern dengan cepat dan efisien.
            </p>
        </header>

        <main class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-blue-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 10.5-2 2 2 2"/><path d="m14 15.5 2-2-2-2"/></svg>
                    Cara Penggunaan
                </h2>
                <ul class="space-y-4 text-slate-600">
                    <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-3 mt-1 text-blue-500 shrink-0"><path d="m22 19-7-7 7-7"/><path d="m15 19-7-7 7-7"/></svg>
                        <span>Edit file di <code class="font-mono bg-slate-100 text-blue-700 px-2 py-1 rounded-md text-sm">src/routes/</code> untuk membuat halaman baru.</span>
                    </li>
                    <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-3 mt-1 text-blue-500 shrink-0"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4"/><path d="M9 18H5"/><path d="M9 14H5"/><path d="M9 10H5"/></svg>
                        <span>Setiap file <code class="font-mono bg-slate-100 text-blue-700 px-2 py-1 rounded-md text-sm">+page.svelte</code> akan menjadi sebuah halaman.</span>
                    </li>
                    <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-3 mt-1 text-blue-500 shrink-0"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20V16"/></svg>
                        <span>Buat API endpoint dengan file <code class="font-mono bg-slate-100 text-blue-700 px-2 py-1 rounded-md text-sm">+server.ts</code>.</span>
                    </li>
                </ul>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-indigo-600"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                    Tips Pengembangan
                </h2>
                <ul class="space-y-4 text-slate-600">
                    <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-3 mt-1 text-indigo-500 shrink-0"><path d="m10 10-2 2 2 2"/><path d="m14 14 2-2-2-2"/><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M12 19v2"/></svg>
                        <span>Gunakan <code class="font-mono bg-slate-100 text-indigo-700 px-2 py-1 rounded-md text-sm">npm run dev</code> untuk memulai server.</span>
                    </li>
                     <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-3 mt-1 text-indigo-500 shrink-0"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                        <span>Manfaatkan fitur **hot-reload** untuk melihat perubahan secara instan.</span>
                    </li>
                    <li class="flex items-start">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-3 mt-1 text-indigo-500 shrink-0"><path d="M12 13V7"/><path d="M10.3 7.7a2.3 2.3 0 0 0-2.6 2.6"/><path d="M12 21a9 9 0 1 0-9-9c0 1.5.5 2.9 1.4 4"/><path d="m8 19 1.3-1.3"/></svg>
                        <span>Struktur folder telah dioptimalkan untuk skalabilitas dan kemudahan maintenance.</span>
                    </li>
                </ul>
            </div>
        </main>

        <footer class="mt-12 text-center p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <h3 class="text-2xl font-bold text-white">Siap untuk Membangun?</h3>
            <p class="mt-2 text-indigo-200">
                Mulai sekarang dengan mengedit file di <code class="font-mono bg-indigo-900/50 text-white px-2 py-1 rounded-md">src/routes/</code> dan ciptakan halaman pertama Anda!
            </p>
        </footer>
    </div>
</div>