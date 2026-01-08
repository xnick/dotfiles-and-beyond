// ==UserScript==
// @name         YouTube TV Unlock + Feature Overrides with Custom Dark Scrollbars
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Override feature switches on YouTube TV, style scrollbars with dark and transparent appearance, and switch user agent based on page URL
// @author       You
// @match        https://www.youtube.com/tv*
// @grant        none
// @run-at       document-start   // Run the script early in the document lifecycle
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and modify all YouTube video thumbnail URLs
    function modifyThumbnailURLs() {
        // Find all thumbnail elements that contain a background-image style
        const thumbnails = document.querySelectorAll('ytlr-thumbnail-details[style*="background-image"]');

        thumbnails.forEach(thumbnail => {
            // Get the background-image URL from the inline style
            const backgroundStyle = thumbnail.style.backgroundImage;
            if (backgroundStyle) {
                // Extract the URL from the background-image style
                const urlMatch = backgroundStyle.match(/url\(["'](https:\/\/i\.ytimg\.com\/vi\/[a-zA-Z0-9_-]+\/hq.*?)["']\)/);
                if (urlMatch && urlMatch[1]) {
                    const originalUrl = urlMatch[1];
                    const maxresUrl = originalUrl.replace('/hq', '/maxres');
                    const sdUrl = originalUrl.replace('/hq', '/sd');

                    // Check if maxres image exists and is valid; fallback to sd image if not
                    checkImageExistenceAndResolution(maxresUrl, (isMaxresValid) => {
                        if (isMaxresValid) {
                            // If maxres image is valid, use it
                            thumbnail.style.backgroundImage = `url("${maxresUrl}")`;
                        } else {
                            // Otherwise, fall back to the SD image
                            checkImageExistenceAndResolution(sdUrl, (isSdValid) => {
                                if (isSdValid) {
                                    // If SD image is valid, use it
                                    thumbnail.style.backgroundImage = `url("${sdUrl}")`;
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    // Function to check if an image exists and is not the placeholder by checking its dimensions
    function checkImageExistenceAndResolution(url, callback) {
        const img = new Image();
        img.onload = function () {
            // Check if the resolution is the placeholder (120x90)
            if (img.width === 120 && img.height === 90) {
                // If the dimensions are 120x90, assume it's the placeholder
                callback(false); // It's the placeholder image
            } else {
                // Otherwise, it's a valid image
                callback(true);
            }
        };
        img.onerror = function () {
            // If there's an error (e.g., image doesn't exist), assume the image is invalid
            callback(false);
        };
        img.src = url;  // Trigger image loading
    }

    // Run the function to modify thumbnails when the page loads
    window.addEventListener('load', modifyThumbnailURLs);

    // Optionally, observe changes to the DOM (e.g., for dynamically loaded thumbnails)
    const observer = new MutationObserver(modifyThumbnailURLs);
    observer.observe(document.body, { childList: true, subtree: true });

    // Override the properties directly on the window object
    Object.defineProperty(window, 'tectonicConfig', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: window.tectonicConfig || {}
    });

    Object.defineProperty(window.tectonicConfig, 'featureSwitches', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: window.tectonicConfig.featureSwitches || {}
    });

    // Override 'enableAnimations' to always return true and prevent setting to false
    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enableAnimations', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    // Override 'enableAmbientInterludes' to always return true and prevent setting to false
    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enableAmbientInterludes', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    // Override 'enableStartupSound' to always return true and prevent setting to false
    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enableStartupSound', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    // Override 'enableAndroidAttestation' to always return true and prevent setting to false
    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enableAndroidAttestation', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    // Override 'enableListAnimations' to always return true and prevent setting to false
    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enableListAnimations', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    // Override 'enableTouchSupport' to always return true and prevent setting to false
    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enableTouchSupport', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    Object.defineProperty(window.tectonicConfig.featureSwitches, 'isLimitedMemory', {
        get: function() {
            return false; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    Object.defineProperty(window.tectonicConfig.featureSwitches, 'isServiceWorkerCapable', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enableLightweightTimely', {
        get: function() {
            return false; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enableLiveChat', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enablePageServiceCache', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    Object.defineProperty(window.tectonicConfig.featureSwitches, 'enableRoundedProgressBar', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    Object.defineProperty(window.tectonicConfig.featureSwitches, 'forceVoiceIncapable', {
        get: function() {
            return false; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    Object.defineProperty(window.tectonicConfig.featureSwitches, 'forceVoiceEnabled', {
        get: function() {
            return true; // Always return true
        },
        set: function() {
            // Do nothing, prevent setting it to false or any other value
        },
        configurable: false // Prevent reconfiguring this property
    });

    // Apply CSS to modify scrollbars to look darker, semi-transparent, and hide tracks
    const style = document.createElement('style');
    style.innerHTML = `
        /* Mobile-like scrollbars with dark and semi-transparent appearance */
        ::-webkit-scrollbar {
            width: 0px;  /* Width of the scrollbar */
            height: 0px; /* Height of horizontal scrollbar */
        }

        ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.6);  /* Dark and semi-transparent thumb */
            border-radius: 10px;
            border: 0px solid rgba(255, 255, 255, 0.3); /* Adds a little space around the thumb */
        }

        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.8);  /* Darker color when hovered */
        }

        ::-webkit-scrollbar-track {
            background: transparent;  /* Make the track invisible */
        }
    `;
    document.head.appendChild(style);



})();
