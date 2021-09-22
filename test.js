const tiles = [
  {
    image:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/49240/ui8-alex-shutin-kKvQJ6rK6S4-unsplash.jpg",
    thumb:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/49240/ui8-alex-shutin-kKvQJ6rK6S4-unsplash--thumb.jpg",
    title: "Summer treads on <br />the heels of spring.",
    nextTitle: "Blue <br />Mountains",
  },
  {
    image:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/49240/ui8-marat-gilyadzinov-MYadhrkenNg-unsplash.jpg",
    thumb:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/49240/ui8-marat-gilyadzinov-MYadhrkenNg-unsplash--thumb.jpg",
    title: "Jellyfish make <br />everything better.",
    nextTitle: "Squishy <br />Jellies",
  },
  {
    image:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/49240/ui8-luca-bravo-bTxMLuJOff4-unsplash.jpg",
    thumb:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/49240/ui8-luca-bravo-bTxMLuJOff4-unsplash--thumb.jpg",
    title: "Design adds value <br />faster than it adds costs.",
    nextTitle: "Paper <br />Cut",
  },
];

let activeIndex = 0;
const nextButton = document.querySelector(".next-tile");
updateTileRatio();
populateInitialData();
nextButton.addEventListener("click", nextTile);

// ---------------------
// Populate initial data
// ---------------------

function populateInitialData() {
  // It would be better to target the individual elements as you can't be sure that the arrays below...
  // ...will only contain 2 items. But it's my pen and I'm sureee that there's only 2 elements ;-P
  const tileImages = document.querySelectorAll(".tile__img");
  tileImages[0].src = `${tiles[activeIndex].image}`;
  tileImages[1].src = `${tiles[getNextIndex()].image}`;

  const tileTitles = document.querySelectorAll(".title__text");
  tileTitles[0].innerHTML = tiles[activeIndex].title;
  tileTitles[1].innerHTML = tiles[getNextIndex()].title;

  const nextButtonImages = document.querySelectorAll(
    ".next-tile__preview__img"
  );
  nextButtonImages[0].src = `${tiles[getNextIndex()].thumb}`;
  nextButtonImages[1].src = `${tiles[getNextIndex(1)].thumb}`;

  const nextButtonTitles = document.querySelectorAll(".next-tile__title__text");
  nextButtonTitles[0].innerHTML = tiles[getNextIndex()].nextTitle;
  nextButtonTitles[1].innerHTML = tiles[getNextIndex(1)].nextTitle;
}

// ------------------------
// Set the tile image ratio
// ------------------------

// Why are we doing this and not just using object: cover in CSS?
// Large images, cover, Chrome, and Greensock don't play well together. On the first tile transition...
// ...you will see a noticable studder. This disappears on initial transitions but it's enough to prevent me from using it...
// If anybody knows a workaround to prevent the studder, please let me know!

function updateTileRatio() {
  const browserWidth = document.body.clientWidth;
  const browserHeight = document.body.clientHeight;
  const browserRatio = browserWidth / browserHeight;
  const imageWidth = 3000; // Yeah yeah yeah, magic numbers... let's just say this is what my spec is set to - if we have to use a different size we will find another way to get the values
  const imageHeight = 2000;
  const imageRatio = imageWidth / imageHeight;
  const tileImages = document.querySelectorAll(".tile__img");

  // This could be a bit better if we checked to see if we even need to fire the stuff below...
  // ...if the ratio is still the same with a browser resize we should just skip over all of this code. #laziness #itsjustapen

  if (browserRatio < imageRatio) {
    for (let i = 0; i < tileImages.length; i++) {
      tileImages[i].style.width = "auto";
      tileImages[i].style.height = "100%";
    }
  } else {
    for (let i = 0; i < tileImages.length; i++) {
      tileImages[i].style.width = "100%";
      tileImages[i].style.height = "auto";
    }
  }
}

// ---------------
// Screen resized!
// ---------------

window.addEventListener("resize", screenResized);

// You might want to use a debouncer or something to prevent this function from firing too many times...
// ...but for this demo we will leave it (https://davidwalsh.name/javascript-debounce-function)
function screenResized() {
  updateTileRatio();
}

// ---------------
// Title animation
// ---------------

