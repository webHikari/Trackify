import Trackify from './Trackify'; // укажи правильный путь до Trackify

class EventTracker {
  static trackMouseMovement() {
    document.addEventListener('mousemove', (e) => {
      Trackify.trackEvent('mouse-move', { x: e.clientX, y: e.clientY });
    });
  }

  static trackClicks() {
    document.addEventListener('click', (e) => {
      Trackify.trackEvent('click', { x: e.clientX, y: e.clientY, element: e.target });
    });
  }

  static trackScroll() {
    window.addEventListener('scroll', () => {
      Trackify.trackEvent('scroll', { scrollY: window.scrollY });
    });
  }
}

export default EventTracker;
