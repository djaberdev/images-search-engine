// Main Settings
let apiKey = 'gkz0O7CJCYnpkkIMOpLJp7lnGN2s4UWn0MiVItMJs4rd1AIkXKivrTje';
let perPage = 15;
let currentPage = 1;
let apiUrl = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`;
 
// Select Main Elements 
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.getElementById('search-btn');
const imagesContainer = document.querySelector('.gallery .images');
const showMoreBtn = document.getElementById('show-more');

// The Function That Get The Images Data From The API 
function getImages(apiUrl) {
    
    // Changing The Show More Btn Content To Seems Like Its 'Loading...'
    showMoreBtn.textContent = 'Loading...';
    showMoreBtn.classList.add('disabled');

    // Fetching Part
    fetch(apiUrl, {
        method: "GET",
        headers: {
            Authorization: apiKey,
        },
    })
    .then(response => response.json())
    .then(data => displayImages(data.photos))
    .catch(() => {
        imagesContainer.parentElement.innerHTML = `
            <div class="error-box">
                <img src="assets/error.png" alt="Error img">
                <h3 class="alert-text">Can't Fetch Images Data!</h3>
                <p>Reload the page and try again</p>
            </div>
        `;
    });

    // Get Back The Styles Of The Show More Btn
    setTimeout(() => {
        showMoreBtn.textContent = 'Show More';
        showMoreBtn.classList.remove('disabled'); 
    }, 3000);

};

// Get The Images Data From The API By Sreaching
function searchForImages() {

    const inputValue = searchInput.value;
    
    if (inputValue === '') {
        handleError('Try to fill the search bar.');
    } else {

        // Upadte apiUrl If User Enter Somthing
        apiUrl = `https://api.pexels.com/v1/search?query=${inputValue}&per_page=${perPage}&page=${currentPage}`; 

        // Fetching Using The getImages()
        getImages(apiUrl);

    }

};

// Event Listeners
document.addEventListener('DOMContentLoaded', getImages(apiUrl));
searchBtn.onclick = () => {
    emptyElement(imagesContainer);
    searchForImages();
};
searchInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") searchBtn.click();
});

function handleError(message) { alert(message) };

function emptyElement(el) { el.innerHTML = '' };

function displayImages(imagesData) {

    // Loop Through The imagesData Object
    imagesData.forEach(imageObj => {
        
        // Extract Main Informations
        let { photographer, photographer_url, src: { original: imageSrc } } = imageObj;

        const imageCard = document.createElement('li');
        imageCard.className = 'image-card';
        imageCard.onclick = (event) => {

            // Check if the clicked target is NOT a descendant of `.details` or `.download-btn`
            if (!event.target.closest('.details') && !event.target.closest('.download-btn')) {
                showLightBox(imageObj);
            }
            
        };


        imageCard.innerHTML = `
            <img src="${imageSrc}">
            <div class="details">
                <div class="photographer-box">
                    <i class="ri-camera-line"></i>
                    <a href="${photographer_url}" target="_blank" class="photographer-name">${photographer}</a>
                </div>
                <button class="download-btn" onclick="downloadImage('${imageSrc}')">
                    <i class="ri-download-2-line icon-btn"></i>
                </button>
            </div>
        `;

        imagesContainer.appendChild(imageCard);

    }); 

};

/* -- Light Box Part -- */

const lightBox = document.querySelector('.light-box');
const LBwrapper = lightBox.querySelector('.wrapper');
const LBphotographer = lightBox.querySelector('.photographer-name');
const LBcloseBtn = lightBox.querySelector('#close-btn');
const LBdownloadBtn = lightBox.querySelector('.download-btn');
const LBexpImage = lightBox.querySelector('.exp-image');

function showLightBox(imageObj) {

    // Get Main Infos From imageObj
    let { photographer, src: { original: imageSrc } } = imageObj;

    // Add Infos To Specified Elements
    LBphotographer.textContent = photographer;
    LBexpImage.src = imageSrc;

    // Show Both 'lightBox' & 'wrapper'
    lightBox.classList.add('show');
    setTimeout(() => {
        LBwrapper.classList.add('show');
    }, 800);

};

LBcloseBtn.addEventListener('click', () => {
    // Hide Both 'lightBox' & 'wrapper'
    LBwrapper.classList.remove('show');
    setTimeout(() => {
        lightBox.classList.remove('show');
    }, 600);
});

/* -- Show More Images Part -- */

function loadMoreImages() {

    // Inceasing 'currentPage' By 1
    currentPage++;

    // Get The Data After Updating The Variable Above
    if (searchInput.value.length > 0) {
        getImages(`https://api.pexels.com/v1/search?query=${searchInput.value}&per_page=${perPage}&page=${currentPage}`);
    } else {
        getImages(`https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`);
    }

};

/* -- Download Image Part -- */

function downloadImage(imgUrl) {

    // Converting spicified img url to blob, create its download link & downloading it. 
    fetch(imgUrl).then(response => response.blob()).then(file => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => handleError('Failed To Download Image.'));

};

// Trigger The downloadImage()
document.querySelector('.light-box #downloader').onclick = () => downloadImage(LBexpImage.getAttribute('src'));