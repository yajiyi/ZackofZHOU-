// ==UserScript==
// @name         ZackofZHOU 的新头像
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ZackofZHOU 的新头像
// @match        *://*.luogu.com.cn/*
// @match        *://luogu.com.cn/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_URL = 'https://cdn.luogu.com.cn/upload/usericon/948216.png';
    const CUSTOM_URL = 'https://alist.yajiyi.top/d/disk/%E6%97%A0%E6%A0%87%E9%A2%98.png?sign=Sqi0BJPfH8SfZ2oQe9osPsRlcoGhan9JM1_IzGa0v2A=:0';

    function isTarget(url) {
        if (!url || typeof url !== 'string') return false;
        try {
            const full = new URL(url, location.href).href;
            return full === TARGET_URL;
        } catch {
            return false;
        }
    }

    function replaceIfTarget(url) {
        return isTarget(url) ? CUSTOM_URL : url;
    }

    const imgSrcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if (imgSrcDesc && imgSrcDesc.set && imgSrcDesc.get) {
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            configurable: true,
            enumerable: imgSrcDesc.enumerable,
            get: function () {
                return imgSrcDesc.get.call(this);
            },
            set: function (value) {
                return imgSrcDesc.set.call(this, replaceIfTarget(value));
            }
        });
    }

    const rawSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
        if (
            this instanceof HTMLImageElement &&
            typeof name === 'string' &&
            name.toLowerCase() === 'src'
        ) {
            value = replaceIfTarget(value);
        }
        return rawSetAttribute.call(this, name, value);
    };

    function fixExistingImages(root = document) {
        root.querySelectorAll('img').forEach(img => {
            const srcAttr = img.getAttribute('src');
            if (isTarget(srcAttr) || isTarget(img.src)) {
                img.src = CUSTOM_URL;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => fixExistingImages());
    } else {
        fixExistingImages();
    }
})();
