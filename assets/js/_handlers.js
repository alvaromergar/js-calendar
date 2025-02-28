import { swapTemplate, removeTemplate } from "./_templates.js";
import { formValidation } from "./_form_validation.js";
import { calendarEvent } from "./_events.js";
import * as render from "./_month_render.js";
import { setReminder } from "./_reminder.js";


let remindersArr = [];

/*
 * All listeners are listed here
 *
 */
export function handleDocumentEvents() {
  /* Click event */
  document.addEventListener("click", (e) => {
    /* Click btn year */
    if (e.target.matches("button#btnYear")) {
      clearSelectedBtn();
      swapTemplate("year", "calendar");
      swapTemplate("buttons__year", "container__btn__weekMonthYear");
      render.addTagYear(updatedYear);
      render.renderYear(updatedYear);
      render.highlightTodayYear(updatedYear);
      e.target.classList.add("nav__center--selected");
    }

    /* Click btn month */
    if (e.target.matches("button#btnMonth")) {
      clearSelectedBtn();
      swapTemplate("month", "calendar");
      swapTemplate("buttons__month", "container__btn__weekMonthYear");
      render.addTag(updatedYear, updatedMonth);
      render.renderMonth(updatedYear, updatedMonth);
      render.renderEvents(updatedYear, updatedMonth);
      render.highlightToday(updatedYear, updatedMonth);
      render.renderMonthList();
      render.checkEventsVisibility();
      render.checkExpiredEvents();
      e.target.classList.add("nav__center--selected");
    }

    /* Click btn week */
    // Show modal
    if (e.target.matches("button#show-week")) {
      clearSelectedBtn();
      const view = document.querySelector("#calendar")
      render.renderWeekView(view);
      e.target.classList.add("nav__center--selected");
    }

    /* Button to view more events */
    // Show modal
    if (e.target.matches(".hidden-events")) {
      const d = document;
      showPopupEvents(e, "#calendar");
      setTimeout(() => {
        d.querySelector(".cloned-day").classList.add("scaling");
      }, 0);
    }

    /* Show / hide modal popup */
    // show modal
    if (e.target.matches("span.retract")) {
      const clnModal = document.querySelector(".cloned-day");
      if (clnModal) {
        clnModal.remove();
      }
    }

    /* Show / hide modal popup */
    // show modal
    if (
      e.target.matches("button#create-event") ||
      e.target.matches("button#create-event *")
    ) {
      const clnModal = document.querySelector(".cloned-day");
      if (clnModal) {
        clnModal.remove();
      }
      swapTemplate("modal-template", "modal-section");
    }
    /* Close modal */
    if (e.target.matches(".close")) {
      removeTemplate("modal-template", "modal-section");
    }

    /* Form validation */
    if (e.target.matches('input[value="Create"]')) {
      e.preventDefault();

      if (!formValidation(e, true)) {
        const data = calendarEvent.getDataFromModal("#modal form");
        calendarEvent.toLocalStorage(data);
        setReminder(remindersArr);
        removeTemplate("modal-template","modal-section")
        if(document.querySelector("#calendar > div").className != "calendar__year--row") {
          render.renderEvents(updatedYear, updatedMonth);
          render.checkEventsVisibility();
          render.checkExpiredEvents();
        }
      }
    }

    /* Buttons to switch month */
    if (e.target.matches(".btn__month__right")) {
      addMonth(updatedYear, updatedMonth, true);
      document.querySelector("#calendar").classList.add("swing-right-fwd");
    }
    if (e.target.matches(".btn__month__left")) {
      addMonth(updatedYear, updatedMonth, false);
      document.querySelector("#calendar").classList.add("swing-left-fwd");
    }

    /* Buttons to switch year */
    if (e.target.matches(".btn__year__right")) {
      addYear(updatedYear, true);
      document
        .querySelector(".calendar__year--row")
        .classList.add("swing-right-fwd");
    }
    if (e.target.matches(".btn__year__left")) {
      addYear(updatedYear, false);
      document
        .querySelector(".calendar__year--row")
        .classList.add("swing-left-fwd");
    }

    /* Mobile burguer menu */
    if (e.target.matches("#navOpen") || e.target.matches("#navOpen *")) {
      document.getElementById("alert__shadowMain").style.display = "block";
      document.getElementById("main").style.display = "block";
      swapTemplate("template__mobile", "main");
      render.renderNavEvents();
    }
    if (e.target.matches("#navClose i") || e.target.matches("#navClose i *") || e.target.matches("#alert__shadowMain")) {
      document.getElementById("main").style.display = "none";
      document.getElementById("alert__shadowMain").style.display = "none";
      removeTemplate("template__mobile", "main");
    }

    /* Checkbox End-date */
    if (e.target.matches('[name="end-check"]')) {
      const check = document.querySelector('[name="end-date"]');
      // check.disabled ? (check.disabled = false) : (check.disabled = true);
      const end = document.querySelector(".ending-date");
      end.classList.toggle("height-reset");
    }

    /* Click in event */
    if (e.target.matches("[data-eventid]")) {
      const clnModal = document.querySelector(".cloned-day");
      if (clnModal) {
        clnModal.remove();
      }
      [_event] = calendarEvent.getEvent(e.target.dataset.eventid);
      swapTemplate("alert-template", "modal-section");
      calendarEvent.printDataToAlert(_event);
    }

    /* Click in edit event */
    if (e.target.matches(".edit")) {
      swapTemplate("edit-template", "modal-section");
      calendarEvent.printDataToEdit(_event);
    }

    /* Form validation for edit */
    if (e.target.matches('input[value="Save"]')) {
      e.preventDefault();

      if (!formValidation(e, true)) {
        calendarEvent.modifyEvent(_event);
        removeTemplate("edit-template", "modal-section");
        render.renderEvents(updatedYear, updatedMonth);
        setReminder(remindersArr);
        render.checkEventsVisibility();
        render.checkExpiredEvents();
      }
    }

    /* Click in remove event */
    if (e.target.matches(".remove")) {
      removeTemplate("alert-template", "modal-section");
      calendarEvent.removeEvent(_event);
      setReminder(remindersArr);
      render.checkEventsVisibility();
    }

    /* Click on day to show modal */
    if (e.target.matches(".calendar__week > div")) {
      if(e.target.id !== ""){
     
        const day = e.target.id,
          month = document.querySelector("#nav__tag").textContent,
          year = document.querySelector("#nav__year").textContent,
          monthMobile = document.querySelector("#nav__mobile--tag").textContent,
          yearMobile = document.querySelector("#nav__mobile--year").textContent;

        const clnModal = document.querySelector(".cloned-day");
        if (clnModal) {
          clnModal.remove();
        }

        swapTemplate("modal-template", "modal-section");
        const initDate = document.querySelector('[name="init-date"]');
        initDate.value = render.getDateTimeFormat(year, month, day);
      }
    }

    /* Click on reminder */
    if (e.target.matches('[name="reminder"]')) {
      const rm = document.querySelector(".reminder-time");
      rm.classList.toggle("height-reset");
    }

    /* Click month tag */
    if (e.target.matches("#nav__tag, #nav__year")) {
      const rm = document.querySelector(".month-list");
      rm.classList.toggle("show");
    }
    if (e.target.matches(".month-list *")) {
      const ev = e.target,
        month = ev.dataset.month || ev.firstChild.dataset.month,
        rm = document.querySelector(".month-list");

      goToMonth(updatedYear, parseInt(month));
      rm.classList.toggle("show");
    }
    
  });

  /* Focusout event */
  document.addEventListener("focusout", (e) => {
    if (e.target.matches("input[required]")) {
      formValidation(e, false);
    }
  });

  /* Resize */
  window.addEventListener("resize", render.checkEventsVisibility);

  /* Keyboard */
  document.addEventListener("keydown", accessKeyboard);
  function accessKeyboard(e) {
    const focusableInputs = document.querySelectorAll(".focus");
    const focusable = Array.from(focusableInputs);
    let index = focusable.indexOf(document.activeElement);
    let nextIndex = 0;

    /* Tab key */
    if (e.keyCode === 9) {
      e.preventDefault();
      if (index >= 0) {
        nextIndex = index + 1;
      } else {
        nextIndex = 0;
      }
      if (index == 5) {
        nextIndex = 0;
      }
      /* Shift key */
      if (e.keyCode === 16) {
        e.preventDefault();
        if (index >= 0) {
          nextIndex = index + 1;
        } else {
          nextIndex = 0;
        }
        if (index == 5) {
          nextIndex = 0;
        }
      }
      focusableInputs[nextIndex].focus();
      e.stopPropagation();
    }
    /* Escape to close modal */
    if (e.keyCode === 27) {
      removeTemplate("modal-template", "modal-section");
    }
  }

  /* Animation end */
  document.addEventListener("animationend", (e) => {
    /* Clear animations */
    const swing = document.querySelectorAll(
      ".swing-right-fwd, .swing-left-fwd"
    );
    swing.forEach((element) => {
      const cls = element.classList;
      cls.contains("swing-right-fwd") ? cls.remove("swing-right-fwd") : 0;
      cls.contains("swing-left-fwd") ? cls.remove("swing-left-fwd") : 0;
    });
  });
}

