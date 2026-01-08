// ==UserScript==
// @name         Generic Focus Listeners Override
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Override feature switches on YouTube TV and style scrollbars with dark and transparent appearance
// @author       You
// @match        https://www.youtube.com/tv*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    // Override the properties directly on the window object

    // anti-blur-detection

    // Store the original `addEventListener` method
 // List of event types to block
    const blockedEvents = ["blur", "visibilitychange", "focusout"];

    // Storage for tracking added listeners
    const trackedListeners = new Map();

    // Helper function to track listeners
    function trackListener(target, type, listener) {
        if (!trackedListeners.has(target)) {
            trackedListeners.set(target, new Map());
        }
        const targetListeners = trackedListeners.get(target);
        if (!targetListeners.has(type)) {
            targetListeners.set(type, new Set());
        }
        targetListeners.get(type).add(listener);
    }

    // Helper function to remove tracked listeners
    function removeTrackedListener(target, type) {
        const targetListeners = trackedListeners.get(target);
        if (targetListeners && targetListeners.has(type)) {
            targetListeners.get(type).forEach(listener => {
                target.removeEventListener(type, listener);
                console.log(`[TamperMonkey] Removed listener for "${type}" on`, target);
            });
            targetListeners.delete(type);
        }
    }

    // Monkey-patch addEventListener
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (blockedEvents.includes(type)) {
            console.warn(`[TamperMonkey] Blocking addition of listener for "${type}" on`, this);
            trackListener(this, type, listener); // Track the listener even if blocked
            return;
        }
        originalAddEventListener.call(this, type, listener, options);
    };

    // Monkey-patch removeEventListener for completeness
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
        if (trackedListeners.has(this) && trackedListeners.get(this).has(type)) {
            trackedListeners.get(this).get(type).delete(listener);
        }
        originalRemoveEventListener.call(this, type, listener, options);
    };

    // Cleanup function to remove already registered blocked listeners
    function cleanupBlockedListeners() {
        trackedListeners.forEach((typeListeners, target) => {
            blockedEvents.forEach(eventType => {
                if (typeListeners.has(eventType)) {
                    removeTrackedListener(target, eventType);
                }
            });
        });
    }

    cleanupBlockedListeners();

})();