const titleAnimation = new TimelineMax({ paused: true })
  .to(
    ".title__container",
    0.8,
    { ease: Power2.easeOut, yPercent: -50 },
    "titleAnimation"
  )
  .to(".title__text--first", 0.5, { opacity: 0 }, "titleAnimation")
  .eventCallback("onComplete", () => {
    // Update the titles and reset the animation so that we could...
    // ...just play the same animation on next click
    titleAnimation.progress(0).pause();

    const titles = document.querySelectorAll(".title__text");
    titles[0].innerHTML = tiles[activeIndex].title;
    titles[1].innerHTML = tiles[getNextIndex()].title;
  });

// --------------------------
// Next tile button animation
// --------------------------

// Mixing css set properties with Greensock properties causes rendering issues...
// ...so it's best to set positioning of anything that will change using .set()
// https://greensock.com/forums/topic/20822-animation-co-ordinates-wrong-after-resize/?tab=comments#comment-97600
TweenMax.set(".next-tile__preview img", { top: "50%", right: "0", y: "-50%" });
TweenMax.set(".tile__img", { top: "50%", left: "50%", x: "-50%", y: "-50%" });
TweenMax.set(".tile__img--last", { scale: 1.2, opacity: 0.001 }); // Setting opacity 0 here causes lag on initial play, this dissapears later on, will open a ticket and see if this is a known issue
TweenMax.set(".tile__img--first, .title__img--last", {
  yPercent: -50,
  xPercent: -50,
});
TweenMax.set(".title", { y: "-50%", width: "100%" });
TweenMax.set(".title__container", { width: "100%" });

// Text change animation
const nextTextAnimation = new TimelineMax({ paused: true })
  .to(".next-tile__title__text--first", 0.4, { opacity: 0 }, "textChange")
  .to(".next-tile__title__text--last", 0.4, { opacity: 1 }, "textChange");

// Slide next tile to reveal new image
const titles = document.querySelectorAll(".next-tile__title__text");
const tileImages = document.querySelectorAll(".tile__img");
const previewImages = document.querySelectorAll(".next-tile__preview__img");
const nextButtonAnimation = new TimelineMax({ paused: true })
  .to(".next-tile__details", 0.6, { ease: Power1.easeOut, xPercent: 80 })
  .to(".tile__img--last", 0.6, { ease: Sine.easeOut, opacity: 1, scale: 1 }, 0)
  .to(".next-tile__preview__img--first", 0, { opacity: 0 }, "sliderClosed")
  .to(
    ".next-tile__preview__img--last",
    0.6,
    { ease: Sine.easeOut, opacity: 1, scale: 1 },
    "sliderClosed"
  )
  .to(
    ".next-tile__details",
    0.5,
    { ease: Sine.easeOut, xPercent: 0 },
    "sliderClosed+=0.15"
  )
  .add(() => nextTextAnimation.play(), "-=0.5")
  .eventCallback("onComplete", () => {
    nextButtonAnimation.progress(0).pause();
    nextTextAnimation.progress(0).pause();

    tileImages[0].src = `${tiles[activeIndex].image}`;
    tileImages[1].src = `${tiles[getNextIndex()].image}`;

    previewImages[0].src = `${tiles[getNextIndex()].thumb}`;
    previewImages[1].src = `${tiles[getNextIndex(1)].thumb}`;

    titles[0].innerHTML = tiles[getNextIndex()].nextTitle;
    titles[1].innerHTML = tiles[getNextIndex(1)].nextTitle;
  });

// -------
// Helpers
// -------

function getNextIndex(skipSteps = 0) {
  let newIndex = activeIndex;
  incrementIndex();

  for (let i = 0; i < skipSteps; i++) {
    incrementIndex();
  }

  function incrementIndex() {
    if (newIndex >= tiles.length - 1) {
      newIndex = 0;
    } else {
      newIndex = newIndex + 1;
    }
  }

  return newIndex;
}

// -----------
// Tile Change
// -----------

function nextTile() {
  // We want to prevent clicking on the next tile button if an animation is active...
  // ...to prevent the animations from being interupted mid animation.
  if (
    !titleAnimation.isActive() &&
    !nextButtonAnimation.isActive() &&
    !nextTextAnimation.isActive()
  ) {
    activeIndex = getNextIndex();
    titleAnimation.play();
    nextButtonAnimation.play();
  }
}

// ------------------------------
// Initialize all timeline values
// ------------------------------

titleAnimation.progress(1).progress(0);
nextButtonAnimation.progress(1).progress(0);
nextTextAnimation.progress(1).progress(0);

// content sourced from https://codepen.io/MarioD/pen/OKyVob
