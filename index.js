module.exports = isolate

function isolate (el, always) {
  var handler = makeHandler(el, always)

  var addEvent = (el.addEventListener || el.attachEvent).bind(el)
  var removeEvent = (el.removeEventListener || el.detachEvent).bind(el)
  var wheelEvent = 'onwheel' in el ? 'wheel' :
    'onmousewheel' in el ? 'mousewheel' :
    'DOMMouseScroll'

  addEvent(wheelEvent, handler)

  return function () {
    removeEvent(wheelEvent, handler)
  }
}

function calculateHeight (el) {
  // Source adapted from: http://youmightnotneedjquery.com/#outer_height_with_margin
  var height = el.offsetHeight

  var style = getComputedStyle(el)
  var marginTop = style.marginTop
  var marginBottom = style.marginBottom

  height += parseInt(marginTop, 10) + parseInt(marginBottom, 10)
  return height
}

// Source adapted from: http://stackoverflow.com/a/16324762
function makeHandler (el, always) {
  var lastScrollTop = null
  var timeout = null

  return function (event) {
    var scrollTop = el.scrollTop
    var scrollHeight = el.scrollHeight
    var clientHeight = el.clientHeight

    if (!always && scrollHeight === clientHeight) return

    var type = event.type
    var detail = event.detail
    var wheelDelta = event.wheelDelta || event.deltaY

    var height = calculateHeight(el)
    var delta = type === 'DOMMouseScroll' ? detail * -40 : wheelDelta

    function prevent () {
      event.stopPropagation()
      event.preventDefault()
      event.returnValue = false
      return false
    }

    if (!always) {
      clearTimeout(timeout)
      timeout = setTimeout(resetLastScrollTop, 32)
    }

    var lt = delta > scrollTop
    var gt = -delta > scrollHeight - height - scrollTop

    if (lt || gt) {
      if (!always && lastScrollTop === null) return
      el.scrollTop = lt ? 0 : scrollHeight
      return prevent()
    }

    lastScrollTop = scrollTop
  }

  function resetLastScrollTop () {
    lastScrollTop = null
  }
}