let _event;
let updatedMonth = new Date().getMonth();
let updatedYear = new Date().getFullYear();
function addMonth(year, month, direction) {
  direction ? month++ : month--;
  updatedYear = render.updateDate(year, month).year;
  updatedMonth = render.updateDate(year, month).month;
  swapTemplate("month", "calendar");
  render.renderMonth(updatedYear, updatedMonth);
  render.addTag(updatedYear, updatedMonth);
  render.highlightToday(year, month);
  render.renderEvents(year, month);
  render.renderMonthList();
  render.checkEventsVisibility();
  render.checkExpiredEvents();
}

/* This render month without adding */
// To add month use _handlers.js/addMonth
export function goToMonth(year, month) {
  updatedYear = year;
  updatedMonth = month;
  swapTemplate("month", "calendar");
  render.renderMonth(year, month);
  render.addTag(year, month);
  render.highlightToday(year, month);
  render.renderEvents(year, month);
  render.renderMonthList();
  render.checkEventsVisibility();
  render.checkExpiredEvents();
}

/* This render month without adding */
// To add month use _handlers.js/addMonth
function showPopupEvents(e, parent) {
  let itm = e.target.parentElement;
  let cln = itm.cloneNode(true);

  /* Replace "ver mas" -> "ver menos" */
  for (const iterator of cln.children) {
    const clnModal = document.querySelector(".cloned-day");
    if (clnModal) {
      clnModal.remove();
    }

    if (iterator.classList.contains("hidden-events")) {
      iterator.textContent = "X";
      iterator.className = "retract";
    }
  }

  /* Hide events based on height of container */
  const ev = cln.querySelectorAll("[data-eventid]");
  ev.forEach((v) => {
    if (v.classList.contains("visibility-hidden")) {
      v.classList.remove("visibility-hidden");
    }
  });

  /* Apply same dimensions and position of container */
  const container = document.createElement("div"),
    p = document.querySelector(parent);
  container.classList.add("cloned-day");
  container.style.top = e.target.parentElement.offsetTop + "px";
  container.style.left = e.target.parentElement.offsetLeft + "px";
  container.style.width = e.target.parentElement.offsetWidth + "px";

  container.appendChild(cln);
  p.appendChild(container);
}

function addYear(year, boolean) {
  boolean ? year++ : year--;
  updatedYear = render.updateDate(year).year;
  swapTemplate("year", "calendar");
  render.addTagYear(updatedYear);
  render.renderYear(updatedYear);
  render.highlightTodayYear(year)
}

function clearSelectedBtn(){
  const buttons = document.querySelectorAll(".nav__center button");
  buttons.forEach(el => {
    if (el.classList.contains("nav__center--selected")) {
      el.classList.remove("nav__center--selected");
    }
  });
}