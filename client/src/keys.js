const keys = {
  mouseButton: {
    pressed: false,
    keyDown: [],
    keyUp: []
  },
  touches: {
    pressed: false,
    keyDown: [],
    keyUp: [],
    refs: {}
  }
};
const scrollCallbacks = [];
const mouseMoveCallbacks = [];
const touchMoveCallbacks = {
  all: []
};
let mouseCoords;

/**
 * Bind mouse click events to canvas
 */
export const addListeners = (_state) => {
  _state.canvas.addEventListener('mousedown', function() {
    keys.mouseButton.pressed = true;
    keys.mouseButton.keyDown.forEach((cb) => cb());
  });
  _state.canvas.addEventListener('mouseup', function() {
    keys.mouseButton.pressed = false;
    keys.mouseButton.keyUp.forEach((cb) => cb());
  });
  //Add an event listener for keydown
  window.addEventListener("keydown", function(e) {
    //If this key isn't in the object, create data for it
    if (typeof(keys[e.keyCode]) === "undefined") {
      keys[e.keyCode] = {
        pressed: true,
        keyDown: [],
        keyUp: []
      };
    } else {
      //Set the key to pressed
      keys[e.keyCode].pressed = true;
      //Loop and call all bound functions
      keys[e.keyCode].keyDown.forEach(cb => cb());
    }
  });

  //Add an event listener for keyup
  window.addEventListener("keyup", function(e) {
    //If this key isn't in the object, create data for it
    if (typeof(keys[e.keyCode]) === "undefined") {
      keys[e.keyCode] = {
        pressed: false,
        keyDown: [],
        keyUp: []
      };
    } else {
      //Set the key to not pressed
      keys[e.keyCode].pressed = false;
      //Loop and call all bound functions
      keys[e.keyCode].keyUp.forEach(cb => cb());
    }
  });

  //Add an event listener for mouse movement
  window.addEventListener("mousemove", function(e) {
    //Get the mouse position
    mouseCoords = [e.clientX, e.clientY];
    mouseMoveCallbacks.forEach(cb => cb(mouseCoords));
  });

  //Add an event listener for mouse wheel events
  window.addEventListener("wheel", function(e) {
    //Cross-browser compatible scroll delta
    let delta = e.wheelDelta != undefined ?
      e.wheelDelta :
      -1 * e.deltaY;
    //Loop through all callbacks
    scrollCallbacks.forEach(cb => cb(delta < 0 ? -1 : 1));
  });
  
  //Add event listener for touch start event
  window.addEventListener("touchstart", function(e) {
    e.preventDefault();
    for (let i=0; i<e.targetTouches.length; i++) {
      const touchEvent = e.targetTouches[i];
      keys.touches.refs[touchEvent.identifier] = touchEvent;
    }
    keys.touches.pressed = true;
    keys.touches.keyDown.forEach(cb => {
      for (let j=0; j<e.targetTouches.length; j++) {
        cb(e.targetTouches[j]);
      }
    });
  }, { passive: false });
  
  //Add event listener for touch end event
  window.addEventListener("touchend", function(e) {
    e.preventDefault();
    for (let i=0; i<e.changedTouches.length; i++) {
      const touchEvent = e.changedTouches[i];
      delete keys.touches.refs[touchEvent.identifier];
      delete touchMoveCallbacks[touchEvent.identifier];
    }
    keys.touches.pressed = Object.keys(keys.touches.refs).length > 0 ? true : false;
    keys.touches.keyUp.forEach(cb => {
      for (let j=0; j<e.changedTouches.length; j++) {
        cb(e.changedTouches[j]);
      }
    });
  }, { passive: false });
  
  //Add event listener for touch move event
  window.addEventListener("touchmove", function(e) {
    e.preventDefault();
    for (let i=0; i<e.changedTouches.length; i++) {
      const touchEvent = e.changedTouches[i];
      if (touchMoveCallbacks[touchEvent.identifier] !== undefined && touchMoveCallbacks[touchEvent.identifier].length > 0) {
        touchMoveCallbacks[touchEvent.identifier].forEach(cb => {
          cb(touchEvent);
        });
        touchMoveCallbacks.all.forEach(cb => {
          cb(touchEvent);
        });
      }
      keys.touches.refs[touchEvent.identifier] = touchEvent;
    }
  }, { passive: false });
}

/**
 * Bind a function to one or more keys to be called when the key(s) is/are pressed.
 * Accepts char code or a string representing the key(s)
 * The first n arguments are keys to bind to
 * The last argument is the callback function
 */
export const keyDown = (...args) => {
  //Loop through every argument and add the callback to it
  for (let i = 0; i < args.length - 1; i++) {
    //Get the key code
    let keyCode = getKeyCode(args[i]);
    //If data does not exist for this key, create it
    if (typeof(keys[keyCode]) === "undefined") {
      keys[keyCode] = {
        pressed: false,
        keyDown: [],
        keyUp: []
      };
    }
    //Push the callback function to the array
    keys[keyCode].keyDown.push(args[args.length - 1]);
  }
}

