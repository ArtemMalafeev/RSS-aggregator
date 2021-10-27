const runTimer = (func, time) => {
  setTimeout(() => {
    console.log('Я запустился!');
    runTimer(func, time);
  });
};

export default runTimer;
