import Navigation from "./component/navigation.js";
import "./component/tasklist.js";
import "./component/dictionary.js";
import "./component/pomodoro.js";
import "./component/stopwatch.js";
import "./component/music.js";

document.addEventListener("DOMContentLoaded", function () {
  // Timer tab navigation
  const links = document.querySelectorAll(".timer-nav > ul > li > a");
  const pages = document.querySelectorAll(".timer-page-container");

  if (links.length && pages.length) {
    const timerNav = new Navigation(links, pages);

    // Set default page
    timerNav.init("pomodoro");

    timerNav.links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const pageId = timerNav.getHash(link);
        if (!pageId || pageId === timerNav.currentPage) return;

        timerNav.setPage(pageId);
      });
    });
  }

  // Multiple modals
  const modals = document.getElementsByClassName("modal");
  const openButtons = document.getElementsByClassName("openBtn");
  const closeButtons = document.getElementsByClassName("closeBtn");

  function openModal(index) {
    if (modals[index]) {
      modals[index].style.display = "block";
    }
  }

  function closeModal(index) {
    if (modals[index]) {
      modals[index].style.display = "none";
    }
  }

  function closeAllModals() {
    Array.from(modals).forEach((modal) => {
      modal.style.display = "none";
    });
  }

  Array.from(openButtons).forEach((button, index) => {
    button.addEventListener("click", function () {
      openModal(index);
    });
  });

  Array.from(closeButtons).forEach((button, index) => {
    button.addEventListener("click", function () {
      closeModal(index);
    });
  });

  // Close modal on backdrop click
  window.addEventListener("click", function (event) {
    Array.from(modals).forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Escape key closes all open modals
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
});