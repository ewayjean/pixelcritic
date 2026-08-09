import { supabase } from './supabase-config.js';
import { renderNewsGrid } from './news-data.js';
import { renderBlogGrid } from './blog-data.js';

let isAdmin = false;
let reviewsData = [];
let currentUser = null;
let currentAboutMeText = "";
let currentAboutMeName = "Alex Pixel";
let currentAboutMeRole = "Crítico & Editor Gamer";

// Fallback research-backed games data if Supabase table is empty or uninitialized
const fallbackReviews = [
    { 
        id: '1', 
        title: 'Elden Ring', 
        score: 9.6, 
        summary: 'Ganador del GOTY. Una obra maestra del diseño de mundo abierto en las Tierras Intermedias, creada por FromSoftware y George R.R. Martin.', 
        fullText: 'Elden Ring expande magistralmente el combate característico de los Soulslike en un mundo abierto vasto e interconectado. El juego combina combates melé de alta precisión, magia versátil, cenizas de guerra personalizables e invocaciones tácticas. Con una dirección artística impresionante en las Tierras Intermedias, ofrece fortalezas en decadencia, catacumbas tenebrosas y vistas majestuosas dominadas por el gran Árbol Áureo.',
        imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg', 
        platforms: 'PC, PS5, PS4, Xbox Series X/S, Xbox One' 
    },
    { 
        id: '2', 
        title: 'Lies of P', 
        score: 8.0, 
        summary: 'Un oscuro y brillante Soulslike inspirado en Las aventuras de Pinocho en la sombría ciudad victoriana de Krat.', 
        fullText: 'Lies of P ofrece una experiencia exigente centrándose en bloqueos perfectos (parry), mecánicas de postura y un sistema innovador de ensamblaje de armas que permite personalizar empuñaduras y hojas. Ambientado en la ciudad gótica de estilo Belle Époque infestada de autómatas asesinos, destaca visualmente por su atmósfera steampunk, calles adoquinadas bañadas por la lluvia y una iluminación espectacular bajo Unreal Engine 4.',
        imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1627720/header.jpg', 
        platforms: 'PC, macOS, PS5, PS4, Xbox Series X/S' 
    },
    { 
        id: '3', 
        title: 'Apex Legends', 
        score: 8.8, 
        summary: 'El hero battle royale frenético de Respawn Entertainment ambientado en el universo de Titanfall.', 
        fullText: 'Apex Legends revolucionó el género Battle Royale al fusionar un gunplay rápido y fluido con habilidades únicas de héroes y un sistema de marcado (ping) no verbal impecable. Destaca por su ritmo vertiginoso basado en deslizamientos, tirolesas y tácticas de escuadrón. Visualmente ofrece alta tasa de cuadros, mapas coloridos y variados como Kings Canyon y Olympus, con efectos visuales claros para combates intensos.',
        imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg', 
        platforms: 'PC, PS5, PS4, Xbox Series X/S, Switch' 
    }
];

