var context = require.context('./JavaScript_server', true, /-test\.js$/);
context.keys().forEach(context);
