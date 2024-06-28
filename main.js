"use strict";

// @author Agezao/confetti-js
function ConfettiGenerator(params) {
  let appstate = {
    target: "",
    max: 80,
    size: 1,
    animate: true,
    respawn: true,
    props: [],
    clock: 25,
    rotate: false,
    start_from_edge: false,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  appstate = { ...appstate, ...params };
  const canvas = appstate.target;
  const ctx = canvas.getContext("2d");
  let particles = [];

  function rand(limit, floor) {
    if (!limit) limit = 1;
    var rand = Math.random() * limit;
    return !floor ? rand : Math.floor(rand);
  }

  function particleFactory() {
    var prop = appstate.props[rand(appstate.props.length, true)];
    var p = {
      x: rand(appstate.width),
      y: appstate.start_from_edge ? (appstate.clock >= 0 ? -10 : parseFloat(appstate.height) + 10) : rand(appstate.height),
      image: prop.image,
      size: prop.size,
      rotate: appstate.rotate,
      rotation: (rand(360, true) * Math.PI) / 180,
      speed: rand(appstate.clock / 7) + appstate.clock / 30,
    };
    return p;
  }

  function particleDraw(p) {
    ctx.save();
    var size = p.size || 15;
    ctx.translate(p.x + size / 2, p.y + size / 2);
    if (p.rotate) {
      ctx.rotate(p.rotation);
    }
    ctx.drawImage(p.image, -(size / 2) * appstate.size, -(size / 2) * appstate.size, size * appstate.size, size * appstate.size);
    ctx.restore();
  }

  canvas.width = appstate.width;
  canvas.height = appstate.height;
  particles = [];
  for (var i = 0; i < appstate.max; i++) {
    particles.push(particleFactory());
  }
  function draw() {
    ctx.clearRect(0, 0, appstate.width, appstate.height);
    for (var i in particles) {
      particleDraw(particles[i]);
    }
    update();
    if (appstate.animate) {
      requestAnimationFrame(draw);
    }
  }

  function update() {
    for (var i = 0; i < appstate.max; i++) {
      var p = particles[i];
      if (p) {
        if (appstate.animate) p.y += p.speed;
        if (p.rotate) p.rotation += p.speed / 35;
        if ((p.speed >= 0 && p.y > appstate.height) || (p.speed < 0 && p.y < 0)) {
          if (appstate.respawn) {
            particles[i] = p;
            particles[i].x = rand(appstate.width, true);
            particles[i].y = p.speed >= 0 ? -10 : parseFloat(appstate.height);
          } else {
            particles[i] = undefined;
          }
        }
      }
    }
  }

  requestAnimationFrame(draw);
}

function makeSvgsList(prefix) {
  let list = [];
  for (let i = 1; i < 8; i++) {
    const image = new Image();
    image.src = `svgs/${prefix}${i}.svg`;
    list.push({ type: "svg", image, size: 40 });
  }
  return list;
}

const canvas = document.getElementById("my-canvas");
const canvas2 = document.getElementById("my-canvas2");
const confettiSettings = {
  target: canvas,
  max: "18",
  animate: true,
  rotate: true,
  props: makeSvgsList("r"),
  clock: "30",
  width: "800",
  height: "1080",
  respawn: true,
};
const confettiSettings2 = {
  target: canvas2,
  max: "7",
  animate: true,
  rotate: true,
  props: makeSvgsList("r"),
  clock: "30",
  width: "800",
  height: "1080",
  respawn: true,
};
ConfettiGenerator(confettiSettings);
ConfettiGenerator(confettiSettings2);

const videoStream = canvas.captureStream(30);
const videoStream2 = canvas2.captureStream(30);
const mediaRecorder = new MediaRecorder(videoStream);
const mediaRecorder2 = new MediaRecorder(videoStream2);
let chunks = [];
let chunks2 = [];
mediaRecorder.start();
mediaRecorder2.start();
mediaRecorder.ondataavailable = function (e) {
  chunks.push(e.data);
};
mediaRecorder.onstop = function () {
  var blob = new Blob(chunks, { type: "video/webm" });
  var videoURL = URL.createObjectURL(blob);
  const aTag = document.createElement("a");
  aTag.href = videoURL;
  aTag.download = "input.webm";
  aTag.click();
};
mediaRecorder2.ondataavailable = function (e) {
  chunks2.push(e.data);
};
mediaRecorder2.onstop = function () {
  var blob = new Blob(chunks2, { type: "video/webm" });
  var videoURL = URL.createObjectURL(blob);
  const aTag = document.createElement("a");
  aTag.href = videoURL;
  aTag.download = "input2.webm";
  aTag.click();
};
setInterval(() => {
  console.count();
}, 1000);
setTimeout(() => {
  mediaRecorder.stop();
  mediaRecorder2.stop();
}, 25000);
