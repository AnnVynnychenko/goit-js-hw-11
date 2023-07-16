'use strict'

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Pixabay } from "./pixabay";
// import { LoadMoreBtn } from "./load-more-btn";

const refs =  {
    formEL: document.querySelector('.search-form'),
    listOfImagesEl: document.querySelector('.gallery'),
	infoEl: document.querySelector('.info'),
	target: document.querySelector('.js-guard'),
}

// const loadMore = new LoadMoreBtn();

refs.formEL.addEventListener('submit', onSubmit);
// loadMore.loadMoreBtn.addEventListener('click', onLoadMore);

const gallery = new Pixabay();

let options = {
    root: null,
    rootMargin: '300px',
    threshold: 1.0
};



function onLoad(entries, observer) {
	entries.forEach(entry => {
		if(entry.isIntersecting) {
			gallery.incrementPage();
			gallery.getPhotos().then(({totalHits, hits}) => {
				appendMarkup(hits);
				// smoothScroll();
				endOfCollection(totalHits);
				const lastPage = Math.ceil(totalHits/gallery.per_page);
				if(gallery.page === lastPage) {
					observer.unobserve(refs.target);
				}
			}).catch(err => console.log(err));
			};
	})
	
};

let observer = new IntersectionObserver(onLoad, options);

function endOfCollection(totalHits) {
	const lastPage = Math.ceil(totalHits/gallery.per_page);
	if(gallery.page === lastPage) {
		// loadMore.hide();
		return Notify.failure('We are sorry, but you have reached the end of search results.')
	}
};

function createMarkup(images) {
    return images.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<div class="photo-card">
					<a href='${largeImageURL}'>
						<img src="${webformatURL}" alt="${tags}" loading="lazy"/>
						<div class="info">
							<p class="info-item">
								<b>Likes</b>
								${likes}
							</p>
							<p class="info-item">
								<b>Views</b>
								${views}
							</p>
							<p class="info-item">
								<b>Comments</b>
								${comments}
							</p>
							<p class="info-item">
								<b>Downloads</b>
								${downloads}
							</p>
	            		</div>
					</a>
      			</div>`
    }).join('');
}

function appendMarkup(images) {
	refs.listOfImagesEl.insertAdjacentHTML('beforeend', createMarkup(images));
};

function clearMarkup() {
	refs.listOfImagesEl.innerHTML = '';
};

function onSubmit(e) {
	e.preventDefault();
	// loadMore.hide();
	const {searchQuery} = e.target.elements;
	const researchValue = searchQuery.value.trim();
	gallery.query = researchValue;
	gallery.resetPage();
	gallery.getPhotos().then(({totalHits, hits}) => {
		clearMarkup();
		if(hits.length === 0) {
			return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
		} 
		window.scrollTo({ top: 0, behavior: 'smooth' });
		appendMarkup(hits);
		Notify.success(`Hooray! We found ${totalHits} images.`);
		observer.observe(refs.target);
		// loadMore.show();
		endOfCollection(totalHits);
		
	}).catch(err => console.log(err))
};

// function smoothScroll() {
// const cardElement = refs.listOfImagesEl.firstElementChild;
// const {height: cardHeight} = cardElement.getBoundingClientRect();
// const {height: infoHeight} = refs.formEL.getBoundingClientRect();
// const totalHeight = cardHeight + infoHeight;
// window.scrollBy({
// 	top: totalHeight * 1.5,
// 	behavior: "smooth",
// 	});
// }

// function onLoadMore(e) {
// 	e.preventDefault();
// const newQuery = gallery.query;
// gallery.query = newQuery;
// gallery.incrementPage();
// gallery.getPhotos().then(({totalHits, hits}) => {
// 	appendMarkup(hits);
// 	smoothScroll();
// 	endOfCollection(totalHits);
// }).catch(err => console.log(err));
// };


function onGalleryItemClick(e) {
	e.preventDefault();
	let clickedItemEl = e.target.closest('.photo-card');
	if (!clickedItemEl) {
		return;
	};

	let galleryOfImages = new SimpleLightbox('.photo-card a');

	document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            galleryOfImages.close()
        }
    });

      document.removeEventListener('keydown', event => {
        if (event.key === 'Escape') {
            galleryOfImages.close()
        }
    });
};

function initGallery(images) {
	gallery.getPopularPhotos().then(({hits}) => {
		clearMarkup();
		appendMarkup(hits);
		observer.observe(refs.target);
		// loadMore.show();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}).catch(err => console.log(err))
	refs.listOfImagesEl.addEventListener('click', onGalleryItemClick);
}

initGallery(gallery);
	

