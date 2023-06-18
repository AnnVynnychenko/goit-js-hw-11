'use strict'

export class LoadMoreBtn {
    constructor() {
    this.loadMoreBtn = document.querySelector('.load-more');
    }

        hide() {
            this.loadMoreBtn.classList.add('is-hidden');
        }

        show() {
            this.loadMoreBtn.classList.remove('is-hidden');
        }

}