// Navigation function
export function showSection(sectionId) {
    document.querySelectorAll('.section-container').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('block');
    });
    
    const target = document.getElementById(sectionId + '-section');
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('block');
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.target === sectionId) {
            btn.classList.add('border-gaming-accent', 'text-gaming-accent');
            btn.classList.remove('border-transparent');
        } else {
            btn.classList.remove('border-gaming-accent', 'text-gaming-accent');
            btn.classList.add('border-transparent');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Custom Alert System
export function showAlert(title, message, type = 'info') {
    const modal = document.getElementById('alertModal');
    const icon = document.getElementById('alertIcon');
    
    document.getElementById('alertTitle').innerText = title;
    document.getElementById('alertMessage').innerText = message;
    
    if (type === 'error') {
        icon.innerHTML = '<i class="fa-solid fa-circle-exclamation text-gaming-danger"></i>';
        document.getElementById('alertTitle').className = "text-xl font-bold mb-2 font-display text-gaming-danger";
    } else if (type === 'success') {
        icon.innerHTML = '<i class="fa-solid fa-circle-check text-gaming-highlight"></i>';
        document.getElementById('alertTitle').className = "text-xl font-bold mb-2 font-display text-gaming-highlight";
    } else {
        icon.innerHTML = '<i class="fa-solid fa-info-circle text-gaming-accent"></i>';
        document.getElementById('alertTitle').className = "text-xl font-bold mb-2 font-display text-white";
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

export function closeAlert() {
    const modal = document.getElementById('alertModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Admin Login Modal Controls & Authentication
export function openAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        document.getElementById('adminLoginForm').reset();
        modal.classList.remove('hidden');
    }
}

export function closeAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.classList.add('hidden');
}

export function handleAdminLogin(event) {
    if (event) event.preventDefault();
    
    const userVal = document.getElementById('adminUsername').value.trim();
    const passVal = document.getElementById('adminPassword').value.trim();
    
    // Configured admin credentials: User: Admin | Password: 03112014
    if (userVal.toLowerCase() === 'admin' && passVal === '03112014') {
        isAdmin = true;
        closeAdminLoginModal();
        
        const btn = document.getElementById('adminBtn');
        const btnText = document.getElementById('adminBtnText');
        const addBtn = document.getElementById('addReviewBtn');
        const navAdminPanelBtn = document.getElementById('navAdminPanelBtn');
        const editAboutBtn = document.getElementById('editAboutMeBtn');
        
        btn.classList.add('border-gaming-accent', 'text-gaming-accent');
        btnText.innerText = "Panel Admin (Activo)";
        btn.querySelector('i').className = "fa-solid fa-unlock text-gaming-accent";
        if (addBtn) addBtn.classList.remove('hidden');
        if (navAdminPanelBtn) navAdminPanelBtn.classList.remove('hidden');
        if (editAboutBtn) editAboutBtn.classList.remove('hidden');
        
        showSection('admin-panel');
        showAlert("¡Bienvenido Admin!", "Sesión de administración iniciada con éxito.", "success");
        renderReviews();
    } else {
        showAlert("Acceso Denegado", "Usuario o contraseña incorrectos. Verifica tus datos de administrador.", "error");
    }
}

// Admin Mode Toggle (Login Trigger / Logout)
export function toggleAdminMode() {
    if (!isAdmin) {
        openAdminLoginModal();
    } else {
        isAdmin = false;
        const btn = document.getElementById('adminBtn');
        const btnText = document.getElementById('adminBtnText');
        const addBtn = document.getElementById('addReviewBtnBtn');
        const navAdminPanelBtn = document.getElementById('navAdminPanelBtn');
        
        btn.classList.remove('border-gaming-accent', 'text-gaming-accent');
        btn.classList.add('border-gray-600', 'text-gray-300');
        btnText.innerText = "Iniciar Sesión Admin";
        btn.querySelector('i').className = "fa-solid fa-lock";
        if (addBtn) addBtn.classList.add('hidden');
        if (navAdminPanelBtn) navAdminPanelBtn.classList.add('hidden');
        
        const editAboutBtn = document.getElementById('editAboutMeBtn');
        if (editAboutBtn) editAboutBtn.classList.add('hidden');
        cancelEditAboutMe(); // Close editor if open

        showSection('home');
        showAlert("Sesión Cerrada", "Has salido del Panel de Administración.", "info");
        renderReviews();
    }
}

// Modal Form Logic
export function openModal() {
    if (!isAdmin) {
        showAlert("Acceso Denegado", "Solo los administradores pueden crear reseñas.", "error");
        return;
    }
    document.getElementById('reviewModal').classList.remove('hidden');
    document.getElementById('reviewForm').reset();
    document.getElementById('scoreValue').innerText = "8";
}

export function closeModal() {
    document.getElementById('reviewModal').classList.add('hidden');
}

// -----------------------------------------------
// Editor Review Modal Logic
// -----------------------------------------------
// Track whether we're editing an existing review
let editingReviewId = null;

export function openEditorReviewModal() {
    if (!isAdmin) {
        showAlert("Acceso Denegado", "Solo el administrador puede crear Reseñas del Editor.", "error");
        return;
    }
    editingReviewId = null;
    _resetEditorModal();
    // Update modal header and button for CREATE mode
    document.getElementById('editorModalTitle').innerHTML = '<i class="fa-solid fa-pen-nib text-purple-400"></i> Nueva Reseña del Editor';
    const btn = document.getElementById('saveEditorReviewBtn');
    btn.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Publicar Reseña';
    document.getElementById('editorReviewModal').classList.remove('hidden');
}

export function openEditorReviewForEdit(reviewId) {
    if (!isAdmin) return;
    const review = reviewsData.find(r => r.id === reviewId);
    if (!review) { showAlert("Error", "No se encontró la reseña.", "error"); return; }

    editingReviewId = reviewId;
    _resetEditorModal();

    // Pre-fill fields with existing data
    document.getElementById('editorGameTitle').value = review.title || '';
    document.getElementById('editorHoursPlayed').value = review.hoursPlayed || '';
    document.getElementById('editorImageUrl').value = review.imageUrl || '';
    document.getElementById('editorScore').value = review.score || 8;
    document.getElementById('editorScoreValue').innerText = review.score || 8;
    document.getElementById('editorSummary').value = review.summary || '';
    document.getElementById('summaryCount').innerText = (review.summary || '').length;
    document.getElementById('editorFullText').value = review.fullText || '';

    // Pre-select platforms
    const existingPlatforms = (review.platforms || '').split(',').map(p => p.trim());
    document.querySelectorAll('.platform-check').forEach(cb => {
        cb.checked = existingPlatforms.includes(cb.value);
    });
    updatePlatformsLabel();

    // Pre-fill screenshots
    const shots = review.screenshots || [];
    shots.forEach(url => {
        addScreenshotField();
        const inputs = document.querySelectorAll('[id^="screenshotUrl_"]');
        inputs[inputs.length - 1].value = url;
    });
    refreshScreenshotsPreview();

    // Update modal header and button for EDIT mode
    document.getElementById('editorModalTitle').innerHTML = `<i class="fa-solid fa-pen-to-square text-yellow-400"></i> Editando: ${review.title}`;
    const btn = document.getElementById('saveEditorReviewBtn');
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios';

    document.getElementById('editorReviewModal').classList.remove('hidden');
}

function _resetEditorModal() {
    document.getElementById('editorGameTitle').value = '';
    document.getElementById('editorHoursPlayed').value = '';
    document.getElementById('editorImageUrl').value = '';
    document.getElementById('editorScore').value = 8;
    document.getElementById('editorScoreValue').innerText = '8';
    document.getElementById('editorSummary').value = '';
    document.getElementById('summaryCount').innerText = '0';
    document.getElementById('editorFullText').value = '';
    document.getElementById('screenshotsContainer').innerHTML = '';
    document.getElementById('screenshotsPreview').innerHTML = '';
    document.getElementById('screenshotsPreview').classList.add('hidden');
    document.querySelectorAll('.platform-check').forEach(cb => { cb.checked = false; });
    document.getElementById('platformsLabel').innerText = 'Selecciona las plataformas...';
    document.getElementById('platformsOptions').classList.add('hidden');
}

export function closeEditorReviewModal() {
    document.getElementById('editorReviewModal').classList.add('hidden');
    document.getElementById('platformsOptions').classList.add('hidden');
}

export function togglePlatformsDropdown() {
    const options = document.getElementById('platformsOptions');
    const chevron = document.getElementById('platformsChevron');
    options.classList.toggle('hidden');
    chevron.style.transform = options.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

export function updatePlatformsLabel() {
    const checked = [...document.querySelectorAll('.platform-check:checked')].map(cb => cb.value);
    const label = document.getElementById('platformsLabel');
    if (checked.length === 0) {
        label.innerText = 'Selecciona las plataformas...';
        label.className = 'text-gray-400';
    } else {
        label.innerText = checked.join(', ');
        label.className = 'text-white font-medium';
    }
}

let screenshotCount = 0;
export function addScreenshotField() {
    screenshotCount++;
    const container = document.getElementById('screenshotsContainer');
    const id = `screenshotUrl_${screenshotCount}`;
    const div = document.createElement('div');
    div.className = 'flex gap-2 items-center';
    div.id = `screenshotRow_${screenshotCount}`;
    div.innerHTML = `
        <input type="url" id="${id}" placeholder="https://ejemplo.com/captura${screenshotCount}.jpg"
            class="flex-1 bg-gaming-light border border-gray-600 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-400"
            oninput="refreshScreenshotsPreview()">
        <button type="button" onclick="removeScreenshotField('screenshotRow_${screenshotCount}')"
            class="w-9 h-9 flex items-center justify-center bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-md transition-colors flex-shrink-0">
            <i class="fa-solid fa-trash text-sm"></i>
        </button>`;
    container.appendChild(div);
}

export function removeScreenshotField(rowId) {
    const row = document.getElementById(rowId);
    if (row) row.remove();
    refreshScreenshotsPreview();
}

export function refreshScreenshotsPreview() {
    const urls = [...document.querySelectorAll('[id^="screenshotUrl_"]')]
        .map(input => input.value.trim()).filter(url => url.length > 0);
    const preview = document.getElementById('screenshotsPreview');
    if (urls.length === 0) {
        preview.classList.add('hidden');
        preview.innerHTML = '';
        return;
    }
    preview.classList.remove('hidden');
    preview.innerHTML = urls.map(url => `
        <div class="relative group w-24 h-16 rounded-lg overflow-hidden border border-gray-600 bg-gaming-light flex-shrink-0">
            <img src="${url}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-red-400 text-xs\\'><i class=\\'fa-solid fa-image-slash\\'></i></div>'">
        </div>`).join('');
}

export async function saveEditorReview() {
    const title = document.getElementById('editorGameTitle').value.trim();
    const hoursPlayed = parseInt(document.getElementById('editorHoursPlayed').value) || null;
    const imageUrl = document.getElementById('editorImageUrl').value.trim();
    const score = parseFloat(document.getElementById('editorScore').value);
    const summary = document.getElementById('editorSummary').value.trim();
    const fullText = document.getElementById('editorFullText').value.trim();
    const platforms = [...document.querySelectorAll('.platform-check:checked')].map(cb => cb.value).join(', ');
    const screenshots = [...document.querySelectorAll('[id^="screenshotUrl_"]')]
        .map(input => input.value.trim()).filter(url => url.length > 0);

    // Validation
    if (!title) { showAlert("Campo requerido", "El título del juego es obligatorio.", "error"); return; }
    if (!platforms) { showAlert("Campo requerido", "Selecciona al menos una plataforma.", "error"); return; }
    if (!imageUrl) { showAlert("Campo requerido", "La URL de la imagen de portada es obligatoria.", "error"); return; }
    if (!summary) { showAlert("Campo requerido", "El resumen breve es obligatorio.", "error"); return; }
    if (!fullText) { showAlert("Campo requerido", "La reseña completa es obligatoria.", "error"); return; }

    const btn = document.getElementById('saveEditorReviewBtn');
    const isEditing = editingReviewId !== null;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${isEditing ? 'Guardando...' : 'Publicando...'}`;

    const reviewPayload = {
        title,
        platforms,
        image_url: imageUrl,
        score,
        summary,
        full_text: fullText,
        author_id: 'editor',
        hours_played: hoursPlayed,
        screenshots: screenshots.length > 0 ? JSON.stringify(screenshots) : null
    };

    try {
        if (isEditing) {
            // ---- UPDATE existing review ----
            const { data, error } = await supabase
                .from('game_reviews')
                .update(reviewPayload)
                .eq('id', editingReviewId)
                .select();
            if (error) throw error;
            const updated = data[0];
            const idx = reviewsData.findIndex(r => r.id === editingReviewId);
            if (idx !== -1) {
                reviewsData[idx] = {
                    id: updated.id,
                    title: updated.title,
                    platforms: updated.platforms,
                    imageUrl: updated.image_url,
                    score: parseFloat(updated.score),
                    summary: updated.summary,
                    fullText: updated.full_text,
                    authorId: updated.author_id,
                    hoursPlayed: updated.hours_played,
                    screenshots: updated.screenshots ? JSON.parse(updated.screenshots) : [],
                    createdAt: updated.created_at
                };
            }
            renderReviews();
            closeEditorReviewModal();
            showAlert("¡Actualizado!", `La reseña "${title}" ha sido guardada correctamente.`, "success");
        } else {
            // ---- INSERT new review ----
            const { data, error } = await supabase.from('game_reviews').insert([reviewPayload]).select();
            if (error) throw error;
            const saved = data[0];
            reviewsData.unshift({
                id: saved.id,
                title: saved.title,
                platforms: saved.platforms,
                imageUrl: saved.image_url,
                score: parseFloat(saved.score),
                summary: saved.summary,
                fullText: saved.full_text,
                authorId: saved.author_id,
                hoursPlayed: saved.hours_played,
                screenshots: saved.screenshots ? JSON.parse(saved.screenshots) : [],
                createdAt: saved.created_at
            });
            renderReviews();
            closeEditorReviewModal();
            showAlert("¡Publicado!", `La Reseña del Editor "${title}" ha sido publicada exitosamente.`, "success");
        }
    } catch (err) {
        console.error("Error al guardar reseña del editor:", err);
        showAlert("Error", `No se pudo guardar la reseña: ${err.message}`, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = isEditing
            ? '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios'
            : '<i class="fa-solid fa-pen-nib"></i> Publicar Reseña';
    }
}


// Review Card Builder
function getScoreColorClass(score) {
    if (score >= 9) return 'text-purple-400';
    if (score >= 7) return 'text-gaming-highlight';
    if (score >= 5) return 'text-yellow-400';
    return 'text-gaming-danger';
}

function createReviewCard(review, isEditorReview = false) {
    const scoreClass = getScoreColorClass(review.score);
    
    const deleteHtml = isAdmin ? 
        `<button onclick="deleteReview('${review.id}')" class="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center z-20 backdrop-blur-sm transition-colors shadow-lg" title="Eliminar reseña">
            <i class="fa-solid fa-trash text-sm"></i>
        </button>` : '';

    const editorBadge = isEditorReview
        ? `<div class="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-600/90 backdrop-blur-sm border border-purple-400/40 text-xs font-bold text-white shadow-lg">
            <i class="fa-solid fa-pen-nib text-purple-200 text-[10px]"></i> Editor
           </div>`
        : '';

    return `
        <article class="glass-panel rounded-xl overflow-hidden shadow-lg group hover:border-gray-500 transition-all duration-300 relative flex flex-col h-full${isEditorReview ? ' border-purple-500/30 hover:border-purple-400/50' : ''}">
            ${deleteHtml}
            ${editorBadge}
            <div class="relative h-48 overflow-hidden">
                <div class="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                <img src="${review.imageUrl}" alt="${review.title}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/800x400/1e293b/3b82f6?text=No+Image'">
                <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent z-10">
                    <span class="inline-block px-2 py-1 bg-gaming-dark/80 backdrop-blur-sm text-xs rounded border border-gray-600 text-gray-300 mb-2 font-mono">${review.platforms}</span>
                    <h3 class="text-xl font-display font-bold text-white truncate">${review.title}</h3>
                </div>
                <div class="absolute top-4 left-4 bg-gaming-dark/90 backdrop-blur-md rounded-lg p-2 border border-gray-600 z-10 shadow-lg flex flex-col items-center justify-center w-12">
                    <span class="text-[10px] text-gray-400 font-bold tracking-widest">NOTA</span>
                    <span class="text-lg font-display font-black ${scoreClass}">${review.score}</span>
                </div>
            </div>
            <div class="p-5 flex-grow flex flex-col">
                <p class="text-gray-300 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">${review.summary}</p>
                <button onclick="viewReviewDetail('${review.id}')" class="w-full py-2 bg-gaming-light hover:bg-gray-700 border border-gray-600 rounded text-sm font-medium transition-colors text-white mt-auto flex items-center justify-center gap-2">
                    <i class="fa-solid fa-file-alt text-gaming-accent"></i> Leer Análisis Completo
                </button>
            </div>
        </article>
    `;
}

export function viewReviewDetail(reviewId) {
    const review = reviewsData.find(r => r.id === reviewId);
    if (!review) {
        showAlert('Error', 'Reseña no encontrada.', 'error');
        return;
    }

    // Set Hero Background
    const hero = document.getElementById('review-detail-hero');
    hero.style.backgroundImage = `url('${review.imageUrl}')`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center';

    // Set Badge
    const badgeContainer = document.getElementById('review-detail-badge');
    if (review.authorId === 'editor') {
        badgeContainer.innerHTML = `<div class="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 text-xs font-bold shadow-lg">
            <i class="fa-solid fa-crown text-yellow-400"></i> Reseña del Editor
        </div>`;
    } else {
        badgeContainer.innerHTML = `<div class="inline-flex items-center gap-2 px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full border border-gray-600 text-xs font-bold">
            <i class="fa-solid fa-user-pen"></i> Reseña General
        </div>`;
    }

    // Set text details
    document.getElementById('review-detail-title').innerText = review.title;
    document.getElementById('review-detail-platforms').innerText = review.platforms;
    
    // Set date (format YYYY-MM-DD if created_at exists, else general text)
    const dateStr = review.createdAt ? new Date(review.createdAt).toLocaleDateString('es-ES') : 'Clásico';
    document.getElementById('review-detail-date').innerText = dateStr;

    // Set score and color
    const scoreEl = document.getElementById('review-detail-score');
    scoreEl.innerText = review.score;
    scoreEl.className = `text-5xl font-display font-black drop-shadow-md ${getScoreColorClass(review.score)}`;

    // Set content
    document.getElementById('review-detail-summary').innerText = review.summary;
    
    // Formatting the full text. Split by newlines and wrap in paragraphs
    const paragraphs = (review.fullText || review.summary).split('\n').filter(p => p.trim() !== '');
    const formattedHtml = paragraphs.map(p => `<p class="mb-6">${p}</p>`).join('');
    document.getElementById('review-detail-content').innerHTML = formattedHtml;

    // Handle Screenshots
    const gallerySection = document.getElementById('review-detail-gallery');
    const screenshotsContainer = document.getElementById('review-detail-screenshots');
    if (review.screenshots && review.screenshots.length > 0) {
        gallerySection.classList.remove('hidden');
        screenshotsContainer.innerHTML = review.screenshots.map(url => `
            <a href="${url}" target="_blank" class="block overflow-hidden rounded-xl border border-gray-700 shadow-lg group">
                <img src="${url}" class="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500" alt="Screenshot" onerror="this.src='https://placehold.co/800x400/1e293b/3b82f6?text=No+Image'">
            </a>
        `).join('');
    } else {
        gallerySection.classList.add('hidden');
        screenshotsContainer.innerHTML = '';
    }

    // Load dynamic community data
    loadComments(reviewId);
    loadReactions(reviewId);

    // Navigate to the section
    showSection('review-detail');
}

function renderReviews() {
    const homeContainer = document.getElementById('latest-reviews-container');
    const allContainer = document.getElementById('all-reviews-container');
    const editorContainer = document.getElementById('editor-reviews-container');
    const adminTableBody = document.getElementById('adminTableBody');
    const adminStatTotal = document.getElementById('adminStatTotal');
    const adminStatAvg = document.getElementById('adminStatAvg');

    // Split into editor reviews and general fallback reviews
    const editorReviews = reviewsData.filter(r => r.authorId === 'editor');
    const generalReviews = reviewsData.filter(r => r.authorId !== 'editor');

    // Update Admin Stats (count all)
    if (adminStatTotal) adminStatTotal.innerText = reviewsData.length;
    if (adminStatAvg) {
        const avg = reviewsData.length > 0 
            ? (reviewsData.reduce((acc, r) => acc + (parseFloat(r.score) || 0), 0) / reviewsData.length).toFixed(1)
            : '0.0';
        adminStatAvg.innerText = avg;
    }

    // --- GENERAL REVIEWS (Reseñas section) ---
    const emptyStateGeneral = `
        <div class="col-span-full text-center py-12 glass-panel rounded-xl border-dashed">
            <i class="fa-solid fa-ghost text-5xl text-gray-500 mb-4"></i>
            <h3 class="text-xl font-bold text-gray-300">Aún no hay reseñas generales</h3>
        </div>`;

    if (homeContainer) homeContainer.innerHTML = generalReviews.length > 0
        ? generalReviews.slice(0, 3).map(r => createReviewCard(r, false)).join('')
        : emptyStateGeneral;

    if (allContainer) allContainer.innerHTML = generalReviews.length > 0
        ? generalReviews.map(r => createReviewCard(r, false)).join('')
        : emptyStateGeneral;

    // --- EDITOR REVIEWS (Reseñas del Editor section) ---
    if (editorContainer) {
        editorContainer.innerHTML = editorReviews.length > 0
            ? editorReviews.map(r => createReviewCard(r, true)).join('')
            : `<div class="col-span-full text-center py-16 glass-panel rounded-xl border-dashed border-purple-500/20">
                <i class="fa-solid fa-pen-nib text-5xl text-purple-500/50 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-300">Aún no hay Reseñas del Editor publicadas</h3>
                <p class="text-gray-500 mt-2">Inicia sesión como Admin y publica tu primera reseña exclusiva.</p>
               </div>`;
    }

    // --- ADMIN TABLE ---
    if (adminTableBody) {
        adminTableBody.innerHTML = reviewsData.length === 0
            ? `<tr><td colspan="5" class="p-6 text-center text-gray-500">No hay contenido publicado.</td></tr>`
            : reviewsData.map(review => `
                <tr class="hover:bg-gaming-light/50 transition-colors">
                    <td class="p-4 flex items-center gap-3">
                        <img src="${review.imageUrl}" alt="${review.title}" class="w-10 h-10 rounded-md object-cover border border-gray-700">
                        <div>
                            <span class="font-bold text-white font-sans block">${review.title}</span>
                            ${review.authorId === 'editor' ? '<span class="text-xs text-purple-400 flex items-center gap-1"><i class="fa-solid fa-pen-nib text-[10px]"></i> Reseña del Editor</span>' : '<span class="text-xs text-gray-500">General</span>'}
                        </div>
                    </td>
                    <td class="p-4 text-gray-400 font-mono text-xs">${review.platforms}</td>
                    <td class="p-4 text-center">
                        <span class="px-2.5 py-1 rounded-md bg-gaming-dark font-display font-bold ${getScoreColorClass(review.score)} border border-gray-700">${review.score}</span>
                    </td>
                    <td class="p-4 text-gray-300 max-w-xs truncate">${review.summary}</td>
                    <td class="p-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                            ${review.authorId === 'editor' ? `<button onclick="openEditorReviewForEdit('${review.id}')" class="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white rounded-md text-xs font-bold transition-colors flex items-center gap-1.5">
                                <i class="fa-solid fa-pen-to-square"></i> Editar
                            </button>` : ''}
                            <button onclick="deleteReview('${review.id}')" class="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md text-xs font-bold transition-colors flex items-center gap-1.5">
                                <i class="fa-solid fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
    }
}

// Fetch Reviews from Supabase
async function fetchReviewsFromSupabase() {
    try {
        const { data, error } = await supabase
            .from('game_reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn("Supabase fetch warning:", error.message);
            reviewsData = fallbackReviews;
        } else if (data && data.length > 0) {
            const fetchedReviews = data.map(item => ({
                id: item.id,
                title: item.title,
                platforms: item.platforms,
                imageUrl: item.image_url,
                score: parseFloat(item.score),
                summary: item.summary,
                fullText: item.full_text,
                authorId: item.author_id || null,
                createdAt: item.created_at
            }));
            reviewsData = [...fetchedReviews, ...fallbackReviews];
            console.log("Reseñas cargadas exitosamente desde Supabase:", reviewsData.length);
        } else {
            // If table is newly created and empty, fall back to initial 3 research games
            reviewsData = fallbackReviews;
        }
    } catch (err) {
        console.error("Error al conectar con Supabase:", err);
        reviewsData = fallbackReviews;
    }
    renderReviews();
}

// Save Review to Supabase
export async function saveReview() {
    if (!isAdmin) {
        showAlert("Error", "Debes estar en Modo Admin para guardar.", "error");
        return;
    }

    const form = document.getElementById('reviewForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const title = document.getElementById('gameTitle').value.trim();
    const platforms = document.getElementById('gamePlatforms').value.trim();
    const imageUrl = document.getElementById('gameImageUrl').value.trim();
    const score = parseFloat(document.getElementById('gameScore').value);
    const summary = document.getElementById('gameSummary').value.trim();
    const fullText = document.getElementById('gameReviewText').value.trim();

    if (!title || !platforms || !imageUrl || isNaN(score) || !summary || !fullText) {
        showAlert("Campos Incompletos", "Por favor completa todos los campos correctamente.", "error");
        return;
    }

    const saveBtn = document.getElementById('saveReviewBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando en Supabase...';

    const newReviewRecord = {
        title,
        platforms,
        image_url: imageUrl,
        score,
        summary,
        full_text: fullText,
        author_id: 'editor'   // Mark all admin-saved reviews as Editor Reviews
    };

    try {
        const { data, error } = await supabase
            .from('game_reviews')
            .insert([newReviewRecord])
            .select();

        if (error) {
            console.error("Error insertando en Supabase:", error);
            // Local fallback
            const localReview = {
                id: 'local-' + Date.now(),
                title,
                platforms,
                imageUrl,
                score,
                summary,
                fullText
            };
            reviewsData.unshift(localReview);
            renderReviews();
            showAlert("Reseña Guardada", "Guardada en vista local (Crea la tabla 'game_reviews' en Supabase para persistencia remota).", "info");
        } else {
            showAlert("¡Éxito!", "Reseña publicada correctamente en Supabase.", "success");
            await fetchReviewsFromSupabase();
        }
        closeModal('reviewModal');
        document.getElementById('reviewForm').reset();
    } catch (err) {
        console.error("Excepción al guardar en Supabase:", err);
        showAlert("Error", "Ocurrió un error inesperado al conectar con Supabase.", "error");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-save"></i> Guardar';
    }
}

// Delete Review from Supabase
export async function deleteReview(docId) {
    if (!isAdmin) return;
    
    if (confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
        try {
            if (typeof docId === 'string' && docId.startsWith('local-')) {
                reviewsData = reviewsData.filter(r => r.id !== docId);
                renderReviews();
                showAlert("Eliminado", "La reseña fue eliminada localmente.", "success");
                return;
            }

            const { error } = await supabase
                .from('game_reviews')
                .delete()
                .eq('id', docId);

            if (error) {
                console.error("Error al eliminar en Supabase:", error);
                reviewsData = reviewsData.filter(r => r.id !== docId);
                renderReviews();
                showAlert("Aviso", "Se removió de la vista actual.", "info");
            } else {
                showAlert("Eliminado", "Reseña eliminada con éxito de Supabase.", "success");
                await fetchReviewsFromSupabase();
            }
        } catch (err) {
            console.error("Error al eliminar:", err);
            reviewsData = reviewsData.filter(r => r.id !== docId);
            renderReviews();
        }
    }
}

// Global functions for window
window.showSection = showSection;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleAdminMode = toggleAdminMode;
window.closeAlert = closeAlert;
window.deleteReview = deleteReview;
window.saveReview = saveReview;
window.openAdminLoginModal = openAdminLoginModal;
window.closeAdminLoginModal = closeAdminLoginModal;
window.handleAdminLogin = handleAdminLogin;

// Initial application bootstrap
async function initApp() {
    // Setup Supabase Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
        handleUserSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
        handleUserSession(session);
    });

    await fetchReviewsFromSupabase();
    renderNewsGrid('news-grid-container');
    renderBlogGrid('blog-grid-container');
    await loadAboutMe();

    // Search input listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = reviewsData.filter(review => 
                review.title.toLowerCase().includes(term) || 
                review.platforms.toLowerCase().includes(term) ||
                review.summary.toLowerCase().includes(term)
            );
            
            const allContainer = document.getElementById('all-reviews-container');
            if (filtered.length === 0) {
                allContainer.innerHTML = `
                    <div class="col-span-full text-center py-12 glass-panel rounded-xl">
                        <i class="fa-solid fa-magnifying-glass text-4xl text-gray-500 mb-3"></i>
                        <p class="text-gray-400 text-lg">No se encontraron juegos que coincidan con "${term}"</p>
                    </div>`;
            } else {
                allContainer.innerHTML = filtered.map(createReviewCard).join('');
            }
        });
    }

    // Attach Save Button Listener
    const saveBtn = document.getElementById('saveReviewBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveReview);
    }

    showSection('home');
    loadActivePoll(); // Load active poll on init
}

window.addEventListener('DOMContentLoaded', initApp);

// ==========================================
// COMMUNITY FEATURES (Comentarios, Reacciones, Encuestas)
// ==========================================

let currentReviewIdForComments = null;

export async function submitComment() {
    if (!currentReviewIdForComments) return;
    if (!currentUser) {
        openUserLoginModal();
        return;
    }

    const btn = document.getElementById('submitCommentBtn');
    const meta = currentUser.user_metadata;
    const author = meta.name || meta.full_name || 'Usuario';
    const avatar = meta.avatar_url || null;
    const score = parseFloat(document.getElementById('commentScore').value);
    const text = document.getElementById('commentText').value.trim();

    if (!text) {
        showAlert("Error", "Debes escribir una opinión.", "error");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';

    try {
        const { error } = await supabase.from('review_comments').insert([{
            review_id: currentReviewIdForComments,
            user_id: currentUser.id,
            author_name: author,
            author_avatar: avatar,
            community_score: score,
            comment_text: text
        }]);

        if (error) throw error;
        
        document.getElementById('commentText').value = '';
        document.getElementById('commentScore').value = 5;
        document.getElementById('commentScoreValue').innerText = '5.0';
        
        await loadComments(currentReviewIdForComments);
        showAlert("¡Publicado!", "Tu comentario ha sido publicado exitosamente.", "success");
    } catch (err) {
        console.error("Error publicando comentario:", err);
        showAlert("Error", "No se pudo publicar el comentario.", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publicar Comentario';
    }
}

export async function loadComments(reviewId) {
    currentReviewIdForComments = reviewId;
    const list = document.getElementById('comments-list');
    const scoreContainer = document.getElementById('review-detail-community-score-container');
    const scoreText = document.getElementById('review-detail-community-score');
    
    list.innerHTML = '<div class="text-center py-4 text-gray-500"><i class="fa-solid fa-circle-notch fa-spin text-2xl"></i></div>';

    try {
        const { data, error } = await supabase
            .from('review_comments')
            .select('*')
            .eq('review_id', reviewId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
            // Calculate average community score
            const validScores = data.filter(c => c.community_score !== null);
            if (validScores.length > 0) {
                const avg = validScores.reduce((acc, c) => acc + parseFloat(c.community_score), 0) / validScores.length;
                scoreText.innerText = avg.toFixed(1);
                scoreContainer.classList.remove('hidden');
            } else {
                scoreContainer.classList.add('hidden');
            }

            list.innerHTML = data.map(c => `
                <div class="glass-panel p-4 rounded-lg border border-gray-700/50">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center gap-3">
                            ${c.author_avatar 
                                ? `<img src="${c.author_avatar}" class="w-8 h-8 rounded-full border border-gray-600">`
                                : `<div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white"><i class="fa-solid fa-user"></i></div>`
                            }
                            <span class="font-bold text-white text-sm">${c.author_name}</span>
                        </div>
                        ${c.community_score !== null ? `<span class="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded text-xs font-bold font-mono">${parseFloat(c.community_score).toFixed(1)}</span>` : ''}
                    </div>
                    <p class="text-gray-300 text-sm leading-relaxed">${c.comment_text}</p>
                    <span class="text-[10px] text-gray-500 mt-2 block">${new Date(c.created_at).toLocaleString()}</span>
                </div>
            `).join('');
        } else {
            scoreContainer.classList.add('hidden');
            list.innerHTML = '<p class="text-gray-500 text-sm italic text-center py-4">Aún no hay comentarios. ¡Sé el primero!</p>';
        }
    } catch (err) {
        console.error("Error cargando comentarios:", err);
        list.innerHTML = '<p class="text-red-400 text-sm">Error al cargar comentarios.</p>';
    }
}

// Reactions
const reactionIcons = {
    'like': 'fa-thumbs-up text-blue-400',
    'dislike': 'fa-thumbs-down text-purple-400',
    'love': 'fa-heart text-red-500',
    'fire': 'fa-fire text-orange-500'
};
const reactionLabels = {
    'like': 'Me Gusta',
    'dislike': 'No Me Gusta',
    'love': 'Me Encanta',
    'fire': 'Fuego'
};

export async function loadReactions(reviewId) {
    const container = document.getElementById('review-detail-reactions');
    container.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-gray-500"></i>';

    try {
        const { data, error } = await supabase
            .from('review_reactions')
            .select('*')
            .eq('review_id', reviewId);

        if (error) throw error;

        const counts = { 'like': 0, 'dislike': 0, 'love': 0, 'fire': 0 };
        if (data) {
            data.forEach(r => { counts[r.reaction_type] = r.count; });
        }

        container.innerHTML = Object.keys(counts).map(type => `
            <button onclick="handleReaction('${reviewId}', '${type}')" class="flex items-center gap-2 bg-gaming-dark hover:bg-gray-700 border border-gray-600 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-110 active:scale-95 group shadow-lg">
                <i class="fa-solid ${reactionIcons[type]} group-hover:-translate-y-1 transition-transform text-lg"></i>
                <span class="hidden sm:inline text-gray-400 font-normal text-xs ml-1">${reactionLabels[type]}</span>
                <span id="reaction-count-${type}" class="ml-1">${counts[type]}</span>
            </button>
        `).join('');

    } catch (err) {
        console.error("Error cargando reacciones:", err);
        container.innerHTML = '<span class="text-gray-500 text-xs">Error cargando reacciones</span>';
    }
}

export async function handleReaction(reviewId, type) {
    const storageKey = `reacted_${reviewId}_${type}`;
    if (localStorage.getItem(storageKey)) {
        showAlert("Ya reaccionaste", "Solo puedes enviar esta reacción una vez por reseña.", "info");
        return;
    }

    try {
        // Optimistic UI update
        const countEl = document.getElementById(`reaction-count-${type}`);
        if(countEl) countEl.innerText = parseInt(countEl.innerText) + 1;
        
        // Save to LocalStorage to prevent spam
        localStorage.setItem(storageKey, 'true');

        const { data: existing } = await supabase
            .from('review_reactions')
            .select('id, count')
            .eq('review_id', reviewId)
            .eq('reaction_type', type)
            .single();

        if (existing) {
            await supabase.from('review_reactions')
                .update({ count: existing.count + 1 })
                .eq('id', existing.id);
        } else {
            await supabase.from('review_reactions')
                .insert([{ review_id: reviewId, reaction_type: type, count: 1 }]);
        }
    } catch (err) {
        console.error("Error guardando reacción:", err);
    }
}

// Polls
let currentPollId = null;

export async function loadActivePoll(justVoted = false) {
    const container = document.getElementById('home-poll-container');
    const questionEl = document.getElementById('poll-question');
    const optionsEl = document.getElementById('poll-options');
    const totalEl = document.getElementById('poll-total-votes');
    const adminStatsContainer = document.getElementById('admin-poll-stats-container');

    try {
        const { data: polls, error: pollError } = await supabase
            .from('polls')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1);

        if (pollError) throw pollError;

        if (!polls || polls.length === 0) {
            if(container) container.classList.add('hidden');
            if(adminStatsContainer) adminStatsContainer.innerHTML = '<p class="text-gray-400 text-sm italic">No hay ninguna encuesta activa.</p>';
            return;
        }

        const poll = polls[0];
        currentPollId = poll.id;
        if(questionEl) questionEl.innerText = poll.question;

        const { data: options, error: optError } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', poll.id)
            .order('id', { ascending: true });

        if (optError) throw optError;

        const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
        if(totalEl) totalEl.innerText = `${totalVotes} votos totales`;

        // Render Admin Stats
        if (adminStatsContainer) {
            adminStatsContainer.innerHTML = options.map(opt => {
                const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                return `
                    <div class="mb-3">
                        <div class="flex justify-between text-sm text-gray-300 mb-1">
                            <span>${opt.option_text}</span>
                            <span class="font-bold text-white">${opt.votes} votos (${percent}%)</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style="width: ${percent}%"></div>
                        </div>
                    </div>
                `;
            }).join('') + `<p class="text-xs text-gray-400 mt-4 text-right border-t border-gray-700 pt-2">${totalVotes} votos totales en la encuesta actual.</p>`;
        }

        const hasVoted = localStorage.getItem(`voted_poll_${poll.id}`);

        // Hide for regular users if already voted (and we didn't just vote)
        if (hasVoted && !justVoted) {
            if(container) container.classList.add('hidden');
            return;
        }

        if(container) container.classList.remove('hidden');

        if(optionsEl) {
            optionsEl.innerHTML = options.map(opt => {
                const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                if (hasVoted || justVoted) {
                    return `
                        <div class="relative w-full bg-gaming-dark border border-gray-600 rounded overflow-hidden p-3 flex justify-between items-center z-10 shadow-inner">
                            <div class="absolute left-0 top-0 h-full bg-indigo-600/40 z-[-1] transition-all duration-1000" style="width: ${percent}%"></div>
                            <span class="text-sm font-bold text-white drop-shadow-md">${opt.option_text}</span>
                            <span class="text-xs text-indigo-300 font-bold drop-shadow-md">${percent}%</span>
                        </div>
                    `;
                } else {
                    return `
                        <button onclick="submitPollVote('${opt.id}')" class="w-full text-left bg-gaming-light hover:bg-indigo-600/30 border border-gray-600 hover:border-indigo-400 p-3 rounded text-sm font-bold text-white transition-colors shadow">
                            ${opt.option_text}
                        </button>
                    `;
                }
            }).join('');
        }

    } catch (err) {
        console.error("Error cargando encuesta:", err);
    }
}

export async function submitPollVote(optionId) {
    if (!currentPollId) return;
    
    try {
        localStorage.setItem(`voted_poll_${currentPollId}`, 'true');

        const { data: opt } = await supabase.from('poll_options').select('votes').eq('id', optionId).single();
        if (opt) {
            await supabase.from('poll_options').update({ votes: (opt.votes || 0) + 1 }).eq('id', optionId);
        }
        
        // Reload to show percentages (pass true to force show even if voted)
        await loadActivePoll(true);

        // Celebrate with confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.8, x: 0.8 }, // Bottom right corner roughly
                colors: ['#4f46e5', '#3b82f6', '#8b5cf6', '#ffffff'] // Gaming/Indigo theme
            });
        }

        // Auto close after 2 seconds (animation takes 1 second in closePollWidget)
        setTimeout(() => {
            if (window.closePollWidget) window.closePollWidget();
        }, 2000);

    } catch (err) {
        console.error("Error registrando voto:", err);
    }
}

export async function createPoll() {
    if (!isAdmin) return;
    const btn = document.getElementById('createPollBtn');
    const question = document.getElementById('pollQuestionInput').value.trim();
    const optionsText = document.getElementById('pollOptionsInput').value.trim();
    const optionsArray = optionsText.split('\n').map(o => o.trim()).filter(o => o.length > 0);

    if (!question || optionsArray.length < 2) {
        showAlert("Error", "Debes ingresar una pregunta y al menos dos opciones.", "error");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';

    try {
        // Deactivate old polls
        await supabase.from('polls').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to update all

        // Create new poll
        const { data: newPoll, error: pollError } = await supabase
            .from('polls')
            .insert([{ question: question, is_active: true }])
            .select()
            .single();

        if (pollError) throw pollError;

        // Insert options
        const optionsData = optionsArray.map(opt => ({ poll_id: newPoll.id, option_text: opt, votes: 0 }));
        const { error: optsError } = await supabase.from('poll_options').insert(optionsData);

        if (optsError) throw optsError;

        document.getElementById('pollQuestionInput').value = '';
        document.getElementById('pollOptionsInput').value = '';
        showAlert("¡Publicado!", "La nueva encuesta ha sido publicada.", "success");
        await loadActivePoll();
    } catch (err) {
        console.error("Error creando encuesta:", err);
        showAlert("Error", "Hubo un problema al crear la encuesta.", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-bullhorn"></i> Publicar Encuesta';
    }
}

// ==========================================
// USER AUTHENTICATION
// ==========================================

export function openUserLoginModal() {
    document.getElementById('userLoginModal').classList.remove('hidden');
}

export function closeUserLoginModal() {
    document.getElementById('userLoginModal').classList.add('hidden');
}

export async function loginWithProvider(provider) {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        });
        if (error) throw error;
    } catch (err) {
        console.error("Login error:", err);
        showAlert("Error de Login", "No se pudo conectar con " + provider, "error");
    }
}

export async function logoutUser() {
    await supabase.auth.signOut();
}

function handleUserSession(session) {
    currentUser = session ? session.user : null;
    const authContainer = document.getElementById('userAuthContainer');
    
    // Comment form states
    const commentForm = document.getElementById('commentForm');
    const authMessage = document.getElementById('authRequiredMessage');
    const loggedInAvatar = document.getElementById('loggedInAvatar');
    const loggedInName = document.getElementById('loggedInName');

    if (currentUser) {
        const meta = currentUser.user_metadata;
        const name = meta.name || meta.full_name || 'Usuario';
        const avatar = meta.avatar_url || 'https://placehold.co/400x400/1e293b/3b82f6?text=U';
        
        // Header UI
        if(authContainer) {
            authContainer.innerHTML = `
                <div class="flex items-center gap-3 bg-gaming-light/50 px-3 py-1.5 rounded-lg border border-gray-700 shadow-inner">
                    <img src="${avatar}" class="w-7 h-7 rounded-full border border-indigo-500">
                    <span class="text-sm font-bold text-white hidden sm:inline">${name.split(' ')[0]}</span>
                    <button onclick="logoutUser()" class="text-gray-400 hover:text-red-400 transition-colors ml-2" title="Cerrar sesión">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            `;
        }

        // Comment form UI
        if(commentForm && authMessage) {
            authMessage.classList.add('hidden');
            commentForm.classList.remove('hidden');
            loggedInAvatar.src = avatar;
            loggedInName.innerText = name;
        }

    } else {
        // Header UI
        if(authContainer) {
            authContainer.innerHTML = `
                <button onclick="openUserLoginModal()" class="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-sm font-medium transition-all text-white flex items-center gap-2 shadow-lg">
                    <i class="fa-solid fa-user"></i> Iniciar Sesión
                </button>
            `;
        }

        // Comment form UI
        if(commentForm && authMessage) {
            authMessage.classList.remove('hidden');
            commentForm.classList.add('hidden');
        }
    }
}

// ==========================================
// ABOUT ME SECTION
// ==========================================

export async function loadAboutMe() {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('key, value')
            .in('key', ['about_me', 'about_name', 'about_role']);
            
        if (error) {
            if (error.code !== 'PGRST116') throw error;
        } else if (data && data.length > 0) {
            data.forEach(item => {
                if(item.key === 'about_me') currentAboutMeText = item.value;
                if(item.key === 'about_name') currentAboutMeName = item.value;
                if(item.key === 'about_role') currentAboutMeRole = item.value;
            });
            renderAboutMeDisplay();
        }
    } catch (err) {
        console.error("Error loading About Me:", err);
    }
}

function renderAboutMeDisplay() {
    const displayContainer = document.getElementById('aboutMeTextDisplay');
    const nameDisplay = document.getElementById('aboutMeNameDisplay');
    const roleDisplay = document.getElementById('aboutMeRoleDisplay');

    if (!displayContainer) return;
    
    const paragraphs = currentAboutMeText.split('\n\n').filter(p => p.trim());
    
    if (paragraphs.length === 0) {
        displayContainer.innerHTML = '<p class="text-gray-500 italic">No hay información sobre mí todavía.</p>';
    } else {
        displayContainer.innerHTML = paragraphs.map(p => `<p class="mb-4">${p}</p>`).join('');
    }

    if(nameDisplay) nameDisplay.innerText = currentAboutMeName || 'Alex Pixel';
    if(roleDisplay) roleDisplay.innerText = currentAboutMeRole || 'Crítico & Editor Gamer';
}

export function editAboutMe() {
    if (!isAdmin) return;
    document.getElementById('aboutMeContentContainer').classList.add('hidden');
    document.getElementById('editAboutMeBtn').classList.add('hidden');
    
    const editorContainer = document.getElementById('aboutMeEditorContainer');
    editorContainer.classList.remove('hidden');
    
    document.getElementById('aboutMeNameInput').value = currentAboutMeName;
    document.getElementById('aboutMeRoleInput').value = currentAboutMeRole;
    document.getElementById('aboutMeTextarea').value = currentAboutMeText;
    
    document.getElementById('aboutMeNameInput').focus();
}

export function cancelEditAboutMe() {
    const editorContainer = document.getElementById('aboutMeEditorContainer');
    if (!editorContainer) return;
    editorContainer.classList.add('hidden');
    
    document.getElementById('aboutMeContentContainer').classList.remove('hidden');
    
    if (isAdmin) {
        document.getElementById('editAboutMeBtn').classList.remove('hidden');
    }
}

export async function saveAboutMe() {
    if (!isAdmin) return;
    
    const btn = document.getElementById('saveAboutMeBtn');
    const newName = document.getElementById('aboutMeNameInput').value.trim();
    const newRole = document.getElementById('aboutMeRoleInput').value.trim();
    const newText = document.getElementById('aboutMeTextarea').value.trim();
    
    if (!newText || !newName) {
        showAlert("Error", "El nombre y la biografía no pueden estar vacíos.", "error");
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    
    try {
        // Update each setting individually to avoid upsert RLS issues
        const { error: e1 } = await supabase.from('site_settings').update({ value: newText }).eq('key', 'about_me');
        if (e1) throw e1;
        
        const { error: e2 } = await supabase.from('site_settings').update({ value: newName }).eq('key', 'about_name');
        if (e2) throw e2;
        
        const { error: e3 } = await supabase.from('site_settings').update({ value: newRole }).eq('key', 'about_role');
        if (e3) throw e3;
        
        currentAboutMeText = newText;
        currentAboutMeName = newName;
        currentAboutMeRole = newRole;
        
        renderAboutMeDisplay();
        cancelEditAboutMe();
        showAlert("Éxito", "La sección 'Sobre Mí' ha sido actualizada.", "success");
    } catch (err) {
        console.error("Error guardando About Me:", err);
        const msg = err.message || err.details || JSON.stringify(err);
        showAlert("Error", "No se pudo guardar: " + msg, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-save"></i> Guardar';
    }
}
