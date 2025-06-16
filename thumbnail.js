// ==UserScript==
// @name         YouTube Thumbnail Next to Description
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Injects thumbnail beside the description without affecting other layout parts
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const getVideoId = () => new URLSearchParams(location.search).get("v");

    const createThumbnail = () => {
        const videoId = getVideoId();
        if (!videoId) return null;

        const img = document.createElement("img");
        img.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
        img.alt = "Video Thumbnail";
        img.style.width = "240px";
        img.style.borderRadius = "8px";
        img.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
        img.style.flexShrink = "0";
        return img;
    };

    const injectNextToDescriptionOnly = () => {
        const descWrapper = document.querySelector('#description-inner');
        const descBox = document.querySelector('#description');

        if (!descWrapper || !descBox || document.querySelector('.yt-desc-row')) return;

        const thumb = createThumbnail();
        if (!thumb) return;

        const flexContainer = document.createElement('div');
        flexContainer.className = 'yt-desc-row';
        flexContainer.style.display = 'flex';
        flexContainer.style.flexDirection = 'row';
        flexContainer.style.gap = '16px';
        flexContainer.style.marginTop = '16px';
        flexContainer.style.alignItems = 'flex-start';

        const descClone = descBox.cloneNode(true);
        descClone.style.flex = '1';
        descClone.style.minWidth = '0';

        descBox.style.display = 'none';

        flexContainer.appendChild(thumb);
        flexContainer.appendChild(descClone);

        descWrapper.appendChild(flexContainer);
    };

    const waitForReady = () => {
        const interval = setInterval(() => {
            if (document.querySelector('#description') && document.querySelector('#description-inner')) {
                clearInterval(interval);
                setTimeout(() => injectNextToDescriptionOnly(), 300);
            }
        }, 300);
    };

    let lastUrl = location.href;
    const watchUrl = setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;

            document.querySelectorAll('.yt-desc-row').forEach(el => el.remove());
            const desc = document.querySelector('#description');
            if (desc) desc.style.display = '';

            waitForReady();
        }
    }, 500);

    waitForReady();
})();
