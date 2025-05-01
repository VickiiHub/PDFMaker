/**
 * @description Helper Functions: ESM
 */

// References:
const DOC   = document
const LOG   = console.log
const TABLE = console.table
const ERROR = console.error


/**
 * @description Element Selection. 
 * @type {String} 
 */
function $(ElementRef ) {

  // elementById:
  if (ElementRef.charAt(0) === '#') {
    ElementRef = ElementRef.slice(1)
    return DOC.getElementById(ElementRef)
  }

  // elementsByClass:
  if (ElementRef.charAt(0) === '.') {
    ElementRef = ElementRef.slice(1)

    return DOC.getElementsByClassName(ElementRef)
  }

  // elementsByTag:
  if (ElementRef.charAt(0) === '<') {
    ElementRef = ElementRef.slice(1)
    ElementRef = ElementRef.slice(0, -1)

    return DOC.getElementsByTagName(ElementRef)
  }
}

/** 
 * @description Query Selector All
 * @param {string} QueryRef
 */
function $$(QueryRef) {
  return DOC.querySelectorAll(QueryRef)
}

/**
 * @description Event Selection. 
 * @param {string} ElementRef,
 * @param {string} event,
 * @param {function} callback
 */
function LISTEN(ElementRef, Event, Callback) {
  const EVENT = Event.toLowerCase()
  $(ElementRef).addEventListener(EVENT, Callback)
}

export { $, $$, LISTEN, DOC, LOG, TABLE, ERROR }