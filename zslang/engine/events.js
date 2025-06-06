// Events and hooks for ZSL

const eventHooks = {};

function onEvent(eventName, handler) {
  if (!eventHooks[eventName]) eventHooks[eventName] = [];
  eventHooks[eventName].push(handler);
}

function triggerEvent(eventName, ...args) {
  if (eventHooks[eventName]) {
    for (const handler of eventHooks[eventName]) {
      try {
        handler(...args);
      } catch (e) {
        // Optionally log error
      }
    }
  }
}

function clearEvent(eventName) {
  if (eventHooks[eventName]) eventHooks[eventName] = [];
}

export { onEvent, triggerEvent, clearEvent, eventHooks };
