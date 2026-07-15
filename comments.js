// NetCentric Computing - Comment box
// Stores comments in the browser's localStorage so they remain
// on the page the next time it is opened, AND emails a copy to the
// student using Formspree (https://formspree.io) so Dr Anietie's
// comment also reaches the student's inbox from any device.
//
// SETUP: Sign up free at https://formspree.io, create a form, and
// replace YOUR_FORM_ID below with the ID Formspree gives you
// (it looks like https://formspree.io/f/abcdwxyz -> ID is "abcdwxyz").

var FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvgvvbv";
var STORAGE_KEY = "netcentric_jwmboso060_comments";

function loadComments() {
  var raw = localStorage.getItem(STORAGE_KEY);
  var list = raw ? JSON.parse(raw) : [];
  var container = document.getElementById("commentList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p style='color:#888;font-size:13px;'>No comments yet.</p>";
    return;
  }

  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    var div = document.createElement("div");
    div.className = "comment-item";
    div.innerHTML = "<strong>" + escapeHtml(c.name) + "</strong>" +
      "<span class='comment-date'>" + c.date + "</span>" +
      "<p style='margin:6px 0 0 0;'>" + escapeHtml(c.text) + "</p>";
    container.appendChild(div);
  }
}

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function addComment(e) {
  e.preventDefault();
  var nameField = document.getElementById("commenterName");
  var textField = document.getElementById("commentText");
  var statusEl = document.getElementById("formStatus");

  var name = nameField.value.trim() || "Dr Anietie";
  var text = textField.value.trim();
  if (!text) return;

  // 1) Save locally so the comment shows on this page immediately,
  //    and again the next time the page is opened on this device.
  var raw = localStorage.getItem(STORAGE_KEY);
  var list = raw ? JSON.parse(raw) : [];
  list.push({
    name: name,
    text: text,
    date: new Date().toLocaleString()
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  loadComments();

  // 2) Also send the comment to Formspree, which emails it to the
  //    student's inbox. This works even if Dr Anietie opens the site
  //    on a different device than the student.
  if (FORMSPREE_ENDPOINT.indexOf("YOUR_FORM_ID") !== -1) {
    statusEl.textContent = "Saved on this page. (Set up your Formspree ID in comments.js to also email this.)";
    statusEl.className = "form-status error";
    textField.value = "";
    return;
  }

  statusEl.textContent = "Sending...";
  statusEl.className = "form-status sending";

  fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: new URLSearchParams({ name: name, message: text })
  })
    .then(function (response) {
      if (response.ok) {
        statusEl.textContent = "Saved and emailed successfully.";
        statusEl.className = "form-status success";
      } else {
        statusEl.textContent = "Saved here, but the email could not be sent.";
        statusEl.className = "form-status error";
      }
    })
    .catch(function () {
      statusEl.textContent = "Saved here, but the email could not be sent (check your connection).";
      statusEl.className = "form-status error";
    });

  textField.value = "";
}

document.addEventListener("DOMContentLoaded", function () {
  loadComments();
  document.getElementById("commentForm").addEventListener("submit", addComment);
});
