module.exports = isolate

function isolate (el) {
  var handler = makeHandler(el)

  var addEvent = (el.addEventListener || el.attachEvent).bind(el)
  var removeEvent = (el.removeEventListener || el.detachEvent).bind(el)

  addEvent('mousewheel', handler)
  addEvent('DOMMouseScroll', handler)

  return function () {
    removeEvent('mousewheel', handler)
    removeEvent('DOMMouseScroll', handler)
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
function makeHandler (el) {
  return function (event) {
    var scrollTop = el.scrollTop
    var scrollHeight = el.scrollHeight
    var clientHeight = el.clientHeight

    if (scrollHeight === clientHeight) return

    var type = event.type
    var detail = event.detail
    var wheelDelta = event.wheelDelta

    var height = calculateHeight(el)
    var delta = type === 'DOMMouseScroll' ? detail * -40 : wheelDelta
    var up = delta > 0

    function prevent () {
      event.stopPropagation()
      event.preventDefault()
      event.returnValue = false
      return false
    }

    if (!up && -delta > scrollHeight - height - scrollTop) {
      el.scrollTop = scrollHeight
      return prevent()
    }
    else if (up && delta > scrollTop) {
      el.scrollTop = 0
      return prevent()
    }
  }
}