/**
 * Unbind a function from one or more key's keyDown events
 */
export const unbindKeyDown = (...args) => {
  //loop through every argument and remove the callback from the keyDown array
  for (let i=0; i<args.length - 1; i++) {
    //Get the key code
    let keyCode = getKeyCode(args[i]);
    if (typeof(keys[keyCode]) === "undefined") continue;
    keys[keyCode].keyDown.splice(keys[keyCode].keyDown.indexOf(args[args.length - 1]), 1);
  }
}

/**
 * Bind a function to one or more keys to be called when the key(s) is/are released.
 * Accepts char code or a string representing the key(s)
 * The first n arguments are keys to bind to
 * The last argument is the callback function
 */
export const keyUp = (...args) => {
  //Loop through every argument and add the callback to it
  for (let i = 0; i < args.length - 1; i++) {
    //Get the key code
    let keyCode = getKeyCode(args[i]);
    //If data does not exist for this key, create it
    if (typeof(keys[keyCode]) === "undefined") {
      keys[keyCode] = {
        pressed: false,
        keyDown: [],
        keyUp: []
      };
    }
    //Push the callback function to the array
    keys[keyCode].keyUp.push(args[args.length - 1]);
  }
}

/**
 * Unbind a function from one or more key's keyUp events
 */
export const unbindKeyUp = (...args) => {
  //loop through every argument and remove the callback from the keyUp array
  for (let i=0; i<args.length - 1; i++) {
    //Get the key code
    let keyCode = getKeyCode(args[i]);
    if (typeof(keys[keyCode]) === "undefined") continue;
    keys[keyCode].keyUp.splice(keys[keyCode].keyUp.indexOf(args[args.length - 1]), 1);
  }
}

/**
 * Return whether a key is pressed
 * Accepts the char code or a string
 */
export const pressed = (key) => {
  //Get the key code
  let keyCode = getKeyCode(key);
  //If data does not exist for this key, create it
  if (typeof(keys[keyCode]) === "undefined") {
    keys[keyCode] = {
      pressed: false,
      keyDown: [],
      keyUp: []
    };
  }
  //Return whether or not the key is pressed
  return keys[keyCode].pressed;
}

/**
 * Binds a function to the mouse scrolling
 * an integer will be passed in to the function to determine direction
 */
export const scroll = callback => {
  scrollCallbacks.push(callback);
}

/**
 * Returns the numerical keycode given a string
 * Does nothing if an integer is passed
 * This only covers the most common keys.  More can be added easily by adding
 * their string to the switch statement
 */
export const getKeyCode = (key) => {
  if (key === 'mouseButton') return key;
  if (key === 'touches') return key;
  let keyCode = key;
  if (typeof key === 'string') {
    //This is probably inefficient
    switch (key) {
      case "=":
        keyCode = 187;
        break;
      case "+":
        keyCode = 187;
        break;
      case "-":
        keyCode = 189;
        break;
      case "up":
        keyCode = 38;
        break;
      case "down":
        keyCode = 40;
        break;
      case "left":
        keyCode = 37;
        break;
      case "right":
        keyCode = 39;
        break;
      case "space":
        keyCode = 32;
        break;
      case "shift":
        keyCode = 16;
        break;
      case "ctrl":
        keyCode = 17;
        break;
      case "alt":
        keyCode = 18;
        break;
      case "tab":
        keyCode = 9;
        break;
      case "enter":
        keyCode = 13;
        break;
      case "backspace":
        keyCode = 8;
        break;
      case "esc":
        keyCode = 27;
        break;
      case "del":
        keyCode = 46;
        break;
      case "ins":
        keyCode = 45;
        break;
      case "windows":
        keyCode = 91;
        break;
      default:
        keyCode = key.toUpperCase().charCodeAt(0);
        break;
    }
  }
  return keyCode;
}

export const mouse = () => {
  return mouseCoords;
}

export const mouseMove = (cb) => {
  mouseMoveCallbacks.push(cb);
}

export const touch = (id) => {
  return keys.touches.refs[id];
}

export const touchMove = (cb, id = undefined) => {
  if (id === undefined) {
    touchMoveCallbacks.all.push(cb);
    return;
  }
  if (typeof touchMoveCallbacks[id] === Array) {
    touchMoveCallbacks[id].push(cb);
  } else {
    touchMoveCallbacks[id] = [cb];
  }
}

export const unbindTouchMove = (cb, id) => {
  if (!id) {
    touchMoveCallbacks.all.splice(touchMoveCallbacks.all.indexOf(cb), 1);
    return;
  }
  touchMoveCallbacks[id].splice(touchMoveCallbacks[id].indexOf(cb), 1);
}
